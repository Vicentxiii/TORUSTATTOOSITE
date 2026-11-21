import React from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import DitherVeil from './components/DitherVeil.jsx';
// Importar a imagem (em vez de usar um caminho literal) faz o Vite copeá-la
// para o dist com hash — sem isso o arquivo não existe no deploy.
import heroImage from '../assets/destaques-galeria.jpg';

// --- HERO com efeito DitherVeil (revela a arte ao passar o cursor) ---
const heroRoot = document.getElementById('dither-hero');
if (heroRoot) {
  createRoot(heroRoot).render(
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

// ---------------------------------------------------------------------------
// 1) TAGS — sufixos que você marca no NOME DO ARQUIVO
//    Convenção: coloque a palavra da tag em qualquer parte do nome.
//    Ex.:  tatuagem_Realismo.jpg   |  obra [Fine Line].png   |  foto Coloridos.jpg
//    "Todos" mostra todas. Imagens sem tag aparecem apenas em "Todos".
// ---------------------------------------------------------------------------
const TAGS = [
  { id: 'todos', label: 'Todos', match: null },
  { id: 'destaques', label: 'Destaques', match: ['colorido', 'coloridos', 'colorida'] },
  { id: 'fine-line', label: 'Fine Line', match: ['fine line', 'fineline', 'fine-line'] },
  { id: 'realismo', label: 'Realismo', match: ['realismo', 'realistic', 'realism'] },
  { id: 'coloridos', label: 'Coloridos', match: ['colorido', 'coloridos', 'color', 'colorida'] },
];

// Tag "Destaques": só as artes coloridas (as mesmas de Coloridos).
const FEATURED_MATCH = ['colorido', 'coloridos', 'colorida'];

const artworkModules = import.meta.glob('../assets/Galeria/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Cada obra guarda o nome do arquivo (para achar a tag) + a URL.
const ALL = Object.entries(artworkModules)
  // Remove duplicata e as artes que não devem aparecer.
  .filter(([path]) => !/ppreto|ave maria|caveira indio|coringa|borboleta/i.test(path))
  .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
  .map(([path, src]) => {
    const name = path.split('/').pop().toLowerCase();
    const tags = TAGS.filter((tag) => tag.match?.some((word) => name.includes(word))).map((tag) => tag.id);
    if (FEATURED_MATCH.some((word) => name.includes(word)) && !tags.includes('destaques')) {
      tags.push('destaques');
    }
    return { src, name, tags, label: name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') };
  });

const WHATSAPP_URL = `https://wa.me/5511985545833?text=${encodeURIComponent('Olá Jow, vim pelo seu site, eu curti muitos seus trabalhos, podemos marcar um horário?')}`;

const totalEl = document.getElementById('museum-total');
const trackEl = document.getElementById('gallery-track');
const filtersEl = document.getElementById('gallery-filters');

// "Destaques" é a aba inicial, no lugar de "Todos".
let activeTag = 'destaques';

// --- Lightbox (mobile): foto ampliada, fundo em blur e CTA abaixo ---
let lightbox = null;
let previousOverflow = '';

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  document.body.style.overflow = previousOverflow;
}

function openLightbox(src, alt) {
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Foto ampliada');
    lightbox.innerHTML = `
      <button class="gallery-lightbox__close" type="button" aria-label="Fechar foto">✕</button>
      <div class="gallery-lightbox__panel">
        <img class="gallery-lightbox__img" alt="" decoding="async">
        <button class="gallery-lightbox__book" type="button">Marcar sessão</button>
      </div>
    `;
    document.body.appendChild(lightbox);

    lightbox.querySelector('.gallery-lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.gallery-lightbox__book').addEventListener('click', () => {
      window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    });
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  const img = lightbox.querySelector('.gallery-lightbox__img');
  img.src = src;
  img.alt = alt;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  lightbox.classList.add('is-open');
  lightbox.querySelector('.gallery-lightbox__close').focus();
}

function tagLabel(id) {
  return TAGS.find((tag) => tag.id === id)?.label ?? id;
}

// ---------------------------------------------------------------------------
// 2) BOTÕES DAS TAGS
// ---------------------------------------------------------------------------
function buildFilters() {
  if (!filtersEl) return;
  filtersEl.innerHTML = '';

  TAGS.forEach((tag) => {
    const count = tag.id === 'todos'
      ? ALL.length
      : ALL.filter((art) => art.tags.includes(tag.id)).length;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-filter' + (tag.id === activeTag ? ' is-active' : '');
    button.dataset.tag = tag.id;
    button.innerHTML = `${tag.label}<span>${String(count).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => {
      if (activeTag === tag.id) return;
      activeTag = tag.id;
      buildFilters();
      render();
    });
    filtersEl.appendChild(button);
  });
}

// ---------------------------------------------------------------------------
// 3) GALERIA VERTICAL MINIMALISTA
//    Só as imagens, 1px de distância entre elas. Sem nomes, sem moldura.
//    Hover (desktop) / toque (mobile) revela o botão "marcar sessão".
// ---------------------------------------------------------------------------
function render() {
  if (!trackEl) return;

  const items = activeTag === 'todos'
    ? ALL
    : ALL.filter((art) => art.tags.includes(activeTag));

  if (totalEl) totalEl.textContent = String(items.length).padStart(2, '0');
  trackEl.innerHTML = '';

  items.forEach((art, index) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-card';
    const featured = /lobo e mulher|tigre realismo/.test(art.name);
    figure.innerHTML = `
      <div class="gallery-card__media">
        <img src="${art.src}" alt="Trabalho de tatuagem ${String(index + 1).padStart(2, '0')}" loading="lazy" decoding="async">
        ${featured ? '<span class="gallery-card__badge">DESTAQUE</span>' : ''}
        <button class="gallery-card__book" type="button" aria-label="Marcar sessão">marcar sessão</button>
      </div>
    `;

    const button = figure.querySelector('.gallery-card__book');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    });

    // Mobile: toque abre a foto ampliada. Desktop mantém o botão no hover.
    figure.addEventListener('click', (event) => {
      if (event.target.closest('.gallery-card__book')) return;
      if (window.matchMedia('(max-width: 640px)').matches) {
        openLightbox(art.src, `Trabalho de tatuagem ${String(index + 1).padStart(2, '0')}`);
        return;
      }
      const isOpen = figure.classList.toggle('is-tapped');
      if (isOpen) {
        document.querySelectorAll('.gallery-card.is-tapped').forEach((card) => {
          if (card !== figure) card.classList.remove('is-tapped');
        });
      }
    });

    trackEl.appendChild(figure);
  });
}

// Fecha o botão ao tocar fora de qualquer card.
document.addEventListener('click', (event) => {
  if (!event.target.closest('.gallery-card')) {
    document.querySelectorAll('.gallery-card.is-tapped').forEach((card) => card.classList.remove('is-tapped'));
  }
});

buildFilters();
render();

// Botão "voltar" com transição suave.
document.querySelector('.museum__back')?.addEventListener('click', (event) => {
  event.preventDefault();
  gsap.to('body', {
    opacity: 0,
    duration: 0.35,
    ease: 'power2.in',
    onComplete: () => { window.location.href = '/'; },
  });
});
