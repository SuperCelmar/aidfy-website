'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; // Using framer-motion as it's already in the project and motion/react might be causing issues.

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & React.HTMLAttributes<HTMLDivElement>; // Changed to React.HTMLAttributes

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props // Now typed as React.HTMLAttributes<HTMLDivElement>
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);

  return (
    // The parent div for ProgressiveBlur should have `position: relative` if this component itself is `position: absolute`.
    // The example Demo.tsx applies `absolute` to this component, so its parent needs `relative`.
    <div className={cn('pointer-events-none', className)} {...props}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            // Ensure alpha values are between 0 and 1
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${Math.max(0, Math.min(1, pos)) * 100}%`
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
          ', '
        )})`;

        return (
          <motion.div
            key={index}
            // className='pointer-events-none absolute inset-0 rounded-[inherit]' // Removed absolute from here, should be on the parent or the wrapper in usage
            className='absolute inset-0 rounded-[inherit]'
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
          />
        );
      })}
    </div>
  );
} 