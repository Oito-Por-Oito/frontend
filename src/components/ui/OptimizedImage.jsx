import React, { forwardRef } from 'react';

const OptimizedImage = forwardRef(function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  sizes = '100vw',
  priority = false,
  ...props 
}, ref) {
  // Generate WebP path if the source is a PNG or JPG
  const isOptimizable = /\.(png|jpg|jpeg)$/i.test(src);
  const webpSrc = isOptimizable ? src.replace(/\.(png|jpg|jpeg)$/i, '.webp') : null;
  
  const imgProps = {
    ref,
    src,
    alt,
    className,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    ...props
  };

  // If WebP version might exist, use picture element for fallback
  if (webpSrc) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img {...imgProps} />
      </picture>
    );
  }

  // For external images or unsupported formats, just use img with lazy loading
  return <img {...imgProps} />;
});

export default OptimizedImage;
