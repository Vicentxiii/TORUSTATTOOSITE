gsap.registerPlugin(ScrollTrigger);

function finishPreloader(preloader, site) {
	// Libera a página imediatamente quando a animação não deve ser executada.
	preloader.style.display = "none";
	document.body.classList.remove("preloader-active");
	gsap.set(site, { opacity: 1, y: 0 });
	gsap.set(site, { clearProps: "transform" });

	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		gsap.set(site.querySelector("h1"), { opacity: 1, y: 0 });
		window.initFlexCarousel?.();
		window.initJhowCarousel?.();
		return;
	}

	initLenis();
	initHero();
	window.initFlexCarousel?.();
	window.initJhowCarousel?.();
	initAbout();
	ScrollTrigger.refresh();
}

const galleryImages = [
	"Caveira mulher tattoo.png",
	"Coringa tattoo.png",
	"d.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.23_a7b7e013.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.24_293295fd.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.24_34004518.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.24_baf2b9f3.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.25_4d51a7f4.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.25_90cf4ad3.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.25_f3ea293c.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.26_ba2b11c1.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.26_ed0a902d.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.26_f39d1404.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.27_6bec312d.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.27_7555bd11.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.28_3cb9f470.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.28_b834e9d6.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.28_b85e5848.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.28_f1b8cf0d.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.29_4872dbad.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.29_89fad3bd.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.29_c710bdc1.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.29_d4ef8dfa.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.29_e86f5cfa.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.30_16a0a50f.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.30_224b6837.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.31_396dd776.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.31_73ba7b3f.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.31_897300ca.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.42_c9c22b59.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.43_de02192d.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.44_086ac4dd.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.44_3061bb37.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.44_8992d424.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.45_3e94101c.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.45_9ad0571e.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.48_1db30ee8.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.11.48_3a5e1778.jpg",
	"Imagem do WhatsApp de 2025-02-16 à(s) 19.12.54_79c5cee3.jpg",
	"Jeesus tattoo.png",
	"Leao tattoo.png",
	"Lobo com mulher tattoo.png",
	"Mulher zikaaa tattoo.png",
	"tuba.png",
];

let lenis;

function initLenis() {
	// Sincroniza o scroll suave com o ciclo de atualização do GSAP.
	if (typeof Lenis === "undefined") return;

	lenis = new Lenis({ autoRaf: false });
	lenis.on("scroll", ScrollTrigger.update);
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);
}

function initHero() {
	const hero = document.querySelector(".hero");
	const titleArt = hero.querySelector(".hero__title-art");

	gsap.to(titleArt, {
		y: 0,
		clipPath: "inset(0% 0 0)",
		duration: 1.35,
		ease: "power4.out",
	});

	gsap.to(hero.querySelector(".hero__shade"), {
		opacity: 0.92,
		ease: "none",
		scrollTrigger: {
			trigger: hero,
			start: "top top",
			end: "+=100%",
			scrub: true,
			pin: true,
			anticipatePin: 1,
		},
	});
}

function initArcCarousel() {
	const carousel = document.querySelector(".arc-carousel");
	const stage = carousel.querySelector(".arc-carousel__stage");
	const wheel = carousel.querySelector(".arc-carousel__wheel");
	const index = carousel.querySelector(".arc-carousel__index span");
	const cards = [];
	const cardImages = [];
	const visuals = [];
	const angles = [];

	// Cria um cartão para cada foto existente em assets/.
	galleryImages.forEach((filename, imageIndex) => {
		const angle = (imageIndex / galleryImages.length) * 360 - 180;
		const card = document.createElement("article");
		const visual = document.createElement("div");
		const image = document.createElement("img");

		card.className = "arc-card";
		card.style.transform = `rotate(${angle}deg) translateY(calc(-1 * var(--arc-radius))) translate(-50%, -50%)`;
		visual.className = "arc-card__visual";
		image.src = `assets/${encodeURIComponent(filename)}`;
		image.alt = `Trabalho de tatuagem ${String(imageIndex + 1).padStart(2, "0")}`;
		image.loading = "lazy";
		image.decoding = "async";

		visual.appendChild(image);
		card.appendChild(visual);
		wheel.appendChild(card);
		cards.push(card);
		cardImages.push(image);
		visuals.push(visual);
		angles.push(angle);
	});

	index.textContent = "01";
	carousel.querySelector(".arc-carousel__index").lastChild.textContent = ` / ${String(galleryImages.length).padStart(2, "0")}`;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const setRadius = () => {
		const radius = Math.min(window.innerWidth * (window.innerWidth < 700 ? 0.8 : 0.56), window.innerHeight * 1.05);
		stage.style.setProperty("--arc-radius", `${radius}px`);
	};
	setRadius();
	window.addEventListener("resize", setRadius, { passive: true });

	visuals.forEach((visual, imageIndex) => {
		gsap.set(visual, { rotation: -angles[imageIndex] });
	});

	const rotationState = { value: 0 };
	const updateArcFocus = () => {
		let focusedIndex = 0;
		let smallestAngle = Infinity;
		visuals.forEach((visual, imageIndex) => {
			const angle = ((angles[imageIndex] + rotationState.value + 180) % 360) - 180;
			const focus = Math.max(0, Math.cos((angle * Math.PI) / 180));
			visual.style.scale = `${0.78 + focus * 0.22}`;
			visual.style.opacity = `${0.25 + focus * 0.75}`;
			cards[imageIndex].style.zIndex = String(Math.round(focus * 100));
			if (Math.abs(angle) < smallestAngle) {
				smallestAngle = Math.abs(angle);
				focusedIndex = imageIndex;
			}
		});
		index.textContent = String(focusedIndex + 1).padStart(2, "0");
	};

	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: carousel,
			start: "top top",
			end: () => `+=${galleryImages.length * window.innerHeight}`,
			scrub: 1,
			pin: true,
			anticipatePin: 1,
			invalidateOnRefresh: true,
		},
		onUpdate: updateArcFocus,
	});

	timeline.to(rotationState, { value: 360, duration: 1, ease: "none" }, 0);
	timeline.to(wheel, { rotation: 360, duration: 1, ease: "none" }, 0);
	timeline.to(visuals, { rotation: "-=360", duration: 1, ease: "none" }, 0);
	updateArcFocus();
}

function initAbout() {
	const about = document.querySelector(".about");
	const photo = about.querySelector(".jhow-photo");
	const copy = about.querySelectorAll(".about__eyebrow, h2, .about__bio, .about__signature");
	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: about,
			start: "top 72%",
			once: true,
		},
	});

	// Revela a foto e apresenta o texto em sequência ao entrar na seção.
	timeline.to(photo, {
		clipPath: "inset(0% 0 0)",
		duration: 1,
		ease: "power3.inOut",
	});
	timeline.to(copy, {
		y: 0,
		opacity: 1,
		duration: 0.75,
		ease: "power3.out",
		stagger: 0.12,
	}, "-=0.5");
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