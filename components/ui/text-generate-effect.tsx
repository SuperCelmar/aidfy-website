'use client';
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true, // Default to true as per original component for blur effect
  duration = 0.5,
  staggerDuration = 0.2, // Added prop for stagger control
  as: Component = "div", // Default to div, can be overridden
  onAnimationComplete,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  staggerDuration?: number;
  as?: React.ElementType;
  onAnimationComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    const animateText = async () => {
      await animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration,
          delay: stagger(staggerDuration),
        }
      );
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    };

    animateText();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, filter, duration, staggerDuration, onAnimationComplete, animate]);

  const renderWords = () => {
    return (
      // Keying the motion.div on `words` ensures it re-renders if words change, resetting children for animation
      <motion.div ref={scope} key={words}> 
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              // Base styling for animated words, color will come from parent or className
              className="opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };
  // The component itself doesn't enforce text color, relies on parent or passed className.
  // Removed default 'font-bold' and inner div structure from original example to make it more flexible.
  return (
    <Component className={cn(className)}>
      {renderWords()}
    </Component>
  );
}; 