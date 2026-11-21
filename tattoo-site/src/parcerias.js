import React from 'react';
import { createRoot } from 'react-dom/client';
import DitherVeil from './components/DitherVeil.jsx';
import heroImage from '../assets/Hero com efeito para  a  galeria 3 .png';
import backTattoo from '../assets/sobre o estudio imagem da sessao MOBILE.png';

const veilRoot = document.getElementById('partner-veil');

if (veilRoot) {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  createRoot(veilRoot).render(
    React.createElement(DitherVeil, {
      // Costas tatuadas (mesma estátua da seção do estúdio).
      src: backTattoo || heroImage,
      fit: 'cover',
      pattern: 'atkinson',
      pixelSize: isMobile ? 3 : 2,
      inkColor: '#000000',
      paperColor: '#f7f7f7',
      revealRadius: isMobile ? 110 : 145,
      softness: 0.6,
      linger: 0.4,
      rimColor: '#ffffff',
      levels: 5,
      contrast: 1.8,
      wander: !isMobile,
    }),
  );
}
