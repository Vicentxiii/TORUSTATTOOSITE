import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import CircularCarousel from './components/CircularCarousel.jsx';
import trabalho01 from '../assets/Galeria/Ave maria realismo preto e branco.jpg';
import trabalho02 from '../assets/Galeria/Caveira indio realismo.jpg';
import trabalho03 from '../assets/Galeria/Coringa realismo preto e branco.jpg';
import trabalho04 from '../assets/Galeria/Fine line garota pinup.jpg';
import trabalho05 from '../assets/Galeria/Gato fine line com surrealismo.jpg';
import trabalho06 from '../assets/Galeria/Leao realismo.jpg';
import trabalho07 from '../assets/Galeria/Lobo e mulher realismo colorido.jpg';
import DepthCarousel from './components/DepthCarousel.jsx';
import SpecularButton from './components/SpecularButton.jsx';
import StarBorder from './components/StarBorder.jsx';
import jhowPortrait from '../assets/Foto do Jhow para Bio.png';
import jhowSeated from '../assets/Foto do Jhow para Bio 2 .png';
import jhowCloseup from '../assets/Foto do Jhow para Bio 3 .png';

const WHATSAPP_URL = `https://wa.me/5511985545833?text=${encodeURIComponent('Olá Jow, vim pelo seu site, eu curti muitos seus trabalhos, podemos marcar um horário?')}`;

// Itens do carrossel da seção TRABALHOS. Por enquanto são 6 fotos de
// exemplo — para virar depoimentos, é só trocar src/title/subtitle aqui.
const items = [
  { src: trabalho01, alt: 'Tatuagem realismo em preto e branco', title: 'Trabalho 01', subtitle: 'Realismo' },
  { src: trabalho02, alt: 'Tatuagem de caveira indígena', title: 'Trabalho 02', subtitle: 'Realismo' },
  { src: trabalho03, alt: 'Tatuagem do Coringa em preto e branco', title: 'Trabalho 03', subtitle: 'Realismo' },
  { src: trabalho04, alt: 'Tatuagem fine line de garota pin-up', title: 'Trabalho 04', subtitle: 'Fine line' },
  { src: trabalho05, alt: 'Tatuagem fine line de gato surrealista', title: 'Trabalho 05', subtitle: 'Fine line' },
  { src: trabalho06, alt: 'Tatuagem realista de leão', title: 'Trabalho 06', subtitle: 'Realismo' },
  { src: trabalho07, alt: 'Tatuagem realista colorida de lobo e mulher', title: 'Trabalho 07', subtitle: 'Colorido' },
];

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
      <CircularCarousel
        items={items}
        preset="cylinder"
        intro="rise"
        cardWidth={300}
        aspectRatio={1}
        gap={60}
        autoplay="drift"
        speed={14}
        fadeColor="#111111"
        cornerRadius={10}
        captions
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
