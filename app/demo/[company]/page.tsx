'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DemoPageProps {
  params: { company: string };
}

export default function DemoPage({ params }: DemoPageProps) {
  const { company } = params;

  const slides = [
    {
      title: `Welcome ${company}`,
      content: (
        <iframe
          className="w-full aspect-video rounded"
          src="https://www.loom.com/embed/d2f9bede23a14e46b15b3bfe888a1daa"
          allowFullScreen
        />
      ),
      cta: 'Start Demo',
    },
    {
      title: 'The Problem',
      content: (
        <p className="text-lg">Your team spends countless hours on repetitive tasks.</p>
      ),
      cta: 'Show Me the Fix',
    },
    {
      title: 'The Solution',
      content: (
        <p className="text-lg">AutomationDFY automates those workflows for you.</p>
      ),
      cta: 'Try the Chatbot',
    },
    {
      title: 'Chat with the Bot',
      content: (
        <div className="border rounded p-8 h-64 flex items-center justify-center">
          Chatbot placeholder
        </div>
      ),
      cta: 'Book a Demo',
      final: true,
    },
  ];

  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const next = () => {
    if (!slide.final) {
      setIndex((i) => Math.min(i + 1, slides.length - 1));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-2xl font-bold">{slide.title}</h1>
        <div>{slide.content}</div>
        {slide.final ? (
          <Link
            href="/book-demo"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
          >
            {slide.cta}
          </Link>
        ) : (
          <button
            onClick={next}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {slide.cta}
          </button>
        )}
      </div>
    </div>
  );
}

