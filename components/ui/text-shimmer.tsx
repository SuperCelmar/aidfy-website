'use client';
import React, { useMemo, type JSX } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number; // Higher value means wider shimmer, default implies a spread relative to text length
  shimmerWidth?: string; // Explicit width for the shimmer gradient itself, e.g., "100px" or "50%"
  shimmerColor?: string; // The color of the shimmer highlight
  baseColor?: string; // The base color of the text
}

export function TextShimmer({
  children,
  as: Component = 'span', // Changed default from p to span for better inline use with h2
  className,
  duration = 2,
  // spread = 2, // Will be calculated based on shimmerWidth or default if not provided
  shimmerWidth = "150px", // A sensible default shimmer width
  shimmerColor = "#e0e0e0", // Default light gray shimmer
  baseColor = "#6b7280", // Default text-gray-500
}: TextShimmerProps) {
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);

  // The original `spread` was a multiplier. We'll use `shimmerWidth` for more direct control.
  // The CSS uses `calc(50% - var(--spread))` where `--spread` is half the shimmer highlight's width.
  // So, if shimmerWidth is 150px, then the CSS --spread variable should be 75px.
  const cssSpreadVariable = `calc(${shimmerWidth} / 2)`;

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-clip-text text-transparent',
        // CSS variables for colors, can be overridden by className
        // Base color is for the text itself, shimmerColor is for the moving highlight
        '[--shimmer-color:var(--base-gradient-color,theme(colors.white))] ',
        '[--text-color:var(--base-color,theme(colors.black))] ',
        // Using a more direct gradient definition:
        'bg-gradient-to-r from-[var(--text-color)] via-[var(--shimmer-color)] to-[var(--text-color)] ',
        'bg-[length:200%_auto]', // Background size to allow movement
        className
      )}
      initial={{ backgroundPosition: '200% center' }} // Start with shimmer off-screen to the right
      animate={{ backgroundPosition: '-200% center' }} // Move shimmer to the left
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={{
        // CSS custom properties passed via style prop
        '--base-color': baseColor,
        '--base-gradient-color': shimmerColor,
      } as React.CSSProperties}
    >
      {children}
    </MotionComponent>
  );
} 