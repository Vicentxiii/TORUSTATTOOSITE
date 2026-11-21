import { useState } from 'react';
import CircularCarousel from './CircularCarousel.jsx';
import { DepoimentoCardContent, DepoimentoModal } from './DepoimentosCarousel.jsx';

export default function DepoimentosCircular({ items }) {
  const [active, setActive] = useState(null);

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
      {active && <DepoimentoModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}
