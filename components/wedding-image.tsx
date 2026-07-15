'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type WeddingImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
  fallbackSrc?: string;
  placeholderClassName?: string;
};

export function WeddingImage({ src, fallbackSrc, alt, onError, onLoad, placeholderClassName = 'bg-cream', className, ...props }: WeddingImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSrc = (hasError ? fallbackSrc : src) || '';

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  if (!imageSrc) {
    return <div aria-label={alt} className={`absolute inset-0 z-0 animate-pulse ${placeholderClassName}`} />;
  }

  return (
    <Image
      {...props}
      alt={alt}
      src={imageSrc}
      unoptimized={props.unoptimized ?? /\.svg(?:\?|$)/i.test(imageSrc)}
      className={`z-0 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setIsLoaded(false);
        if (imageSrc !== fallbackSrc) setHasError(true);
        onError?.(event);
      }}
    />
  );
}
