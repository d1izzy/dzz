import { useRef, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const ClickSpark = ({
  sparkColor = '#fff', sparkSize = 10, sparkRadius = 15, sparkCount = 8,
  duration = 400, easing = 'ease-out', extraScale = 1, className = '', children
}) => {
  const canvasRef = useRef(null);
  const emitRef = useRef(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || reducedMotion) return;
    let sparks = [];
    let frame = null;
    let width = 0;
    let height = 0;

    const clear = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      sparks = [];
      ctx.clearRect(0, 0, width, height);
    };
    const resize = () => {
      clear();
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const ease = t => {
      if (easing === 'linear') return t;
      if (easing === 'ease-in') return t * t;
      if (easing === 'ease-in-out') return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      return t * (2 - t);
    };
    const draw = timestamp => {
      frame = null;
      ctx.clearRect(0, 0, width, height);
      sparks = sparks.filter(spark => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;
        const eased = ease(elapsed / duration);
        const distance = eased * sparkRadius * extraScale;
        const length = sparkSize * (1 - eased);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle));
        ctx.lineTo(spark.x + (distance + length) * Math.cos(spark.angle), spark.y + (distance + length) * Math.sin(spark.angle));
        ctx.stroke();
        return true;
      });
      if (sparks.length) frame = requestAnimationFrame(draw);
    };
    emitRef.current = event => {
      if (document.hidden || event.detail === 0 || duration <= 0) return;
      const now = performance.now();
      const count = Math.min(40, Math.max(0, sparkCount));
      sparks.push(...Array.from({ length: count }, (_, i) => ({
        x: event.clientX, y: event.clientY, angle: (2 * Math.PI * i) / count, startTime: now
      })));
      sparks = sparks.slice(-200);
      if (frame === null) frame = requestAnimationFrame(draw);
    };
    const onVisibility = () => { if (document.hidden) clear(); };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clear();
      emitRef.current = null;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion, sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]);

  return (
    <div className={`relative min-h-screen w-full max-w-full overflow-x-hidden ${className}`} onClick={event => emitRef.current?.(event)}>
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-[70] h-full w-full pointer-events-none select-none" />
      {children}
    </div>
  );
};

export default ClickSpark;
