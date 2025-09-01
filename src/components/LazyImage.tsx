import React, { useState, useRef, useEffect, CSSProperties } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  removeBackground?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==',
  threshold = 0.1,
  rootMargin = '50px',
  removeBackground = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // Fallback to placeholder on error
    setIsLoaded(false);
  };

  // CSS filters to help remove white backgrounds from PNG images
  const getImageStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      backgroundImage: `url(${placeholder})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    if (removeBackground) {
      return {
        ...baseStyles,
        filter: 'brightness(0) saturate(100%) invert(1)',
        mixBlendMode: 'multiply',
      };
    }

    return baseStyles;
  };

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${className} ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      loading="lazy"
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      style={getImageStyles()}
    />
  );
};

export default LazyImage;
