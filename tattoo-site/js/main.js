import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createFramePlayer } from './framePlayer.js';

gsap.registerPlugin(ScrollTrigger);

// Frames do scrub da quarta sessão. Precisam ser importados para que o Vite
// os copie para o dist: um caminho literal como "assets/video-frames-hd/..."
// funciona no dev server, mas no deploy esses arquivos não existem (404).
// O Vite exige string literal direta em import.meta.glob (não pode vir de
// variável), por isso os dois globs são escritos separadamente.
const hdFrameModules = import.meta.glob('../assets/video-frames-hd/*.webp', {
	eager: true, query: '?url', import: 'default',
});
const mobileFrameModules = import.meta.glob('../assets/video-frames-mobile/*.webp', {
	eager: true, query: '?url', import: 'default',
});

const sortFrames = (modules) => Object.entries(modules)
	.sort(([first], [second]) => first.localeCompare(second))
	.map(([, url]) => url);

const hdFrames = sortFrames(hdFrameModules);
const mobileFrames = sortFrames(mobileFrameModules);

// Capas do TORUS: "novo" primeiro, depois as numeradas (2, 3, 4...).
const coverModules = import.meta.glob('/assets/TITULO DA HERO*.png', {
	eager: true,
	query: '?url',
	import: 'default',
});

const heroCovers = Object.entries(coverModules)
	.filter(([path]) => path !== '/assets/TITULO DA HERO.png')
	.sort(([first], [second]) => {
		const rank = (path) => {
			const number = path.match(/HERO (\d+)/)?.[1];
			if (number) return Number(number);
			return path.includes('novo') ? 0 : 99;
		};
		return rank(first) - rank(second);
	})
	.map(([, src]) => src);

function finishPreloader(preloader, site) {
	// Libera a página imediatamente quando a animação não deve ser executada.
	preloader.style.display = "none";
	document.body.classList.remove("preloader-active");
	gsap.set(site, { opacity: 1, y: 0 });
	gsap.set(site, { clearProps: "transform" });

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		gsap.set(site.querySelector("h1"), { opacity: 1, y: 0 });
		window.initDepoimentosCarousel?.();
		window.initJhowCarousel?.();
		window.initSessaoButton?.();
		window.initMeaningButton?.();
		window.initClientInfoButton?.();
		window.initGaleriaButton?.();
		// Sem animação, exibe os valores finais das estatísticas.
		site.querySelectorAll(".stat__number").forEach((element) => {
			element.textContent = `${element.dataset.target || 0}${element.dataset.suffix || ""}`;
		});
		// Sem animação, mostra um frame estático em vez do vídeo sem carregar.
		const video = site.querySelector(".video-section__media");
		if (video) {
			const poster = document.createElement("img");
			poster.className = "video-section__media";
			poster.src = hdFrames[0] || "";
			poster.alt = "";
			video.replaceWith(poster);
		}
		return;
	}

	initLenis();
	initHero();
	window.initDepoimentosCarousel?.();
	window.initJhowCarousel?.();
	window.initSessaoButton?.();
	window.initMeaningButton?.();
	window.initClientInfoButton?.();
	window.initGaleriaButton?.();
	initAbout();
	initAboutScroll();
	initVideoScroll();
	ScrollTrigger.refresh();
}

let lenis;

function initLenis() {
	// Sincroniza o scroll suave com o ciclo de atualização do GSAP.
	if (typeof Lenis === "undefined") return;

	lenis = new Lenis({ autoRaf: false });
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);

	// Os pins adicionam altura ao documento. Sem avisar o Lenis, o limite de
	// scroll fica desatualizado e a rolagem "trava" ao entrar nas seções fixas.
	ScrollTrigger.addEventListener("refresh", () => lenis?.resize());
}

const HERO_PIN_RATIO = 0.6;

