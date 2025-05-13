"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface CustomTimelineItemProps {
  title: string;
  description: React.ReactNode;
  // Note: icon and imageSrc from FeaturesTimeline.tsx item structure
  // are not explicitly used by this layout.
  // If they are part of the description JSX, they will be rendered.
  icon?: React.ElementType;
  imageSrc?: string;
}

interface CustomTimelineProps {
  items: CustomTimelineItemProps[];
  title?: string;
  subtitle?: string;
}

export const CustomTimeline: React.FC<CustomTimelineProps> = ({ items, title, subtitle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      // Ensure the component is mounted and ref.current is available
      const measure = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
      };
      measure(); // Initial measure

      // Optional: Re-measure on window resize if layout is responsive
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
  }, [items]); // Re-calculate if items change, as this could affect height

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white font-sans md:px-10"
      ref={containerRef}
    >
      {/* Title and Subtitle Section */}
      {(title || subtitle) && (
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-10 text-center md:text-left">
          <span className="inline-block bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 shadow-md mb-4">
            Features
          </span>
          {title && (
            <h2 className="text-4xl md:text-5xl mb-4 font-bold text-black max-w-4xl mx-auto md:mx-0">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-neutral-700 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-20 md:gap-10" // Reduced md:pt-40 to md:pt-20
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 border border-neutral-300 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:text-3xl font-bold text-neutral-500 dark:text-neutral-500 md:pl-20"> {/* Reduced md:text-5xl to md:text-3xl */}
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
              {item.description}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height > 0 ? height + "px" : "auto", // Ensure height is positive or fallback
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomTimeline; 