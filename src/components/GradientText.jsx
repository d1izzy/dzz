import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useElementActivity } from '../hooks/useElementActivity';

export default function GradientText({
  children, className = '', colors = ['#5227FF', '#FF9FFC', '#B497CF'], animationSpeed = 8,
  showBorder = false, direction = 'horizontal', pauseOnHover = false, yoyo = true
}) {
  const ref = useRef(null);
  const textRef = useRef(null);
  const borderRef = useRef(null);
  const animationsRef = useRef([]);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const active = useElementActivity(ref);
  const vertical = direction === 'vertical';

  useEffect(() => {
    if (reducedMotion || animationSpeed <= 0) return;
    const frames = [{ backgroundPosition: vertical ? '50% 0%' : '0% 50%' },
      { backgroundPosition: vertical ? '50% 100%' : '100% 50%' }];
    animationsRef.current = [textRef.current, borderRef.current].filter(element => element?.animate).map(element => {
      const animation = element.animate(frames, {
        duration: animationSpeed * 1000, iterations: Infinity, direction: yoyo ? 'alternate' : 'normal'
      });
      animation.pause();
      return animation;
    });
    return () => { animationsRef.current.forEach(animation => animation.cancel()); animationsRef.current = []; };
  }, [reducedMotion, animationSpeed, vertical, yoyo, showBorder]);

  useEffect(() => {
    animationsRef.current.forEach(animation => {
      if (active && !isPaused) animation.play();
      else animation.pause();
    });
  }, [active, isPaused, reducedMotion, animationSpeed, vertical, yoyo, showBorder]);

  const angle = direction === 'horizontal' ? 'to right' : vertical ? 'to bottom' : 'to bottom right';
  const gradientStyle = {
    backgroundImage: `linear-gradient(${angle}, ${[...colors, colors[0]].join(',')})`,
    backgroundSize: direction === 'horizontal' ? '300% 100%' : vertical ? '100% 300%' : '300%',
    backgroundPosition: vertical ? '50% 0%' : '0% 50%', backgroundRepeat: 'repeat'
  };

  return (
    <div ref={ref} className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden ${showBorder ? 'py-1 px-2' : ''} ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {showBorder && <div ref={borderRef} aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]" style={gradientStyle}>
        <div className="absolute bg-black rounded-[1.25rem] z-[-1]" style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>}
      <div ref={textRef} className="inline-block relative z-2 text-transparent bg-clip-text" style={{ ...gradientStyle, WebkitBackgroundClip: 'text' }}>{children}</div>
    </div>
  );
}