function initHero() {
	const hero = document.querySelector(".hero");
	const titleWord = hero.querySelector(".hero__word");
	const next = document.querySelector(".arc-carousel");

	gsap.to(titleWord, {
		y: 0,
		clipPath: "inset(0% 0 0)",
		duration: 1.35,
		ease: "power4.out",
	});

	// Empilha as capas extras — cada passo do scroll mostra uma nova.
	titleWord?.querySelectorAll(".hero__title-art--extra").forEach((el) => el.remove());
	heroCovers.slice(1).forEach((src) => {
		const img = document.createElement("img");
		img.className = "hero__title-art hero__title-art--extra";
		img.src = src;
		img.alt = "";
		img.setAttribute("aria-hidden", "true");
		titleWord?.appendChild(img);
	});

	const covers = Array.from(titleWord?.querySelectorAll(".hero__title-art") ?? []);
	const setCover = (progress) => {
		if (!covers.length) return;
		const index = Math.min(covers.length - 1, Math.floor(progress * covers.length));
		covers.forEach((cover, i) => cover.classList.toggle("is-active", i === index));
	};
	setCover(0);

	if (next) {
		// A seção seguinte sobe por cima do hero (z-index 2) enquanto ele ainda está preso.
		// A margem negativa compensa exatamente a distância do pin, então nada aparece no início.
		next.style.marginTop = `-${HERO_PIN_RATIO * 100}vh`;

		// Segura a seção um pouco mais abaixo no começo: assim a palavra "TATTOO"
		// continua visível e só depois a seção vem por cima dela.
		gsap.fromTo(next,
			{ y: () => window.innerHeight * 0.3 },
			{
				y: 0,
				ease: "none",
				scrollTrigger: {
					trigger: hero,
					start: "top top",
					end: () => `+=${window.innerHeight * HERO_PIN_RATIO}`,
					scrub: true,
					invalidateOnRefresh: true,
				},
			},
		);
	}

	gsap.to(hero.querySelector(".hero__shade"), {
		opacity: 0.92,
		ease: "none",
		scrollTrigger: {
			trigger: hero,
			start: "top top",
			end: () => `+=${window.innerHeight * HERO_PIN_RATIO}`,
			scrub: true,
			pin: true,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onUpdate: (self) => setCover(self.progress),
		},
	});
}

function initAbout() {
	const about = document.querySelector(".about");
	const photo = about.querySelector(".jhow-photo");
	const copy = about.querySelectorAll(".about__eyebrow, h2, .about__bio, .about__cta, .about__instagram, .about__signature");
	const timeline = gsap.timeline({
		scrollTrigger: {
			// A seção ".about" é deslocada via transform, então o gatilho usa a galeria.
			trigger: ".arc-carousel",
			start: "bottom 95%",
			once: true,
		},
	});

	// Revela a foto e apresenta o texto assim que a terceira seção começa a entrar.
	timeline.to(photo, {
		clipPath: "inset(0% 0 0)",
		duration: 0.7,
		ease: "power3.inOut",
	});
	timeline.to(copy, {
		y: 0,
		opacity: 1,
		duration: 0.5,
		ease: "power3.out",
		stagger: 0.08,
	}, "-=0.45");
}

function initAboutScroll() {
	const about = document.querySelector(".about");
	if (!about) return;
	let attempts = 0;

	const start = () => {
		const api = window.jhowCarouselApi;
		if (!api || api.count < 2) {
			if (attempts++ < 120) requestAnimationFrame(start);
			return;
		}

		// A galeria aparece inteira primeiro. A terceira seção só começa a subir
		// por cima dela (z-index 3) no trecho final da rolagem da galeria.
		gsap.fromTo(about,
			{ y: () => window.innerHeight },
			{
				y: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".arc-carousel",
					start: "bottom 65%",
					end: "bottom top",
					scrub: true,
					invalidateOnRefresh: true,
				},
			},
		);

		// Prende a seção quando a galeria termina, enquanto as 3 fotos passam.
		ScrollTrigger.create({
			// Fixa quando o wrapper chega ao topo da tela. Usar o fim da galeria
			// como gatilho fixava a seção 240px acima e cortava o título "JHOW.".
			trigger: ".about-pin",
			start: "top top",
			// Pin no wrapper: a .about continua animando via transform (y).
			// Pinar o mesmo elemento que recebe o transform causa o pulo na
			// saída do pin, onde a seção reaparece.
			pin: ".about-pin",
			end: () => `+=${window.innerHeight * (api.count - 1) * 0.5}`,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				api.setPosition(self.progress * (api.count - 1));
				// Parallax bem leve no texto da bio enquanto as fotos passam.
				gsap.set(about.querySelector(".about__copy"), { y: -36 + self.progress * 10 });
			},
		});
		ScrollTrigger.refresh();
	};

	start();
}

