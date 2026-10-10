import { useRef, useEffect } from 'react';

const Noise = ({ patternSize = 250, patternScaleX = 1, patternScaleY = 1, patternAlpha = 15 }) => {
  const grainRef = useRef(null);

  useEffect(() => {
    const element = grainRef.current;
    if (!element) return;
    // A small cached tile preserves grain without generating a megapixel every few frames.
    const size = Math.min(256, Math.max(32, Math.round(patternSize)));
    const tile = document.createElement('canvas');
    tile.width = tile.height = size;
    const ctx = tile.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < image.data.length; i += 4) {
      const value = Math.floor(Math.random() * 256);
      image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
      image.data[i + 3] = patternAlpha;
    }
    ctx.putImageData(image, 0, 0);
    element.style.backgroundImage = `url(${tile.toDataURL()})`;
    element.style.backgroundSize = `${size * patternScaleX}px ${size * patternScaleY}px`;
  }, [patternSize, patternScaleX, patternScaleY, patternAlpha]);

  return <div aria-hidden="true" className="pointer-events-none absolute inset-0" ref={grainRef} />;
};

export default Noise;
