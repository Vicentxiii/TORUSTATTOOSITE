import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './DepthCarousel.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/seed/depth1/800/1000', alt: 'Slide 1' },
  { image: 'https://picsum.photos/seed/depth2/800/1000', alt: 'Slide 2' },
  { image: 'https://picsum.photos/seed/depth3/800/1000', alt: 'Slide 3' },
  { image: 'https://picsum.photos/seed/depth4/800/1000', alt: 'Slide 4' },
  { image: 'https://picsum.photos/seed/depth5/800/1000', alt: 'Slide 5' },
  { image: 'https://picsum.photos/seed/depth6/800/1000', alt: 'Slide 6' },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const normalizeItem = (item) => (typeof item === 'string' ? { image: item, alt: '' } : item);

const DepthCarousel = ({
  items = DEFAULT_ITEMS,
  cardWidth = 300,
  cardHeight = 380,
  radius = 18,
  tint = '#05060a',
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 700,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 3200,
  loop = true,
  showControls = true,
  showIndicators = true,
  onChange,
  className = '',
}) => {
  const data = useMemo(() => (Array.isArray(items) ? items : []).map(normalizeItem), [items]);
  const count = data.length;
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);
  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);
  const dragRef = useRef(null);
  const wheelTimerRef = useRef(null);
  const autoTimerRef = useRef(null);
  const reducedRef = useRef(false);
  const [active, setActive] = useState(0);

  onChangeRef.current = onChange;
  cfgRef.current = {
    count, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur,
    duration, ease, loop, cardWidth, autoplayDelay,
  };

  const layout = useCallback((position) => {
    const config = cfgRef.current;
    if (!config.count) return;
    const direction = config.tiltDirection === 'left' ? -1 : 1;
    const scale = scaleRef.current;

    for (let index = 0; index < config.count; index += 1) {
      const card = cardRefs.current[index];
      if (!card) continue;

      let distance = index - position;
      if (config.loop && config.count > 1) {
        distance = ((distance % config.count) + config.count) % config.count;
        if (distance > config.count / 2) distance -= config.count;
      }

      const depthDistance = Math.max(0, distance);
      const absoluteDistance = Math.abs(distance);
      const shown = absoluteDistance <= config.visibleCards + 0.5;
      const translateZ = -config.depth * distance;
      const translateX = direction * config.spread * distance;
      const rotateY = direction * config.tilt * clamp(distance, 0, 1);
      let opacity = distance < 0 ? Math.max(0, 1 + distance) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - depthDistance * config.falloff);
      const blurAmount = config.blur > 0
        ? Math.min(config.blur, (depthDistance / Math.max(1, config.visibleCards)) * config.blur)
        : 0;

      card.style.transform = `translate(-50%, -50%) scale(${scale}) translateX(${translateX.toFixed(2)}px) translateZ(${translateZ.toFixed(2)}px) rotateY(${rotateY.toFixed(3)}deg)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurAmount.toFixed(2)}px)`;
      card.style.zIndex = String(Math.round(2000 - distance * 20));
      card.style.pointerEvents = shown && opacity > 0.05 ? 'auto' : 'none';

      const overlay = overlayRefs.current[index];
      if (overlay) overlay.style.opacity = clamp(depthDistance * config.falloff * 1.25, 0, 0.86).toFixed(3);
    }
  }, []);

  const notify = useCallback((index) => {
    setActive(index);
    onChangeRef.current?.(index, data[index]);
  }, [data]);

  const tweenTo = useCallback((target, animate) => {
    tweenRef.current?.kill();
    const config = cfgRef.current;
    const proxy = { position: posRef.current };
    tweenRef.current = gsap.to(proxy, {
      position: target,
      duration: animate && !reducedRef.current ? config.duration / 1000 : 0,
      ease: config.ease,
      onUpdate: () => {
        posRef.current = proxy.position;
        layout(proxy.position);
      },
      onComplete: () => {
        if (config.count > 0) posRef.current = ((posRef.current % config.count) + config.count) % config.count;
        layout(posRef.current);
      },
    });
  }, [layout]);

  const setFocus = useCallback((rawIndex, animate = true) => {
    const config = cfgRef.current;
    if (!config.count) return;
    const index = config.loop
      ? ((rawIndex % config.count) + config.count) % config.count
      : clamp(rawIndex, 0, config.count - 1);
    let delta = index - posRef.current;
    if (config.loop && config.count > 1) {
      delta = ((delta % config.count) + config.count) % config.count;
      if (delta > config.count / 2) delta -= config.count;
    }
    tweenTo(posRef.current + delta, animate);
    if (index !== focusRef.current) {
      focusRef.current = index;
      notify(index);
    }
  }, [notify, tweenTo]);

  const navigateBy = useCallback((step) => setFocus(focusRef.current + step, true), [setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const config = cfgRef.current;
      const neededWidth = config.cardWidth + Math.abs(config.spread) * 2 + 120;
      scaleRef.current = clamp(width / neededWidth, 0.4, 1);
      layout(posRef.current);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [layout]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const onWheel = (event) => {
      const config = cfgRef.current;
      if (config.count < 2) return;
      event.preventDefault();
      tweenRef.current?.kill();
      const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const delta = event.deltaMode === 1 ? rawDelta * 24 : rawDelta;
      posRef.current += clamp(delta / (config.cardWidth * 0.9), -0.6, 0.6);
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      root.removeEventListener('wheel', onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  const onPointerDown = useCallback((event) => {
    if (cfgRef.current.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: event.clientX,
      startPosition: posRef.current,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
      id: event.pointerId,
    };
  }, []);

  const onPointerMove = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const config = cfgRef.current;
    const stepPixels = Math.max(config.cardWidth * 0.55 * scaleRef.current, 40);
    const deltaX = event.clientX - drag.x;
    if (!drag.moved && Math.abs(deltaX) > 4) {
      drag.moved = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (!drag.moved) return;
    const now = performance.now();
    const elapsed = Math.max(now - drag.lastTime, 1);
    drag.velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;
    posRef.current = drag.startPosition - deltaX / stepPixels;
    layout(posRef.current);
  }, [layout]);

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const config = cfgRef.current;
    const stepPixels = Math.max(config.cardWidth * 0.55 * scaleRef.current, 40);
    setFocus(Math.round(posRef.current - (drag.velocity * 180) / stepPixels), true);
  }, [setFocus]);

  const onKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateBy(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateBy(1);
    }
  }, [navigateBy]);

  const onCardClick = useCallback((index) => {
    if (dragRef.current?.moved) return;
    setFocus(index, true);
  }, [setFocus]);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!autoplay || reducedRef.current || count < 2) return undefined;
    const root = rootRef.current;
    let hovered = false;
    let focused = false;
    const stop = () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    };
    const start = () => {
      stop();
      autoTimerRef.current = window.setInterval(() => {
        if (!hovered && !focused) navigateBy(1);
      }, Math.max(cfgRef.current.autoplayDelay, 600));
    };
    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };
    const onFocusIn = () => { focused = true; };
    const onFocusOut = () => { focused = false; };
    root?.addEventListener('mouseenter', onEnter);
    root?.addEventListener('mouseleave', onLeave);
    root?.addEventListener('focusin', onFocusIn);
    root?.addEventListener('focusout', onFocusOut);
    start();
    return () => {
      stop();
      root?.removeEventListener('mouseenter', onEnter);
      root?.removeEventListener('mouseleave', onLeave);
      root?.removeEventListener('focusin', onFocusIn);
      root?.removeEventListener('focusout', onFocusOut);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  useEffect(() => () => {
    tweenRef.current?.kill();
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
  }, []);

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ '--dc-perspective': `${perspective}px` }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Fotos do Jhow"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {data.map((item, index) => (
          <div
            key={item.image}
            className="depth-carousel__card"
            ref={(element) => { cardRefs.current[index] = element; }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={`${index + 1} de ${count}`}
            aria-hidden={active !== index}
            onClick={() => onCardClick(index)}
          >
            <img className="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable={false} />
            <span
              className="depth-carousel__tint"
              ref={(element) => { overlayRefs.current[index] = element; }}
              style={{ background: tint }}
            />
          </div>
        ))}
      </div>

      {showControls && count > 1 && (
        <>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label="Foto anterior" onClick={() => navigateBy(-1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label="Próxima foto" onClick={() => navigateBy(1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="tablist" aria-label="Fotos do Jhow">
          {data.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`Ir para foto ${index + 1}`}
              className={`depth-carousel__dot${active === index ? ' is-active' : ''}`}
              onClick={() => setFocus(index, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepthCarousel;
