import React from 'react';
import AnimatedTabs, { Tab } from './ui/animated-tabs';
import { BriefcaseBusiness, Waypoints } from 'lucide-react';
import Image from 'next/image'; // Using next/image for optimized images

const useCasesData: Tab[] = [
  {
    id: "peak-season",
    label: "Peak Season CS",
    icon: <BriefcaseBusiness className="h-5 w-5" />, 
    content: (
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div className="relative w-full h-96 sm:h-[500px] lg:h-[660px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop"
            alt="Customer service team during peak season"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            Handling Peak Seasonal CS
          </h3>
          <p className="text-sm md:text-base text-slate-600">
            For a gifting business, we cut the refund rate from 15% to 5% and slashed response times from 2 days to just 15 minutes during their busiest periods.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "order-tracking",
    label: "Order & Tracking",
    icon: <Waypoints className="h-5 w-5" />, 
    content: (
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        <div className="relative w-full h-96 sm:h-[500px] lg:h-[660px] rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1579548020916-f6d345907f17?q=80&w=1200&auto=format&fit=crop"
            alt="Restaurant order tracking system"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-left">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            Streamlining Ordering & Tracking
          </h3>
          <p className="text-sm md:text-base text-slate-600">
            A restaurant franchise saw a 10% rise in orders and a 20% conversion boost by resolving IT and staffing issues, leading to higher CSAT scores.
          </p>
        </div>
      </div>
    )
  }
];

export const UseCasesSection: React.FC = () => {
  return (
    <section id="use-cases" className="py-12 md:py-20 bg-white min-h-screen flex flex-col justify-center"> {/* Added min-h-screen and flex properties */}
      <div className="container mx-auto px-4 w-full"> {/* Ensured container takes width for centering */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Solve Real Business Challenges
          </h2>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how our AI-powered solutions are helping businesses like yours overcome critical obstacles and achieve remarkable results.
          </p>
        </div>
        <div className="max-w-5xl mx-auto w-full"> 
          <AnimatedTabs
            tabs={useCasesData}
            tabListClassName="max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection; 