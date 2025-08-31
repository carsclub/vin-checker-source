// Image optimization utilities for better performance

interface ImageOptimizationOptions {
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
}

export const getOptimizedImageProps = (
  src: string, 
  alt: string, 
  options: ImageOptimizationOptions = {}
) => {
  const { loading = 'lazy', priority = false, quality = 85 } = options;
  
  return {
    src,
    alt,
    loading: priority ? 'eager' : loading,
    decoding: 'async' as const,
    style: { 
      objectFit: 'cover' as const,
      maxWidth: '100%',
      height: 'auto'
    },
    // Add blur placeholder for better perceived performance
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.transition = 'filter 0.3s ease';
    },
    onLoadStart: (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.filter = 'blur(5px)';
      e.currentTarget.style.transition = 'none';
    }
  };
};

// Preload critical images
export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Image lazy loading intersection observer
export const createImageObserver = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    },
    { rootMargin: '50px' }
  );
};