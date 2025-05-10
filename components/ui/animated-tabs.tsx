"use client";

import React, { useState, ReactNode, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode; // For pre-rendered icons
  content: ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  containerClassName?: string;
  tabListClassName?: string;       // Class for the bar containing tab buttons
  tabButtonClassName?: string;     // Base class for each tab button
  activeTabButtonClassName?: string;  // Class for the active tab button (e.g., brand blue bg)
  inactiveTabButtonClassName?: string; // Class for inactive tab buttons (e.g., soft gray bg)
  tabContentContainerClassName?: string; // Class for the main content display area
  initialTabId?: string;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  containerClassName,
  tabListClassName,
  tabButtonClassName,
  activeTabButtonClassName,
  inactiveTabButtonClassName,
  tabContentContainerClassName,
  initialTabId,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTabId || (tabs.length > 0 ? tabs[0].id : ''));
  const contentRef = useRef<HTMLDivElement>(null);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!contentRef.current) return;
    const { offset, velocity } = info;
    const swipeThreshold = contentRef.current.offsetWidth / 3; // Swipe if dragged more than 1/3 of width

    if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x < 0) { // Swiped left
        const nextIndex = (activeTabIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
      } else { // Swiped right
        const prevIndex = (activeTabIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].id);
      }
    } else if (Math.abs(velocity.x) > 300 && Math.abs(offset.x) < swipeThreshold /2 ) { // Quick flick
       if (velocity.x < 0) { // Flicked left
        const nextIndex = (activeTabIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
      } else { // Flicked right
        const prevIndex = (activeTabIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].id);
      }
    }
  };

  return (
    <div className={cn("w-full", containerClassName)}>
      {/* Tab Buttons Bar */}
      <div
        className={cn(
          "flex space-x-1 rounded-lg p-1 bg-transparent border border-slate-300", // Tab bar: transparent bg, slate-300 border, p-1
          tabListClassName
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue border", // py-2 for smaller height, added base border class
              tabButtonClassName,
              activeTab === tab.id
                ? cn("text-white shadow-sm", activeTabButtonClassName || "bg-slate-700 border-slate-700") // Active: dark grey blue bg & border, white text
                : cn("text-slate-700 hover:bg-slate-200", inactiveTabButtonClassName || "bg-slate-100 border-slate-300") // Inactive: slate bg & border, slate text
            )}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBubble"
                className={cn("absolute inset-0 z-0 rounded-md", activeTabButtonClassName || "bg-slate-700")}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {tab.icon}
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div 
        ref={contentRef}
        className={cn("mt-3 overflow-hidden rounded-lg bg-white shadow-lg p-1", tabContentContainerClassName)} // Content area: white background, more prominent shadow
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeTabData && (
            <motion.div
              key={activeTabData.id}
              id={`panel-${activeTabData.id}`}
              role="tabpanel"
              aria-labelledby={activeTabData.id}
              className="w-full" // Ensure content div takes full width for drag
              initial={{ opacity: 0, x: activeTabIndex < tabs.findIndex(t => t.id === activeTab) ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTabIndex < tabs.findIndex(t => t.id === activeTab) ? -100 : 100 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ touchAction: 'pan-y' }} // Prevent vertical scroll while dragging
            >
              <div className="p-4 md:p-6 min-h-[400px] sm:min-h-[550px] lg:min-h-[700px]"> {/* Increased min-height */}
                 {activeTabData.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimatedTabs; 