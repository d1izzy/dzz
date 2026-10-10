import { useRef, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const cssEase = value => ({
  'power3.out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'power3.in': 'cubic-bezier(0.7, 0, 0.84, 0)',
  'power2.out': 'cubic-bezier(0.22, 1, 0.36, 1)'
}[value] || value);

const AnimatedContent = ({
  children, container, distance = 100, direction = 'vertical', reverse = false,
  duration = 0.8, ease = 'power3.out', initialOpacity = 0, animateOpacity = true,
  scale = 1, threshold = 0.1, delay = 0, disappearAfter = 0, disappearDuration = 0.5,
  disappearEase = 'power3.in', onComplete, onDisappearanceComplete, className = '', ...props
}) => {
  const ref = useRef(null);
  const revealed = useRef(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed.current || reducedMotion || !element.animate || !window.IntersectionObserver) return;
    let root = container || document.getElementById('snap-main-container');
    if (typeof root === 'string') root = document.querySelector(root);
    const triggerInset = (root?.clientHeight || window.innerHeight) * Math.max(0, Math.min(threshold, 0.9));
    const axis = direction === 'horizontal' ? 'X' : 'Y';
    const offset = reverse ? -distance : distance;
    const from = { transform: `translate${axis}(${offset}px) scale(${scale})`, opacity: animateOpacity ? initialOpacity : 1 };
    const to = { transform: 'translate(0, 0) scale(1)', opacity: 1 };
    let animation;
    let disappearTimer;
    let started = false;
    Object.assign(element.style, from);

    const restore = () => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    };
    const show = () => {
      if (started) return;
      started = true;
      observer.disconnect();
      animation = element.animate([from, to], {
        duration: duration * 1000, delay: delay * 1000, easing: cssEase(ease), fill: 'both'
      });
      animation.onfinish = () => {
        revealed.current = true;
        restore();
        animation.cancel();
        onComplete?.();
        if (disappearAfter > 0) {
          disappearTimer = window.setTimeout(() => {
            animation = element.animate([to, {
              transform: `translate${axis}(${-offset}px) scale(0.8)`, opacity: animateOpacity ? initialOpacity : 0
            }], { duration: disappearDuration * 1000, easing: cssEase(disappearEase), fill: 'forwards' });
            animation.onfinish = () => onDisappearanceComplete?.();
          }, disappearAfter * 1000);
        }
      };
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) show();
    }, { root: root || null, threshold: 0, rootMargin: `0px 0px -${triggerInset}px 0px` });
    observer.observe(element);
    // Tabbing to a control must never leave focused content transparent or displaced.
    const onFocus = () => {
      revealed.current = true;
      started = true;
      observer.disconnect();
      clearTimeout(disappearTimer);
      animation?.cancel();
      restore();
    };
    element.addEventListener('focusin', onFocus);
    return () => {
      observer.disconnect();
      clearTimeout(disappearTimer);
      animation?.cancel();
      element.removeEventListener('focusin', onFocus);
      restore();
    };
  }, [container, distance, direction, reverse, duration, ease, initialOpacity, animateOpacity, scale,
    threshold, delay, disappearAfter, disappearDuration, disappearEase, onComplete, onDisappearanceComplete, reducedMotion]);

  return <div ref={ref} className={className} {...props}>{children}</div>;
};

export default AnimatedContent;
