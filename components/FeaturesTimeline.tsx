'use client';

import React from 'react';
import Image from 'next/image';
import { CustomTimeline, TimelineEntry } from '@/components/ui/CustomTimeline'; // Updated import path
import {
  Zap, // Lightning bolt for AI/Speed
  PhoneOutgoing, // Phone calls
  MessageSquareText, // Chatbot
  Share2, // Channel Expansion / Integration
  Network, // CRM Hub / Network
  CalendarClock, // Scheduling
  // Icon as LucideIcon // Not needed as a type directly here, React.ElementType is more general
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Corrected type for React component
  imageSrc: string; // Unsplash image URL
  imageAlt: string;
}

// Updated defaultFeatures with lucide icons and Unsplash images
const defaultFeaturesData: Feature[] = [
  {
    id: 'feat-phone',
    title: "EQ AI Phone Callers",
    description: "Turns off-hours missed calls into business opportunities, ensuring every lead is captured and nurtured, 24/7.",
    icon: PhoneOutgoing,
    imageSrc: 'https://images.unsplash.com/photo-1520923642038-b42e59690fe2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FsbCUyMGNlbnRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    imageAlt: 'AI Phone Caller Interface'
  },
  {
    id: 'feat-chatbot',
    title: "AI Website Chatbot",
    description: "A full-fledged conversational AI embedded on your site, providing instant answers and guiding users effectively.",
    icon: MessageSquareText,
    imageSrc: 'https://images.unsplash.com/photo-1551809008-4a67a1309010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoYXRib3QlMjB1aXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    imageAlt: 'AI Chatbot on Website'
  },
  {
    id: 'feat-expansion',
    title: "Channel Expansion Engine",
    description: "Boost conversion rates with AI-driven SMS & phone campaigns, reaching customers on their preferred channels.",
    icon: Share2,
    imageSrc: 'https://images.unsplash.com/photo-1580130281329-39b893951a30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21zJTIwbWFya2V0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    imageAlt: 'Multi-channel marketing dashboard'
  },
  {
    id: 'feat-crm',
    title: "CRM Integration Hub",
    description: "Seamlessly connects with any CRM platform out of the box, ensuring smooth data flow and synchronized operations.",
    icon: Network,
    imageSrc: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y3JtfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    imageAlt: 'CRM Integration Network'
  },
  {
    id: 'feat-scheduling',
    title: "Autonomous Scheduling Agents",
    description: "Automate your appointment booking end-to-end, freeing up your team and reducing no-shows.",
    icon: CalendarClock,
    imageSrc: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNjaGVkdWxpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    imageAlt: 'Automated Scheduling Calendar'
  }
];

interface FeaturesTimelineProps {
  features?: Feature[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const FeaturesTimeline: React.FC<FeaturesTimelineProps> = ({
  features = defaultFeaturesData,
  sectionTitle = "How Our AI Elevates Your Business",
  sectionSubtitle = "Discover the core features that drive growth, efficiency, and customer satisfaction for our partners."
}) => {

  const timelineData: TimelineEntry[] = features.map(feature => ({
    title: feature.title,
    content: (
      <div className="space-y-4">
        <div className="flex items-center text-slate-700 mb-2">
          <feature.icon className="w-6 h-6 mr-3 stroke-current" /> {/* Added stroke-current for lucide icons */}
          <p className="font-semibold text-lg text-gray-800">{feature.title}</p>
        </div>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          {feature.description}
        </p>
        <div className="mt-4 aspect-[16/10] rounded-lg overflow-hidden shadow-lg bg-gray-100">
          <Image 
            src={feature.imageSrc} 
            alt={feature.imageAlt} 
            width={500} // Provide appropriate width
            height={312} // Provide appropriate height based on 16:10 aspect ratio
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    ),
  }));

  return (
    <section id="features" className="py-12 md:py-20 bg-slate-50">
      <CustomTimeline 
          data={timelineData} 
          sectionTitle={sectionTitle}
          sectionSubtitle={sectionSubtitle}
      />
    </section>
  );
};

export default FeaturesTimeline; 