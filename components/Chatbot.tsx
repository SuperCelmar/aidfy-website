'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { TextShimmer } from '@/components/ui/text-shimmer'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import ReactMarkdown from 'react-markdown'

// Define structures for Carousel
interface CarouselButton {
  label: string; // Use 'name' from Voiceflow payload
  payload: any;  // Use 'request' from Voiceflow payload
}

interface CarouselCard {
  id: string;
  title: string;
  description: { text: string; [key: string]: any }; 
  imageUrl: string;
  buttons: CarouselButton[]; 
}

// Update ChatMessage interface
interface ChatMessage {
  type: 'user' | 'ai' | 'system'
  text?: string
  choices?: Array<{ label: string; payload: any }>
  carousel?: CarouselCard[]; // Add optional carousel property
}

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [currentUserID] = useState('unique-user-id-' + Date.now())
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null)
  const [isAiTextAnimationComplete, setIsAiTextAnimationComplete] = useState(true);
  const [currentAnimatingText, setCurrentAnimatingText] = useState<string | null>(null);

  const projectID = process.env.NEXT_PUBLIC_VOICEFLOW_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_VOICEFLOW_API_KEY;

  const interactingTitle = 'Ask me anything...' 
  const LAUNCH_ACTION = { type: 'launch' };

  // Declare lastMessage *before* useEffect that uses it
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const logoWidthPlusGap = '[calc(2rem+0.75rem)]';

  const handleTraceEvent = (trace: any) => {
    switch (trace.type) {
      case 'text':
      case 'speak':
        setMessages((prev) => [...prev, { type: 'ai', text: trace.payload.message }])
        break
      case 'choice': 
        if (trace.payload && Array.isArray(trace.payload.buttons)) {
          const newChoices = trace.payload.buttons.map((button: any) => ({
            label: button.name,
            payload: { type: button.request?.type || 'intent', request: button.request },
          }));
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            if (lastMessageIndex >= 0 && 
                updatedMessages[lastMessageIndex].type === 'ai' && 
                !updatedMessages[lastMessageIndex].choices && 
                updatedMessages[lastMessageIndex].text) {
              updatedMessages[lastMessageIndex] = {
                ...updatedMessages[lastMessageIndex],
                choices: newChoices,
              };
              return updatedMessages;
            } else {
              return [
                ...prevMessages,
                {
                  type: 'ai',
                  text: "Please make a selection:",
                  choices: newChoices,
                },
              ];
            }
          });
        } 
        break
      case 'carousel':
        if (trace.payload && Array.isArray(trace.payload.cards)) {
          const newCarousel: CarouselCard[] = trace.payload.cards.map((card: any) => ({
            id: card.id,
            title: card.title,
            description: card.description,
            imageUrl: card.imageUrl,
            buttons: card.buttons.map((button: any) => ({ 
              label: button.name,
              payload: button.request
            }))
          }));
          setMessages((prev) => [...prev, { type: 'ai', carousel: newCarousel }]);
        } 
        break
      case 'debug': break;
      case 'end': setIsThinking(false); break;
      default: break;
    }
  }

  const sendInteraction = async (action: object) => {
    if (!projectID || !apiKey) {
      setMessages((prev) => [...prev, { type: 'system', text: 'Chatbot not configured.'}]);
      return;
    }
    setIsThinking(true);
    if (eventSourceRef.current) eventSourceRef.current.close();
    const url = `https://general-runtime.voiceflow.com/v2/project/${projectID}/user/${currentUserID}/interact/stream`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': apiKey, 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({ action }),
      });
      if (!response.ok || !response.body) throw new Error(`HTTP error! status: ${response.status}`);
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) { setIsThinking(false); break; }
        buffer += value;
        let eventEndIndex;
        while ((eventEndIndex = buffer.indexOf('\n\n')) !== -1) {
          const eventString = buffer.substring(0, eventEndIndex);
          buffer = buffer.substring(eventEndIndex + 2);
          if (eventString.startsWith('event: end')) {
            handleTraceEvent({ type: 'end' });
            if (eventSourceRef.current) eventSourceRef.current.close();
            reader.cancel();
            return;
          }
          if (eventString.startsWith('event: trace')) {
            const dataLine = eventString.split('\n').find(line => line.startsWith('data: '));
            if (dataLine) {
              try { handleTraceEvent(JSON.parse(dataLine.substring(5))); }
              catch (e) { /* console.error */ }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { type: 'system', text: 'Error connecting to assistant stream.'}]);
      setIsThinking(false);
    }
  }

  useEffect(() => {
    if (!hasInteracted) {
      sendInteraction(LAUNCH_ACTION);
      setHasInteracted(true);
    }
    return () => { if (eventSourceRef.current) eventSourceRef.current.close(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (messageText?: string, customPayload?: any) => {
    const textToSend = messageText || inputValue;
    const interactionAction = customPayload ? customPayload : { type: 'text', payload: textToSend };
    if (!customPayload && textToSend.trim()) {
      setMessages((prev) => [...prev, { type: 'user', text: textToSend }])
    }
    await sendInteraction(interactionAction);
    if (!customPayload) setInputValue('');
  }

  const handleChoiceClick = (choicePayload: any) => {
    sendInteraction(choicePayload.request);
  }

  const handleCarouselButtonClick = (buttonPayload: any) => {
    if (buttonPayload) {
        sendInteraction(buttonPayload);
    } else {
        console.warn('Carousel button clicked without valid payload');
    }
  }

  const scrollToCard = (index: number) => {
    const cardElement = document.getElementById(`carousel-card-${index}`);
    cardElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handlePrevClick = () => {
    setActiveIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      scrollToCard(newIndex);
      return newIndex;
    });
  };

  const handleNextClick = () => {
    const numCards = lastMessage?.carousel?.length || 0;
    setActiveIndex((prev) => {
      const newIndex = Math.min(numCards - 1, prev + 1);
      scrollToCard(newIndex);
      return newIndex;
    });
  };

  useEffect(() => {
    if (lastMessage?.carousel) {
      setActiveIndex(0);
      setTimeout(() => scrollToCard(0), 100);
    }
  // This useEffect depends on lastMessage, which is derived from messages state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage?.carousel]); 

  const getAiMessageStyles = (text: string | undefined) => {
    if (!text) return { size: 'text-5xl', weight: 'font-semibold' }; // Default if text is undefined
    const length = text.length;
    if (length < 50) {
      return { size: 'text-5xl', weight: 'font-semibold' };
    } else if (length < 150) {
      return { size: 'text-3xl', weight: 'font-medium' };
    } else {
      return { size: 'text-xl', weight: 'font-normal' };
    }
  };

  // Updated Thinking Indicator
  const thinkingIndicator = (
    <div className="flex items-center mb-4 pl-4"> 
      <Image src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets/logo.png" alt="Brand Logo" width={28} height={28} className="mr-3 h-7 w-7" />
      <TextShimmer 
        as="h2" 
        className="text-3xl opacity-70 font-mono"
        baseColor="#6b7280" /* gray-500 */ 
        shimmerColor="#cbd5e1" /* slate-300, a lighter gray for shimmer */
        shimmerWidth="100px"
        duration={1.5}
      >
        Thinking...
      </TextShimmer>
    </div>
  );

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'ai' && lastMessage.text) {
      if (lastMessage.text !== currentAnimatingText) {
        setIsAiTextAnimationComplete(false);
        setCurrentAnimatingText(lastMessage.text);
      }
    }
  }, [lastMessage?.text, lastMessage?.type, currentAnimatingText]);

  return (
    <div className="flex flex-col w-full space-y-4"> 
      <div className="min-h-[120px]">
        {/* Thinking Indicator - Rendered if isThinking is true */}
        {isThinking && thinkingIndicator}

        {/* User Message - Rendered if the last message is from the user */}
        {lastMessage && lastMessage.type === 'user' && (
          <div className={`pt-4 pb-2 ml-${logoWidthPlusGap}`}> 
            <h2 className="text-3xl font-medium text-sky-600">
              You: {lastMessage.text}
            </h2>
          </div>
        )}

        {/* AI Message Content - Rendered only if not thinking and last message is AI */}
        {lastMessage && lastMessage.type === 'ai' && !isThinking && (
          <div className={`pt-4 pb-2 transition-opacity duration-300 ${inputValue.trim() ? 'opacity-50' : 'opacity-100'}`}> 
            {lastMessage.text && (
              <div className={`flex-grow ml-${logoWidthPlusGap}`}> 
                {(() => {
                  const styles = getAiMessageStyles(lastMessage.text);
                  const combinedClassName = `${styles.size} ${styles.weight} text-gray-800`;

                  if (!isAiTextAnimationComplete && lastMessage.text === currentAnimatingText) {
                    return (
                      <TextGenerateEffect 
                        key={currentAnimatingText}
                        words={currentAnimatingText!} 
                        className={combinedClassName}
                        duration={0.5} 
                        staggerDuration={0.05} 
                        filter={true} 
                        as="div" 
                        onAnimationComplete={() => {
                          if (lastMessage.text === currentAnimatingText) {
                            setIsAiTextAnimationComplete(true);
                          }
                        }}
                      />
                    );
                  } else {
                    return (
                      <div className={combinedClassName}>
                        <ReactMarkdown>{lastMessage.text}</ReactMarkdown>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
            {/* AI Choices */} 
            {lastMessage.choices && (
              <div className={`flex flex-wrap gap-3 mt-4 ml-${logoWidthPlusGap}`}> 
                {lastMessage.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoiceClick(choice.payload)}
                    className="px-5 py-2.5 border border-slate-700 text-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-base font-medium"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            )}
            {/* AI Carousel */} 
            {lastMessage.carousel && (
              <div className="relative pt-6">
                {/* Carousel Scroll Container */} 
                <div 
                  ref={carouselContainerRef} 
                  className="mt-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar scroll-pl-6 md:scroll-pl-10 lg:scroll-pl-16"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Force hide scrollbar
                > 
                  <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  <div className="flex space-x-6 px-6 md:px-10 lg:px-16"> 
                    {lastMessage.carousel.map((card, index) => {
                      const isActive = index === activeIndex;
                      const buttonColClass = card.buttons.length === 1 ? 'grid-cols-1' : 
                                               card.buttons.length === 2 ? 'grid-cols-2' : 
                                               'grid-cols-3'; 
                      return (
                        // Wrapper Div for Card + Overlay
                        <div
                          key={`${card.id}-wrapper`}
                          className={`relative flex-shrink-0 w-72 pt-8 transition-all duration-300 ease-out transform ${ 
                            isActive ? 'opacity-100 scale-105 z-10' : 'opacity-60 scale-95 z-0' 
                          }`}
                        >
                          {/* Logo + ID Overlay */} 
                          <div className={`absolute top-0.5 left-4 z-20 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all duration-300 ease-out ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}> 
                            <Image 
                              src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets/logo.png" 
                              alt="Logo" 
                              width={24} 
                              height={24} 
                              className="w-6 h-6"
                            />
                            <span className="text-sm font-semibold text-gray-700">ID: {card.id}</span>
                          </div>
                          {/* Actual Card Content Div */} 
                          <div 
                            id={`carousel-card-${index}`}
                            className="w-full h-96 bg-white rounded-xl overflow-hidden shadow-xl flex flex-col"
                          >
                            {card.imageUrl && (
                              <div className="relative w-full h-60 flex-shrink-0 bg-gray-100">
                                <Image 
                                  src={card.imageUrl} 
                                  alt={card.title}
                                  fill={true}
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                />
                              </div>
                            )}
                            <div className="p-4 flex flex-col flex-grow"> 
                              <h4 className="font-semibold text-base text-gray-800 truncate mb-2">{card.title}</h4> 
                              <div className={`mt-auto grid ${buttonColClass} gap-2 pt-2 border-t border-gray-100`}> 
                                {card.buttons.map((button, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleCarouselButtonClick(button.payload)} 
                                    className="text-center px-2 py-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors text-xs font-medium truncate"
                                  >
                                    {button.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Dots Navigation */}
                {(lastMessage.carousel.length ?? 0) > 1 && (
                  <div className="flex justify-center items-center space-x-2 pt-4 mt-2">
                    {lastMessage.carousel.map((_, index) => (
                      <button
                        key={`dot-${index}`}
                        onClick={() => {
                          setActiveIndex(index);
                          scrollToCard(index);
                        }}
                        aria-label={`Go to card ${index + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-out
                                    ${activeIndex === index ? 'bg-slate-700 scale-125' : 'bg-gray-300 hover:bg-gray-400'}
                                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50`}
                      />
                    ))}
                  </div>
                )}
                {/* Prev/Next Buttons */} 
                {activeIndex > 0 && (
                  <button 
                    onClick={handlePrevClick}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow-md ml-2"
                    aria-label="Previous Card"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                {(messages[messages.length - 1]?.carousel?.length ?? 0) > 1 && activeIndex < (messages[messages.length - 1]?.carousel?.length ?? 0) - 1 && (
                  <button 
                    onClick={handleNextClick}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow-md mr-2"
                    aria-label="Next Card"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* System Message - Rendered only if not thinking and last message is system */}
        {lastMessage && lastMessage.type === 'system' && !isThinking && (
             <div className={`pt-4 pb-2 ml-${logoWidthPlusGap}`}> 
                <h2 className="text-lg italic text-red-600">
                    {lastMessage.text}
                </h2>
             </div>
        )}
      </div>

      {/* Input Area - Conditionally rendered based on !isThinking */}
      { !isThinking && (
        <div className={`mt-auto space-y-3 ml-${logoWidthPlusGap}`}> 
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isThinking && inputValue.trim() && handleSendMessage()}
            placeholder="Type here..." 
            className="w-full p-3 bg-transparent text-gray-800 focus:outline-none transition-colors text-xl placeholder-gray-500"
            disabled={isThinking} // This disabled prop is technically redundant now but harmless
          />
          {inputValue.trim() && !isThinking && ( // This !isThinking is also redundant due to the parent conditional, but harmless
            <div className="flex justify-start items-center"> 
              <button
                onClick={() => inputValue.trim() && handleSendMessage()}
                disabled={isThinking || !inputValue.trim()} 
                className="px-7 py-3 bg-slate-700 text-white rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 disabled:opacity-50 transition-colors text-base font-medium shadow-sm"
              >
                Send
              </button>
              <p className="ml-4 self-center text-base text-gray-500">Or Press Enter</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 