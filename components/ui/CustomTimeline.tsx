'use client';
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const CustomTimeline = ({ data, sectionTitle, sectionSubtitle }: { data: TimelineEntry[], sectionTitle?: string, sectionSubtitle?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]); // Added data to dependency array to re-calculate height if data changes

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
      {(sectionTitle || sectionSubtitle) && (
        <div className="max-w-7xl mx-auto py-10 md:py-20 px-4 md:px-8 lg:px-10 text-center md:text-left">
          {sectionTitle && (
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900 font-bold max-w-4xl mx-auto md:mx-0">
              {sectionTitle}
            </h2>
          )}
          {sectionSubtitle && (
            <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto md:mx-0">
              {sectionSubtitle}
            </p>
          )}
        </div>
      )}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-10 md:pb-20">
        {data.map((item, index) => (
          <div
            key={index} // Consider using a unique ID from item if available
            className="flex justify-start pt-10 md:pt-20 md:gap-10"
          >
            {/* Sticky Title Column (Desktop) / Static Title (Mobile) */}
            <div className="sticky flex flex-col md:flex-row z-10 items-center top-28 md:top-40 self-start max-w-[100px] sm:max-w-xs lg:max-w-sm md:w-full">
              {/* Timeline Dot */}
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center z-20">
                <div className="h-4 w-4 rounded-full bg-gray-200 border border-gray-300 p-2" />
              </div>
              {/* Desktop Title */}
              <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl lg:text-4xl font-semibold text-gray-500">
                {item.title}
              </h3>
            </div>

            {/* Content Column */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              {/* Mobile Title */}
              <h3 className="md:hidden block text-2xl mb-4 text-left font-semibold text-gray-700">
                {item.title}
              </h3>
              <div className="text-gray-700">
                {item.content}
              </div>
            </div>
          </div>
        ))}
        {/* Animated Timeline Bar */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-gray-300 to-transparent from-[0%] via-[10%] to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%,#000_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-600 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}; 