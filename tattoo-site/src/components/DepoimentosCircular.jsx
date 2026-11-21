import { useEffect, useState } from 'react';
import CircularCarousel from './CircularCarousel.jsx';
import { DepoimentoCardContent, DepoimentoModal } from './DepoimentosCarousel.jsx';

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return mobile;
}

// No mobile: carrossel reto, quadrado e com scroll lateral (sem efeito 3D).
function DepoimentosMobile({ items, onOpen }) {
  return (
    <div className="dep-mobile" aria-label="Depoimentos">
      <div className="dep-mobile__track">
        {items.map((item) => (
          <button
            className="dep-mobile__card"
            key={item.name}
            type="button"
            onClick={() => onOpen(item)}
          >
            <span className="dep-mobile__photo">
              <img src={item.photo} alt={item.name} draggable="false" loading="lazy" />
            </span>
            <span className="dep-mobile__body">
              <span className="dep-mobile__person">
                <img src={item.photo} alt="" draggable="false" loading="lazy" />
                <strong>{item.name}</strong>
              </span>
              <span className="dep-mobile__quote">“{item.preview}”</span>
              <span className="dep-mobile__more">Ler mais ↗</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DepoimentosCircular({ items }) {
  const [active, setActive] = useState(null);
  const isMobile = useIsMobile();

  // O CircularCarousel espera { src, alt, title, subtitle }. O conteúdo visual
  // de cada card é injetado por renderCard, mantendo os depoimentos intactos.
  const carouselItems = items.map((item) => ({
    src: item.photo,
    alt: item.name,
    title: item.name,
    subtitle: 'Depoimento',
  }));

  return (
    <>
      {isMobile ? (
        <DepoimentosMobile items={items} onOpen={setActive} />
      ) : (
        <CircularCarousel
          items={carouselItems}
          preset="cylinder"
          intro="rise"
          cardWidth={496}
          aspectRatio={1.75}
          gap={50}
          curve={0.95}
          speed={14}
          momentum={0.09}
          parallax={0.12}
          fadeColor="#28252b"
          innerShade={0.43}
          cornerRadius={14}
          captions
          renderCard={(item, index) => <DepoimentoCardContent item={items[index]} />}
          onItemClick={(item, index) => setActive(items[index])}
          style={{ width: '100%', height: '100%' }}
        />
      )}
      {active && <DepoimentoModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}
