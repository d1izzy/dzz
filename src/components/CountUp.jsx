import { useEffect, useMemo, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useElementActivity } from '../hooks/useElementActivity';

export default function CountUp({
  to, from = 0, direction = 'up', delay = 0, duration = 2, className = '',
  startWhen = true, separator = '', onStart, onEnd
}) {
  const ref = useRef(null);
  const elapsed = useRef(0);
  const started = useRef(false);
  const completed = useRef(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = useElementActivity(ref);
  const start = direction === 'down' ? to : from;
  const end = direction === 'down' ? from : to;
  const format = useMemo(() => {
    const decimals = Math.max(...[from, to].map(value => (String(value).split('.')[1] || '').length));
    const formatter = new Intl.NumberFormat('en-US', {
      useGrouping: Boolean(separator), minimumFractionDigits: decimals, maximumFractionDigits: decimals
    });
    return value => formatter.format(value).replace(/,/g, separator);
  }, [from, to, separator]);

  useEffect(() => {
    elapsed.current = 0;
    started.current = false;
    completed.current = false;
    if (ref.current) ref.current.textContent = format(reducedMotion ? end : start);
  }, [start, end, format, reducedMotion]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !startWhen || completed.current) return;
    if (reducedMotion || duration <= 0) {
      element.textContent = format(end);
      completed.current = true;
      onEnd?.();
      return;
    }
    if (!active) return;
    let frame;
    let lastTime = null;
    const draw = time => {
      if (lastTime !== null) elapsed.current += Math.min(time - lastTime, 64);
      lastTime = time;
      const timeAfterDelay = elapsed.current - delay * 1000;
      if (timeAfterDelay >= 0) {
        if (!started.current) { started.current = true; onStart?.(); }
        const progress = Math.min(1, timeAfterDelay / (duration * 1000));
        element.textContent = format(start + (end - start) * (1 - Math.pow(1 - progress, 3)));
        if (progress === 1) { completed.current = true; onEnd?.(); return; }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [active, reducedMotion, startWhen, start, end, format, duration, delay, onStart, onEnd]);

  return <span className={className} ref={ref}>{format(reducedMotion ? end : start)}</span>;
}
