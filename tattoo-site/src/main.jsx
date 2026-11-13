import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import FlexCarousel from './components/FlexCarousel.jsx';
import DepthCarousel from './components/DepthCarousel.jsx';
import jhowPortrait from '../assets/Foto do Jhow para Bio.png';
import jhowSeated from '../assets/Foto do Jhow para Bio 2 .png';
import jhowCloseup from '../assets/Foto do Jhow para Bio 3 .png';

const imageModules = import.meta.glob('/assets/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const items = Object.entries(imageModules)
  .filter(([path]) => !path.includes('Foto do Jhow para Bio'))
  .sort(([first], [second]) => first.localeCompare(second, 'pt-BR'))
  .map(([path, src], index) => ({
    src,
    alt: `Trabalho de tatuagem ${String(index + 1).padStart(2, '0')}`,
    title: `Trabalho ${String(index + 1).padStart(2, '0')}`,
  }));

const jhowPhotos = [
  { image: jhowPortrait, alt: 'Retrato em preto e branco do Jhow' },
  { image: jhowSeated, alt: 'Jhow sentado no estúdio' },
  { image: jhowCloseup, alt: 'Retrato aproximado do Jhow' },
];

let flexRoot;
let jhowRoot;

window.initFlexCarousel = () => {
  const container = document.querySelector('#flex-carousel-root');
  if (!container || flexRoot) return;

  flexRoot = createRoot(container);
  flushSync(() => {
    flexRoot.render(
      <FlexCarousel
        items={items}
        preset="liquid"
        intro="rise"
        cardHeight={0.5}
        gap={14}
        radius={4}
        squeeze={0.2}
        focusOnClick
        captions
        captureWheel={false}
        className="torus-flex-carousel"
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
        className="jhow-depth-carousel"
      />,
    );
  });
};
