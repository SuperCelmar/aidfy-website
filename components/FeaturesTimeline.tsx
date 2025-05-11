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
  section_title: string;
  title: string;
  description: string;
  bullet_points?: string[]; // Added optional bullet_points
  icon: React.ElementType; // Corrected type for React component
  imageSrc: string; // Unsplash image URL
  imageAlt: string;
}

// Updated defaultFeatures with lucide icons and Unsplash images
const defaultFeaturesData: Feature[] = [
  {
    id: 'feat-phone',
    section_title: "AI Phone Callers",
    title: "Never Miss a Lead — 24/7 AI Call Handling",
    description: "Our AI Phone Callers answer every incoming call (even nights & weekends), qualify prospects with scripted questions, verify contact details and automatically schedule follow-up or demos—so you capture and convert 100% of your opportunities.",
    bullet_points: [
      "🕒 <strong>24/7 Coverage</strong> — No more lost leads outside office hours",
      "🎯 <strong>Instant Qualification</strong> — Ask the right questions, capture intent",
      "📅 <strong>Auto-Scheduling</strong> — Book demos in real time",
      "🔗 <strong>CRM Sync</strong> — Data flows straight into your systems"
    ],
    icon: PhoneOutgoing,
    imageSrc: 'https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets/phone_call_caucasian.png',
    imageAlt: 'AI Phone Caller Interface'
  },
  {
    id: 'feat-chatbot',
    section_title: "Website Embedded Chatbot",
    title: "Top-Tier Customer Experience — Increases Conversions",
    description: "Imagine having an AI that welcomes each visitor, answers questions instantly, and guides them straight to checkout. That lives within your website, and not on a pop-up widget. Boosting conversions while your team can focus on more operational tasks.",
    icon: MessageSquareText,
    imageSrc: 'https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets/chatbot_caucasian.png',
    imageAlt: 'AI Chatbot on Website'
  },
  {
    id: 'feat-expansion',
    section_title: "Channel Expansion Engine",
    title: "Unlock Growth with with Multi-Channel Outreach",
    description: "Reach every customer on their favorite platform—SMS, WhatsApp, web-chat or phone—using our smart orchestration engine that personalizes and scales your campaigns automatically.",
    bullet_points: [
      "🔗 <strong>Multi-Channel</strong> — SMS, WhatsApp, Telegram, Discord, web-chat or phone",
      "🔄 <strong>Smart Orchestration</strong> — AI Personalizes and scales campaigns",
      "📈 <strong>Growth Engine</strong> — Automate outreach to new customers"
    ],
    icon: Share2,
    imageSrc: 'https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets/multichanel.png',
    imageAlt: 'Multi-channel marketing dashboard'
  },
  {
    id: 'feat-crm',
    section_title: "CRM Integration",
    title: "One CRM to Rule Them All — Increases Efficiency",
    description: "Seamlessly connects with any CRM platform out of the box, ensuring smooth data flow and synchronized operations.",
    icon: Network,
    imageSrc: 'https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets/CRM-section.png',
    imageAlt: 'CRM Integration Network'
  }
];

interface FeaturesTimelineProps {
  features?: Feature[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const FeaturesTimeline: React.FC<FeaturesTimelineProps> = ({
  features = defaultFeaturesData,
  sectionTitle = "How Our AI Solutions Elevate Your Business",
  sectionSubtitle = "Discover the core features that drive growth, efficiency, and customer satisfaction."
}) => {

  const timelineData: TimelineEntry[] = features.map(feature => ({
    title: feature.section_title,
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
            className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-300" // Changed object-cover to object-contain
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