import React from 'react';
import { createRoot } from 'react-dom/client';
import DitherVeil from './components/DitherVeil.jsx';
import heroImage from '../assets/Hero com efeito para  a  galeria 3 .png';
import birdsImage from '../assets/passaros-dither.png';

const veilRoot = document.getElementById('partner-veil');

if (veilRoot) {
  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  if (isMobile) {
    // Mobile first: imagem estática (sem canvas WebGL) para um scroll suave,
    // igual ao da página de contato. Desktop mantém o DitherVeil animado.
    veilRoot.style.backgroundImage = `url("${birdsImage}")`;
    veilRoot.style.backgroundSize = 'cover';
    veilRoot.style.backgroundPosition = 'center';
    veilRoot.style.backgroundRepeat = 'no-repeat';
  } else {
    createRoot(veilRoot).render(
      React.createElement(DitherVeil, {
        src: heroImage,
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
}
