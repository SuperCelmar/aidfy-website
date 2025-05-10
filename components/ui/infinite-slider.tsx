'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect, Children, isValidElement, cloneElement } from 'react';
import useMeasure from 'react-use-measure';

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
  itemClassName?: string; // Added to style individual items
};

export function InfiniteSlider({
  children,
  gap = 48, // Default gap from Demo.tsx
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
  itemClassName,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  const childArray = Children.toArray(children).filter(isValidElement);

  useEffect(() => {
    let controls: ReturnType<typeof animate> | undefined;
    const size = direction === 'horizontal' ? width : height;
    if (size === 0 || childArray.length === 0) return;

    // Calculate content size based on actual item widths/heights if possible, or estimate
    // This simple version assumes all items are roughly the same size or uses the container for estimation
    const singleItemSize = size / childArray.length; 
    const contentSizeBasedOnItems = (singleItemSize + gap) * childArray.length - gap; 
    const effectiveContentSize = contentSizeBasedOnItems > 0 ? contentSizeBasedOnItems : size; 

    const from = reverse ? -effectiveContentSize / 2 : 0;
    const to = reverse ? 0 : -effectiveContentSize / 2;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration:
          currentDuration * Math.abs((translation.get() - to) / (effectiveContentSize / 2)), // Adjust duration based on remaining distance
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1); // Re-trigger animation for smooth continuation
          translation.set(from); // Reset to start for the new loop
        },
      });
    } else {
      translation.set(from); // Ensure it starts from the correct position
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        // onRepeat: () => {
        //   translation.set(from); // Framer Motion handles this with loop
        // },
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
    childArray.length, // Add childArray.length as a dependency
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          if (durationOnHover !== currentDuration) {
            setIsTransitioning(true);
            setCurrentDuration(durationOnHover);
          }
        },
        onHoverEnd: () => {
          if (duration !== currentDuration) {
            setIsTransitioning(true);
            setCurrentDuration(duration);
          }
        },
      }
    : {};

  return (
    <div className={cn('overflow-hidden', className)} ref={ref}>
      <motion.div
        key={key} // Add key here to force re-render for smoother transitions on hover speed change
        className='flex w-max'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        {...hoverProps}
      >
        {childArray.map((child, i) => (
          <div key={`child-${i}`} className={itemClassName}>{child}</div>
        ))}
        {childArray.map((child, i) => (
          <div key={`clone-${i}`} className={itemClassName}>{child}</div>
        ))} 
      </motion.div>
    </div>
  );
} 