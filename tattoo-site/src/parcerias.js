import React from 'react';
import { createRoot } from 'react-dom/client';
import DitherVeil from './components/DitherVeil.jsx';
import heroImage from '../assets/Hero com efeito para  a  galeria 3 .png';
import birdsImage from '../assets/passaros-voando.png';

// Mesmo efeito da /galeria, agora como fundo da página de parcerias.
const veilRoot = document.getElementById('partner-veil');

if (veilRoot) {
  createRoot(veilRoot).render(
    React.createElement(DitherVeil, {
      // Mobile first: dois pássaros; desktop permanece com a composição original.
      src: window.matchMedia('(max-width: 640px)').matches ? birdsImage : heroImage,
      fit: 'cover',
      pattern: 'atkinson',
      pixelSize: 2,
      inkColor: '#000000',
      paperColor: '#f7f7f7',
      revealRadius: 145,
      softness: 0.6,
      linger: 0.4,
      rimColor: '#ffffff',
      levels: 5,
      contrast: 1.8,
      wander: true,
    }),
  );
}
