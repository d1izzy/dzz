import { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useElementActivity } from '../hooks/useElementActivity';

const Magnet = ({
  children, padding = 100, disabled = false, magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out', inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '', innerClassName = '', ...props
}) => {
  const magnetRef = useRef(null);
  const innerRef = useRef(null);
  const active = useElementActivity(magnetRef);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const hasMouse = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const element = innerRef.current;
    if (!element || disabled || reducedMotion || !hasMouse || !active) return;
    let frame = null;
    let point;
    const reset = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      element.style.transform = 'translate3d(0, 0, 0)';
      element.style.transition = inactiveTransition;
      element.style.removeProperty('will-change');
    };
    const draw = () => {
      frame = null;
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const x = point.x - left - width / 2;
      const y = point.y - top - height / 2;
      if (Math.abs(x) < width / 2 + padding && Math.abs(y) < height / 2 + padding) {
        element.style.transition = activeTransition;
        element.style.willChange = 'transform';
        element.style.transform = `translate3d(${x / Math.max(1, magnetStrength)}px, ${y / Math.max(1, magnetStrength)}px, 0)`;
      } else reset();
    };
    const move = event => {
      if (event.pointerType !== 'mouse') return;
      point = { x: event.clientX, y: event.clientY };
      if (frame === null) frame = requestAnimationFrame(draw);
    };
    const wrapper = magnetRef.current;
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    wrapper.addEventListener('focusin', reset);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
      wrapper.removeEventListener('focusin', reset);
      reset();
    };
  }, [active, disabled, reducedMotion, hasMouse, padding, magnetStrength, activeTransition, inactiveTransition]);

  return <div ref={magnetRef} className={wrapperClassName} style={{ position: 'relative', display: 'inline-block' }} {...props}>
    <div ref={innerRef} className={innerClassName}>{children}</div>
  </div>;
};

export default Magnet;
