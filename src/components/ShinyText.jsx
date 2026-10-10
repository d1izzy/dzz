import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useElementActivity } from '../hooks/useElementActivity';

const ShinyText = ({
  text, disabled = false, speed = 2, className = '', color = '#b5b5b5', shineColor = '#ffffff',
  spread = 120, yoyo = false, pauseOnHover = false, direction = 'left', delay = 0
}) => {
  const ref = useRef(null);
  const animationRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = useElementActivity(ref);

  useEffect(() => {
    if (!ref.current?.animate || disabled || reducedMotion || speed <= 0) return;
    const start = direction === 'left' ? '150% center' : '-50% center';
    const end = direction === 'left' ? '-50% center' : '150% center';
    const travel = speed / (speed + Math.max(0, delay));
    const animation = ref.current.animate([
      { backgroundPosition: start, offset: 0 },
      { backgroundPosition: end, offset: travel },
      { backgroundPosition: end, offset: 1 }
    ], { duration: (speed + Math.max(0, delay)) * 1000, iterations: Infinity, direction: yoyo ? 'alternate' : 'normal' });
    animation.pause();
    animationRef.current = animation;
    return () => { animation.cancel(); animationRef.current = null; };
  }, [speed, delay, direction, yoyo, disabled, reducedMotion]);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;
    if (active && !isPaused) animation.play();
    else animation.pause();
  }, [active, isPaused, speed, delay, direction, yoyo, disabled, reducedMotion]);

  return (
    <span ref={ref} className={`inline-block ${className}`} style={{
      backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
      backgroundSize: '200% auto', backgroundPosition: '150% center',
      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'
    }} onMouseEnter={() => pauseOnHover && setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {text}
    </span>
  );
};

export default ShinyText;
