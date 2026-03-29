import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Show blur-up placeholder while loading */
  blurPlaceholder?: boolean;
}

const OptimizedImage = ({
  src,
  alt = "",
  className,
  blurPlaceholder = true,
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            blurPlaceholder && !loaded && "scale-105 blur-sm opacity-0",
            blurPlaceholder && loaded && "scale-100 blur-0 opacity-100",
            !blurPlaceholder && "opacity-100"
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