function initVideoScroll() {
	const section = document.querySelector(".video-section");
	const video = section?.querySelector(".video-section__media");
	if (!section || !video) return;

	const isMobile = window.matchMedia("(max-width: 768px)").matches;
	const frames = isMobile && mobileFrames.length ? mobileFrames : hdFrames;
	const FRAME_COUNT = frames.length;
	const canUseFrames = FRAME_COUNT > 0
		&& typeof createImageBitmap === "function"
		&& typeof fetch === "function";
	let seek;

	if (canUseFrames) {
		// Sequência de imagens: sem decoder de vídeo, sem currentTime, sem engasgo.
		// Em mobile usa frames menores (640x360) e janela de decode mais curta.
		const canvas = document.createElement("canvas");
		canvas.className = "video-section__media";
		canvas.setAttribute("aria-hidden", "true");
		canvas.width = isMobile ? 640 : 960;
		canvas.height = isMobile ? 360 : 540;
		video.replaceWith(canvas);

		const player = createFramePlayer({
			canvas,
			frameCount: FRAME_COUNT,
			getSrc: (index) => frames[index],
			windowSize: isMobile ? 5 : 8,
		});
		seek = (progress) => player.setProgress(progress);
		seek(0);
	} else {
		// Fallback para browsers sem createImageBitmap: seek no vídeo, agrupado
		// em rAF e limitado a um seek por vez para não travar o decodificador.
		video.preload = "auto";
		video.load();
		let seekFrame = 0;
		let lastTarget = -1;
		let seeking = false;

		const applySeek = () => {
			seekFrame = 0;
			if (seeking || Math.abs(lastTarget - video.currentTime) < 0.02) return;
			seeking = true;
			video.currentTime = lastTarget;
		};

		video.addEventListener("seeked", () => {
			seeking = false;
			if (Math.abs(lastTarget - video.currentTime) >= 0.06) applySeek();
		});

		seek = (progress) => {
			const duration = Number.isFinite(video.duration) ? video.duration : 0;
			if (!duration) return;
			const target = Math.max(0, Math.min(1, progress)) * Math.max(0, duration - 0.05);
			if (Math.abs(target - lastTarget) < 0.02) return;
			lastTarget = target;
			if (!seekFrame && !seeking) seekFrame = requestAnimationFrame(applySeek);
		};
		if (video.readyState >= 1) seek(0);
		else video.addEventListener("loadedmetadata", () => seek(0), { once: true });
	}

	const stats = Array.from(section.querySelectorAll(".stat__number"));
	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: section,
			start: "top top",
			end: "+=100%",
			pin: true,
			scrub: 0.8,
			invalidateOnRefresh: true,
			onUpdate: (self) => seek(self.progress),
		},
	});

	stats.forEach((element, index) => {
		const target = Number(element.dataset.target) || 0;
		const suffix = element.dataset.suffix || "";
		const count = { value: 0 };
		timeline.to(count, {
			value: target,
			duration: 0.7,
			ease: "none",
			onUpdate: () => {
				element.textContent = `${Math.round(count.value)}${suffix}`;
			},
		}, index * 0.05);
	});
}

function initPreloader() {
	const preloader = document.querySelector(".preloader");
	const site = document.querySelector(".site");
	const logo = preloader.querySelector(".preloader__logo");
	const counter = preloader.querySelector(".preloader__counter");
	const paths = Array.from(logo.querySelectorAll("path"));

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		finishPreloader(preloader, site);
		return;
	}

	const drawDuration = 2;
	const stagger = 0.02;
	const drawSpan = drawDuration + (paths.length - 1) * stagger;

	// Mede cada traço e prepara o contorno para ser desenhado.
	paths.forEach((path) => {
		const length = path.getTotalLength();
		path.style.strokeDasharray = length;
		path.style.strokeDashoffset = length;
	});

	const progress = { value: 0 };
	const timeline = gsap.timeline({
		onComplete: () => finishPreloader(preloader, site),
	});

	// Desenha o logo e atualiza o contador durante o mesmo intervalo.
	timeline.to(paths, {
		strokeDashoffset: 0,
		duration: drawDuration,
		ease: "power2.inOut",
		stagger,
	});
	timeline.to(progress, {
		value: 100,
		duration: drawSpan,
		ease: "none",
		onUpdate: () => {
			counter.textContent = Math.round(progress.value);
		},
	}, 0);

	timeline.to(paths, {
		fill: "#f2f2f2",
		strokeOpacity: 0,
		duration: 0.8,
		ease: "power1.out",
	});
	timeline.to([logo, counter], {
		opacity: 0,
		y: -20,
		duration: 0.5,
		ease: "power2.in",
	}, "+=0.3");

	// Revela o site junto com a cortina de saída do preloader.
	timeline.to(preloader, {
		yPercent: -100,
		duration: 1,
		ease: "power4.inOut",
	}, "siteReveal");
	timeline.fromTo(site,
		{ opacity: 0, y: 40 },
		{ opacity: 1, y: 0, duration: 1, ease: "power2.out" },
		"siteReveal");
	timeline.fromTo(site.querySelector("h1"),
		{ opacity: 0, y: 40 },
		{ opacity: 1, y: 0, duration: 1, ease: "power2.out" },
		"siteReveal+=0.1");
}

// Espera o carregamento completo antes de iniciar a sequência.
if (document.readyState === "complete") {
	initPreloader();
} else {
	window.addEventListener("load", initPreloader, { once: true });
}