import { useEffect, useState } from 'react';
import './DepoimentosCarousel.css';

function DepoimentoCard({ item, onOpen }) {
  const open = () => onOpen(item);

  return (
    <article
      className="dep-card"
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Ler depoimento de ${item.name}`}
    >
      <div className="dep-card__photo">
        <img src={item.photo} alt={item.name} draggable="false" loading="lazy" />
      </div>
      <div className="dep-card__body">
        <div className="dep-card__person">
          <img className="dep-card__avatar" src={item.photo} alt="" draggable="false" loading="lazy" />
          <strong>{item.name}</strong>
        </div>
        <p className="dep-card__quote">“{item.preview}”</p>
        <button
          className="dep-card__more"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            open();
          }}
        >
          Ler mais
        </button>
      </div>
    </article>
  );
}

function DepoimentoModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="dep-modal" role="presentation" onClick={onClose}>
      <div
        className="dep-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Depoimento de ${item.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="dep-modal__close" type="button" onClick={onClose} aria-label="Fechar depoimento">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="dep-modal__photo">
          <img src={item.photo} alt={item.name} draggable="false" />
        </div>
        <div className="dep-modal__body">
          <span className="dep-modal__eyebrow">DEPOIMENTO</span>
          <h2>{item.name}</h2>
          <p>{item.full}</p>
          <button className="dep-modal__cta" type="button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DepoimentosCarousel({ items }) {
  const [active, setActive] = useState(null);
  const loop = [...items, ...items];

  return (
    <>
      <div className="dep-carousel">
        <div className="dep-carousel__track">
          {[0, 1].map((group) => (
            <div className="dep-carousel__group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>
              {loop.slice(group * items.length, (group + 1) * items.length).map((item, index) => (
                <DepoimentoCard
                  key={`${group}-${item.name}-${index}`}
                  item={item}
                  onOpen={setActive}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {active && <DepoimentoModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}
