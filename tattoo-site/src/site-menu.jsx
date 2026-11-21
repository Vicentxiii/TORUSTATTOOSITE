import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import OptionWheel from './components/OptionWheel.jsx';
import '../css/site-menu.css';

const ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Significados', href: '/significados' },
  { label: 'Client Info', href: '/informacoes-do-cliente' },
  { label: 'Parcerias', href: '/parcerias' },
  { label: 'Contato', href: '/contato' },
];

function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const navTimer = useRef(null);
  const selectedRef = useRef(0);
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const initialIndex = Math.max(0, ITEMS.findIndex((item) => item.href === path));
  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  const go = useCallback((index) => {
    window.clearTimeout(navTimer.current);
    window.location.href = ITEMS[index].href;
  }, []);

  // Só seleciona: a navegação acontece exclusivamente no clique.
  const handleChange = useCallback((index) => {
    selectedRef.current = index;
    setSelected(index);
  }, []);

  // Clique numa opção da roda abre a página (pequeno delay para ver o encaixe).
  const handleItemClick = useCallback((index) => {
    selectedRef.current = index;
    setSelected(index);
    window.clearTimeout(navTimer.current);
    navTimer.current = window.setTimeout(() => go(index), 220);
  }, [go]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Enter') go(selectedRef.current);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(navTimer.current);
    };
  }, [open, go]);

  return (
    <>
      <button
        className={`site-menu-trigger${open ? ' is-open' : ''}`}
        type="button"
        aria-expanded={open}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="site-menu-trigger__lines" aria-hidden="true"><i /><i /></span>
        <span className="site-menu-trigger__label">{open ? 'FECHAR' : 'MENU'}</span>
      </button>

      {open && (
        <div className="site-menu-overlay" role="dialog" aria-modal="true" aria-label="Menu do site">
          <div className="site-menu__head">
            <span className="site-menu__brand">TORUS TATTOO <b>·</b> MENU</span>
            <button className="site-menu__close" type="button" onClick={() => setOpen(false)} aria-label="Fechar menu">
              ✕
            </button>
          </div>

          <div className="site-menu__wheel">
            <OptionWheel
              items={ITEMS.map((item) => item.label)}
              defaultSelected={initialIndex}
              onChange={handleChange}
              onItemClick={handleItemClick}
              soundUrl="/sounds/click-soft.wav"
              soundVolume={0.7}
              textColor="#7d7a75"
              activeColor="#ffffff"
              side={isMobile ? 'right' : 'left'}
              fontSize={isMobile ? 3.9 : 3.1}
              spacing={1.24}
              curve={1}
              tilt={5.5}
              blur={isMobile ? 0.8 : 2}
              fade={0.22}
              minOpacity={0.06}
              smoothing={isMobile ? 120 : 220}
              inset={isMobile ? 22 : Math.max(80, window.innerWidth * 0.1)}
              loop
              draggable
              className="site-menu__option-wheel"
            />
          </div>

          <div className="site-menu__foot">
            <span>Role, arraste ou use as setas <b>↑ ↓</b></span>
            <button className="site-menu__enter" type="button" onClick={() => go(selected)}>
              Abrir página <span>→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const container = document.getElementById('site-menu-root');

if (container) {
  createRoot(container).render(<SiteMenu />);
}
