import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import CircularGallery from './components/CircularGallery.jsx';
import DepthCarousel from './components/DepthCarousel.jsx';
import SpecularButton from './components/SpecularButton.jsx';
import StarBorder from './components/StarBorder.jsx';
import jhowPortrait from '../assets/Foto do Jhow para Bio.png';
import jhowSeated from '../assets/Foto do Jhow para Bio 2 .png';
import jhowCloseup from '../assets/Foto do Jhow para Bio 3 .png';

const WHATSAPP_URL = `https://wa.me/5511985545833?text=${encodeURIComponent('Olá Jow, vim pelo seu site, eu curti muitos seus trabalhos, podemos marcar um horário?')}`;

// A galeria lê APENAS esta pasta. Qualquer imagem nova colocada em /assets
// fora dela nunca aparece em TRABALHOS — sem precisar de lista de exclusão.
const imageModules = import.meta.glob('/assets/trabalhos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const items = Object.entries(imageModules)
  .sort(([first], [second]) => first.localeCompare(second, 'pt-BR'))
  .map(([path, src], index) => ({
    image: src,
    alt: `Trabalho de tatuagem ${String(index + 1).padStart(2, '0')}`,
    text: `Trabalho ${String(index + 1).padStart(2, '0')}`,
  }));

const jhowPhotos = [
  { image: jhowPortrait, alt: 'Retrato em preto e branco do Jhow' },
  { image: jhowSeated, alt: 'Jhow sentado no estúdio' },
  { image: jhowCloseup, alt: 'Retrato aproximado do Jhow' },
];

let trabalhosRoot;
let jhowRoot;
let sessaoRoot;
let galeriaRoot;

window.initGaleriaButton = () => {
  const container = document.querySelector('#galeria-button-root');
  if (!container || galeriaRoot) return;

  galeriaRoot = createRoot(container);
  flushSync(() => {
    galeriaRoot.render(
      <StarBorder
        as="a"
        href="/galeria"
        color="#ffffff"
        trailColor="#ffffff"
        duration={4}
        direction="clockwise"
        stars={1}
        trailLength={0.3}
        thickness={1}
        radius={6}
        glow={0.6}
        hover="lap"
        sparkle={false}
        clickPulse
        theme="dark"
      >
        Entrar na galeria
        <svg className="galeria-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </StarBorder>,
    );
  });
};

window.initSessaoButton = () => {
  const container = document.querySelector('#sessao-button-root');
  if (!container || sessaoRoot) return;

  sessaoRoot = createRoot(container);
  flushSync(() => {
    sessaoRoot.render(
      <SpecularButton
        size="lg"
        radius={18}
        tint="#ffffff"
        tintOpacity={0.04}
        textColor="#f5f5f5"
        lineColor="#ffffff"
        baseColor="#525252"
        intensity={1}
        idleIntensity={0.35}
        shineSize={10}
        shineFade={34}
        thickness={1.2}
        glow={1}
        followMouse
        proximity={250}
        onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
      >
        marcar uma sessão
      </SpecularButton>,
    );
  });
};

window.initTrabalhosCarousel = () => {
  const container = document.querySelector('#trabalhos-carousel-root');
  if (!container || trabalhosRoot) return;

  trabalhosRoot = createRoot(container);
  flushSync(() => {
    trabalhosRoot.render(
      <CircularGallery
        items={items}
        bend={3}
        textColor="#f2f2f2"
        borderRadius={0.03}
        gap={0.22}
        fadeEdges={0.16}
        shadow={0.35}
        captureWheel={false}
        showTitles={false}
        font='400 34px "Bebas Neue", Impact, sans-serif'
        aria-label="Trabalhos de tatuagem"
        className="torus-circular-gallery"
        style={{ width: '100%', height: '100%' }}
      />,
    );
  });

  requestAnimationFrame(() => window.ScrollTrigger?.refresh());
};

window.initJhowCarousel = () => {
  const container = document.querySelector('#jhow-carousel-root');
  if (!container || jhowRoot) return;

  jhowRoot = createRoot(container);
  flushSync(() => {
    jhowRoot.render(
      <DepthCarousel
        items={jhowPhotos}
        cardWidth={300}
        cardHeight={420}
        radius={8}
        tint="#0a0a0a"
        depth={150}
        spread={56}
        tilt={16}
        tiltDirection="right"
        perspective={1300}
        visibleCards={2.2}
        falloff={0.17}
        blur={2}
        duration={700}
        loop
        showControls
        showIndicators
        captureWheel={false}
        onReady={(api) => { window.jhowCarouselApi = api; }}
        className="jhow-depth-carousel"
      />,
    );
  });
};
