// Reproduz uma sequência de frames como um scrub de vídeo, sem decoder.
// Mantém em memória apenas uma janela pequena de bitmaps decodificados ao redor
// do frame atual — o resto é carregado sob demanda e descartado (bitmap.close()).
// Isso é o que garante fluidez em mobile, onde memória e CPU são limitadas.

export function createFramePlayer({ canvas, frameCount, getSrc, windowSize = 6 }) {
	const ctx = canvas.getContext('2d', { alpha: false });
	const cache = new Map(); // index -> ImageBitmap
	const pending = new Set();
	let current = -1;
	let destroyed = false;

	const evict = () => {
		for (const [index, bitmap] of cache) {
			if (Math.abs(index - current) > windowSize + 3) {
				bitmap.close();
				cache.delete(index);
			}
		}
	};

	const draw = (index) => {
		const bitmap = cache.get(index);
		if (!bitmap) return;
		ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	};

	const load = (index) => {
		if (index < 0 || index >= frameCount || cache.has(index) || pending.has(index)) return;
		pending.add(index);

		fetch(getSrc(index))
			.then((response) => {
				if (!response.ok) throw new Error(`frame ${index}`);
				return response.blob();
			})
			.then((blob) => createImageBitmap(blob))
			.then((bitmap) => {
				pending.delete(index);
				if (destroyed) {
					bitmap.close();
					return;
				}
				cache.set(index, bitmap);
				evict();
				if (index === current) draw(index);
			})
			.catch(() => pending.delete(index));
	};

	// Pré-carrega o frame atual e uma janela ao redor, priorizando o atual.
	const prime = (index) => {
		load(index);
		for (let offset = 1; offset <= windowSize; offset += 1) {
			load(index - offset);
			load(index + offset);
		}
	};

	return {
		setProgress(progress) {
			if (destroyed) return;
			const index = Math.max(0, Math.min(frameCount - 1, Math.round(progress * (frameCount - 1))));
			if (index === current) return;
			current = index;
			prime(index);
			draw(index);
		},
		destroy() {
			destroyed = true;
			pending.clear();
			cache.forEach((bitmap) => bitmap.close());
			cache.clear();
		},
	};
}
