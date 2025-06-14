'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
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

// ---- START: Definition for FixedBottomControls component ----
interface FixedBottomControlsProps {
  isInitialAnimationRunning: boolean;
  showAnimatedButtonsState: boolean;
  choicesToDisplay?: ChatMessage['choices'];
  isThinking: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => Promise<void>; // Assuming handleSendMessage is async
  onChoiceClick: (payload: any) => void;
  onStopAnimationAndShowMessage: (showLastFullMessage?: boolean) => void;
  disableInteraction: boolean;
  smallScreenMargin: string;
  largeScreenMarginClass: string;
}

const FixedBottomControls = memo<FixedBottomControlsProps>(({ 
  isInitialAnimationRunning,
  showAnimatedButtonsState,
  choicesToDisplay,
  isThinking,
  inputValue,
  onInputChange,
  onSendMessage,
  onChoiceClick,
  onStopAnimationAndShowMessage,
  disableInteraction,
  smallScreenMargin,
  largeScreenMarginClass
}) => {
  // This component now contains the JSX for buttons and input area
  return (
    <>
      {/* Unified Button Display Area */}
      { (
        (isInitialAnimationRunning && showAnimatedButtonsState && choicesToDisplay && choicesToDisplay.length > 0) ||
        (!isInitialAnimationRunning && !isThinking && choicesToDisplay && choicesToDisplay.length > 0)
      ) && (
        <div className={`flex flex-wrap gap-3 mb-3 ${smallScreenMargin} ${largeScreenMarginClass}`}> 
          {choicesToDisplay?.map((choice, i) => (
            <button
              key={`fc-choice-${i}`}
              onClick={() => onChoiceClick(choice.payload)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 border border-slate-700 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-600 hover:text-white dark:hover:text-white transition-colors text-sm sm:text-base font-medium"
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      { (
        isInitialAnimationRunning ||
        (!isInitialAnimationRunning && !isThinking)
      ) && (
        <div className={`space-y-3 ${smallScreenMargin} ${largeScreenMarginClass}`}> 
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={() => isInitialAnimationRunning && onStopAnimationAndShowMessage(true)}
            onKeyPress={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                    if (isInitialAnimationRunning) onStopAnimationAndShowMessage(true);
                    onSendMessage();
                } else if (isInitialAnimationRunning) {
                    onStopAnimationAndShowMessage(true);
                }
            }}
            placeholder={isInitialAnimationRunning ? "Interact to begin..." : "Type here..."} 
            className="w-full p-3 bg-transparent text-gray-800 dark:text-white focus:outline-none transition-colors text-base sm:text-lg md:text-xl placeholder-gray-500 dark:placeholder-gray-400"
            disabled={disableInteraction}
          />
          {inputValue.trim() && ( 
            <div className="flex justify-start items-center"> 
              <button
                onClick={() => {
                    if (isInitialAnimationRunning) onStopAnimationAndShowMessage(true);
                    if(inputValue.trim()) onSendMessage();
                }}
                disabled={!inputValue.trim() || disableInteraction} 
                className="px-5 py-2.5 sm:px-7 sm:py-3 bg-slate-700 text-white rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 disabled:opacity-50 transition-colors text-sm sm:text-base font-medium shadow-sm"
              >
                Send
              </button>
              <p className="ml-3 sm:ml-4 self-center text-xs sm:text-base text-gray-500 dark:text-gray-400">Or Press Enter</p>
            </div>
          )}
        </div>
      )}
    </>
  );
});
FixedBottomControls.displayName = 'FixedBottomControls'; // For better debugging
// ---- END: Definition for FixedBottomControls component ----

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [currentUserID] = useState('unique-user-id-' + Date.now())
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For debouncing scroll
  const eventSourceRef = useRef<EventSource | null>(null)
  const [isAiTextAnimationComplete, setIsAiTextAnimationComplete] = useState(true);
  const [currentAnimatingText, setCurrentAnimatingText] = useState<string | null>(null);
  const [voiceflowTranscriptId, setVoiceflowTranscriptId] = useState<string | null>(null); // Added for transcript ID

  // ---- START: New state and constants for initial animation ----
  const ANIMATION_HEADER = "Unlock New Channels With AI Marketing Solutions";
  const ANIMATION_DESCRIPTION = "Boost your growth while you sleep. Our AI-powered platform helps founders and marketing managers automate campaigns across channels.";
  const [dynamicAnimatedMessages, setDynamicAnimatedMessages] = useState<string[]>([]);
  const [isHeaderTitleAnimationComplete, setIsHeaderTitleAnimationComplete] = useState(false);

  const [animationCycleIndex, setAnimationCycleIndex] = useState(-1); // -1 for header/desc, 0+ for dynamicAnimatedMessages
  const [currentAnimatedTextContent, setCurrentAnimatedTextContent] = useState<{ title?: string; description?: string; isDescriptionStage?: boolean }>({}); // Only text parts for animation
  const [currentAnimatedChoices, setCurrentAnimatedChoices] = useState<ChatMessage['choices'] | undefined>(undefined);
  const [showAnimatedButtonsState, setShowAnimatedButtonsState] = useState(false);
  const [isInitialAnimationRunning, setIsInitialAnimationRunning] = useState(true);
  const [initialVoiceflowPayloadForAnimation, setInitialVoiceflowPayloadForAnimation] = useState<ChatMessage | null>(null);
  const [interimAnimationTextParts, setInterimAnimationTextParts] = useState<string[]>([]); // New state
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textAnimationCompleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  // ---- END: New state and constants for initial animation ----

  const projectID = process.env.NEXT_PUBLIC_VOICEFLOW_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_VOICEFLOW_API_KEY;
  const versionID = process.env.NEXT_PUBLIC_VOICEFLOW_VERSION_ID; // Added for transcripts

  const interactingTitle = 'Ask me anything...' 
  const LAUNCH_ACTION = { type: 'launch' };

  // Declare lastMessage *before* useEffect that uses it
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const logoWidthPlusGap = '[calc(2rem+0.75rem)]';
  const smallScreenMargin = 'ml-4';
  const largeScreenMarginClass = `sm:ml-${logoWidthPlusGap}`;

  // Helper function to get OS, Browser, Device from User Agent
  const getUserAgentDetails = () => {
    if (typeof window === 'undefined') {
      return { os: 'unknown', browser: 'unknown', device: 'unknown' };
    }
    const ua = navigator.userAgent;
    let os = 'unknown', browser = 'unknown', device = 'desktop';

    // OS Detection
    if (/Windows/i.test(ua)) os = 'windows';
    else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macos';
    else if (/Linux/i.test(ua)) os = 'linux';
    else if (/Android/i.test(ua)) { os = 'android'; device = 'mobile'; }
    else if (/iPhone|iPad|iPod/i.test(ua)) { os = 'ios'; device = ua.includes('iPad') ? 'tablet' : 'mobile';}

    // Browser Detection
    if (/Edg/i.test(ua)) browser = 'edge'; // Edge before Chrome
    else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) browser = 'chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'safari'; // Safari after Chrome
    else if (/Firefox/i.test(ua)) browser = 'firefox';
    else if (/MSIE|Trident/i.test(ua)) browser = 'ie';
    
    // More specific device detection if not already mobile/tablet from OS
    if (device === 'desktop' && /Mobile|Tablet|iPad|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      device = /Tablet|iPad/i.test(ua) ? 'tablet' : 'mobile';
    }
    
    return { os, browser, device };
  };

  const createVoiceflowTranscript = async (details?: { notes?: string; tags?: string[] }) => {
    if (!projectID || !apiKey || !versionID || !currentUserID) {
      if (!versionID) console.error("Voiceflow Version ID is not configured for transcripts.");
      if (!projectID) console.error("Voiceflow Project ID is not configured.");
      if (!apiKey) console.error("Voiceflow API Key is not configured.");
      if (!currentUserID) console.error("User ID is not available for transcript.");
      return;
    }

    // If details are provided (indicating an update) but no transcript has been created yet,
    // it's likely an out-of-order call or an attempt to update a non-existent transcript.
    // We should probably only attempt to create it. If it's an update call, voiceflowTranscriptId should exist.
    if (details && !voiceflowTranscriptId) {
      console.warn("Attempting to update transcript with details, but no transcriptId exists. This call will be ignored for update details, proceeding with creation if applicable.");
      // Fall through to create without details if this is the initial creation path.
      // If this function is *only* called for updates when details are present, this warning is key.
      // For now, let's assume if details are present, it's an "enhance" operation on an existing transcript.
      // The logic below will simply add notes/tags to the body, and the PUT should handle upsert.
    }

    const { os, browser, device } = getUserAgentDetails();
    const body: any = {
      projectID,
      sessionID: currentUserID,
      os,
      browser,
      device,
      versionID: versionID, 
    };

    if (details?.notes) {
      body.notes = details.notes;
    }
    if (details?.tags && details.tags.length > 0) {
      body.reportTags = details.tags;
    }

    try {
      const response = await fetch('https://api.voiceflow.com/v2/transcripts', {
        method: 'PUT',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
          'versionID': versionID,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        if (!voiceflowTranscriptId && result._id) { // First time creation
          setVoiceflowTranscriptId(result._id);
          console.log('Voiceflow transcript created:', result._id);
        } else if (voiceflowTranscriptId && result._id === voiceflowTranscriptId) { // Subsequent call, an update
          console.log('Voiceflow transcript updated with details:', result._id, details);
        } else if (result._id) { // Response gave an ID, but local state might be out of sync
          setVoiceflowTranscriptId(result._id); // Align local state
          console.log('Voiceflow transcript operation successful (created/updated):', result._id, details);
        }
      } else {
        const errorData = await response.text();
        console.error('Failed to create/update Voiceflow transcript:', response.status, errorData, body);
      }
    } catch (error) {
      console.error('Error calling Voiceflow transcript API:', error);
    }
  };

  // --- START: New functions for transcript processing at conversation end ---

  async function fetchTranscriptCSV(pID: string, tID: string): Promise<string | null> {
    if (!pID || !tID || !apiKey) {
      console.error("Missing projectID, transcriptID, or apiKey for fetching CSV.");
      return null;
    }
    const url = `https://api.voiceflow.com/v2/transcripts/${pID}/${tID}/export?format=csv`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': apiKey! }
      });
      if (!response.ok) {
        console.error(`Failed to fetch transcript CSV: ${response.status} ${await response.text()}`);
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching transcript CSV:', error);
      return null;
    }
  }

  function analyzeTranscriptData(csvText: string): { notes?: string; tags?: string[] } {
    const reportTags = new Set<string>();
    let userName: string | null = null;
    const lines = csvText.split('\\n');
    
    const bulletPoints: string[] = [];
    const uniqueUserQuestions = new Set<string>();
    const uniqueMatchedIntents = new Set<string>();

    if (lines.length <= 1) return {}; // Empty or only header

    const headerLine = lines[0].trim();
    // Robust header parsing: handle potential spaces and case variations
    const header = headerLine.split(',').map(h => h.trim().toLowerCase()); 

    const userInputIndex = header.indexOf('user_input');
    const intentMatchedIndex = header.indexOf('intent_matched');
    // const aiResponseIndex = header.indexOf('response'); // Or 'speak' or similar, might need to check Voiceflow CSV format

    if (userInputIndex === -1) {
      console.warn("CSV header missing 'user_input'. Analysis for user name and questions might be incomplete.");
    }
    if (intentMatchedIndex === -1) {
      console.warn("CSV header missing 'intent_matched'. Tag generation might be incomplete.");
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue; // Skip empty lines

      // Basic CSV split - WARNING: This is naive and will break if fields contain commas.
      const columns = line.split(','); 

      if (intentMatchedIndex !== -1 && columns.length > intentMatchedIndex && columns[intentMatchedIndex]) {
        const intent = columns[intentMatchedIndex].trim();
        if (intent) {
            reportTags.add(intent); // Add all intents to general tags
            uniqueMatchedIntents.add(intent); // For specific note points
        }
      }

      if (userInputIndex !== -1 && columns.length > userInputIndex && columns[userInputIndex]) {
        const rawUserInput = columns[userInputIndex].trim();
        if (rawUserInput) {
          // Name extraction (keeping existing logic)
          if (!userName) { // Only attempt to find name if not already found
            const nameMatch = rawUserInput.toLowerCase().match(/my name is ([a-zA-Z\s]+)/i) ||
                              rawUserInput.toLowerCase().match(/i'm ([a-zA-Z\s]+)/i) ||
                              rawUserInput.toLowerCase().match(/i am ([a-zA-Z\s]+)/i);
            if (nameMatch && nameMatch[1]) {
              const potentialName = nameMatch[1].trim();
              userName = potentialName.split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                    .join(' ');
            }
          }
          // Question extraction
          if (rawUserInput.endsWith('?')) {
            uniqueUserQuestions.add(rawUserInput.substring(0, 100) + (rawUserInput.length > 100 ? '...' : '')); // Truncate long questions
          }
        }
      }
    }

    // Constructing notes with bullet points
    if (userName) {
      bulletPoints.push(`* User identified as: ${userName}.`);
      reportTags.add(`userName:${userName.replace(/\s+/g, '')}`); // Add as a tag friendly name
    }

    if (uniqueMatchedIntents.size > 0) {
        bulletPoints.push(`* Key intents matched: ${Array.from(uniqueMatchedIntents).slice(0, 3).join(', ')}` + (uniqueMatchedIntents.size > 3 ? '...' : '.'));
    }

    if (uniqueUserQuestions.size > 0) {
      bulletPoints.push('* Notable user questions:');
      Array.from(uniqueUserQuestions).slice(0, 3).forEach(q => { // Max 3 questions in notes
        bulletPoints.push(`  - "${q}"`);
      });
    }
    
    const notesContent = bulletPoints.join('\n');

    const finalTags = Array.from(reportTags).filter(tag => tag && tag.length > 0);
    return {
      notes: notesContent.trim() || undefined,
      tags: finalTags.length > 0 ? finalTags : undefined,
    };
  }

  async function processAndEnrichTranscript() {
    if (!projectID || !voiceflowTranscriptId || !currentUserID || !versionID) {
      console.log("Cannot process and enrich transcript: Missing necessary IDs.", { projectID, voiceflowTranscriptId, currentUserID, versionID });
      return;
    }
    console.log("Processing and enriching transcript:", voiceflowTranscriptId);

    const csvData = await fetchTranscriptCSV(projectID, voiceflowTranscriptId);
    if (!csvData) {
      console.log("Failed to fetch CSV data for transcript enrichment.");
      return;
    }

    const analysis = analyzeTranscriptData(csvData);
    console.log("Transcript analysis result:", analysis);

    if ((analysis.notes && analysis.notes.length > 0) || (analysis.tags && analysis.tags.length > 0)) {
      // Call the enhanced createVoiceflowTranscript to update with new details
      // It uses projectID, apiKey, versionID, currentUserID from the component's closure scope.
      await createVoiceflowTranscript(analysis);
    } else {
      console.log("No new notes or tags derived from transcript analysis.");
    }
  }

  // --- END: New functions for transcript processing at conversation end ---

  const handleTraceEvent = (trace: any) => {
    switch (trace.type) {
      case 'text':
        console.log('trace.payload', trace.payload);
      case 'speak':
        setMessages((prev) => [...prev, { type: 'ai', text: trace.payload.message }])
        break
      case 'choice': 
        console.log('trace.payload', trace.payload);
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
      case 'end': 
        setIsThinking(false); 
        if (voiceflowTranscriptId) { // Ensure transcript was created before trying to enrich
          processAndEnrichTranscript();
        }
        break;
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
    if (!hasInteracted && !isInitialAnimationRunning) {
      sendInteraction(LAUNCH_ACTION);
      setHasInteracted(true);
    }
    return () => { if (eventSourceRef.current) eventSourceRef.current.close(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInteracted, isInitialAnimationRunning]);

  const handleSendMessage = async (messageText?: string, customPayload?: any) => {
    const textToSend = messageText || inputValue;
    const interactionAction = customPayload ? customPayload : { type: 'text', payload: textToSend };
    if (isInitialAnimationRunning) {
      stopInitialAnimationAndTransition();
    }
    if (!customPayload && textToSend.trim()) {
      setMessages((prev) => [...prev, { type: 'user', text: textToSend }])
    }
    // Create transcript on first actual send action if not already created
    if (!voiceflowTranscriptId) {
      createVoiceflowTranscript();
    }
    await sendInteraction(interactionAction);
    if (!customPayload) setInputValue('');
  }

  const handleChoiceClick = (choicePayload: any) => {
    // Create transcript on first actual choice action if not already created
    if (!voiceflowTranscriptId) {
      createVoiceflowTranscript();
    }
    sendInteraction(choicePayload.request);
  }

  const handleCarouselButtonClick = (buttonPayload: any) => {
    if (buttonPayload) {
        // Create transcript on first actual carousel button action if not already created
        if (!voiceflowTranscriptId) {
          createVoiceflowTranscript();
        }
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

  // Debounce utility
  const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeout: NodeJS.Timeout | null = null;

    const debounced = (...args: Parameters<F>) => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
  };

  const handleScroll = useCallback(() => {
    if (!carouselContainerRef.current || !lastMessage?.carousel || lastMessage.carousel.length === 0) {
      return;
    }

    const container = carouselContainerRef.current;
    const containerScrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const containerCenter = containerScrollLeft + containerWidth / 2;

    let closestCardIndex = 0;
    let smallestDistance = Infinity;

    lastMessage.carousel.forEach((_, index) => {
      const cardElement = document.getElementById(`carousel-card-${index}`);
      if (cardElement) {
        const cardOffsetLeft = cardElement.parentElement?.offsetLeft || 0; // Offset of the wrapper
        const cardWidth = cardElement.offsetWidth;
        const cardCenter = cardOffsetLeft + cardWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestCardIndex = index;
        }
      }
    });

    if (closestCardIndex !== activeIndex) {
      setActiveIndex(closestCardIndex);
    }
  }, [lastMessage?.carousel, activeIndex]);

  const debouncedScrollHandler = useCallback(debounce(handleScroll, 150), [handleScroll]);

  useEffect(() => {
    const container = carouselContainerRef.current;
    if (container && lastMessage?.carousel) {
      container.addEventListener('scroll', debouncedScrollHandler);
      return () => {
        container.removeEventListener('scroll', debouncedScrollHandler);
      };
    }
  }, [lastMessage?.carousel, debouncedScrollHandler]);

  const getAiMessageStyles = (text: string | undefined) => {
    if (!text) return { size: 'text-2xl sm:text-3xl md:text-5xl', weight: 'font-semibold' }; // Default if text is undefined
    const length = text.length;
    if (length < 50) {
      return { size: 'text-2xl sm:text-3xl md:text-5xl', weight: 'font-semibold' };
    } else if (length < 150) {
      return { size: 'text-xl sm:text-2xl md:text-3xl', weight: 'font-medium' };
    } else {
      return { size: 'text-lg sm:text-xl md:text-xl', weight: 'font-normal' };
    }
  };

  // Updated Thinking Indicator
  const thinkingIndicator = (
    <div className="flex items-center mb-4 pl-4"> 
      <Image src="https://yrasqdvnkyxnhjxftjak.supabase.co/storage/v1/object/public/automationdfy-assets//logo.png" alt="Brand Logo" width={28} height={28} className="mr-3 h-7 w-7" />
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

  // ---- START: New functions and useEffects for initial animation ----
  const stopInitialAnimationAndTransition = useCallback((showLastFullMessage = false) => {
    if (isInitialAnimationRunning) {
      setIsInitialAnimationRunning(false);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      if (textAnimationCompleteTimerRef.current) clearTimeout(textAnimationCompleteTimerRef.current);
      
      setShowAnimatedButtonsState(false);
      
      if (showLastFullMessage && initialVoiceflowPayloadForAnimation) {
        setMessages([initialVoiceflowPayloadForAnimation]);
      } else if (!initialVoiceflowPayloadForAnimation && !hasInteracted) {
        setMessages([]);
        sendInteraction(LAUNCH_ACTION);
      }
      setHasInteracted(true); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialAnimationRunning, initialVoiceflowPayloadForAnimation, hasInteracted]);


  useEffect(() => {
    const fetchInitialPayloadForAnimation = async () => {
      console.log('[Chatbot] fetchInitialPayloadForAnimation: Called', { projectID, apiKey, initialVoiceflowPayloadForAnimation, isInitialAnimationRunning, hasInteracted });
      if (!projectID || !apiKey || initialVoiceflowPayloadForAnimation || !isInitialAnimationRunning || hasInteracted) {
        console.log('[Chatbot] fetchInitialPayloadForAnimation: Bailing out due to conditions');
        return;
      }
      console.log('[Chatbot] fetchInitialPayloadForAnimation: Calling sendInteraction(LAUNCH_ACTION)');
      sendInteraction(LAUNCH_ACTION);
      console.log('[Chatbot] fetchInitialPayloadForAnimation: After sendInteraction(LAUNCH_ACTION)');
      setHasInteracted(true); 
    };

    if (isInitialAnimationRunning && !initialVoiceflowPayloadForAnimation && !hasInteracted) {
      fetchInitialPayloadForAnimation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialAnimationRunning, initialVoiceflowPayloadForAnimation, projectID, apiKey, hasInteracted]);


  useEffect(() => {
    console.log('[Chatbot] Message Processing useEffect: Ran', { messagesLength: messages.length, isInitialAnimationRunning, initialVoiceflowPayloadForAnimation: initialVoiceflowPayloadForAnimation !== null, interimAnimationTextPartsLength: interimAnimationTextParts.length });
    if (!isInitialAnimationRunning || initialVoiceflowPayloadForAnimation) { // Guard 1
      console.log('[Chatbot] Message Processing useEffect: Bailing (Guard 1)');
      return;
    }

    // This effect now processes messages to build the initial animation payload, waiting for choices.
    if (messages.length > 0) {
      if (initialVoiceflowPayloadForAnimation) { // Guard 2 - belt and suspenders
          console.log('[Chatbot] Message Processing useEffect: Bailing (Guard 2)');
          return;
      }

      const newCollectedTextParts = [...interimAnimationTextParts]; // Use a new variable for modification
      let foundChoicesPayload: ChatMessage['choices'] | undefined = undefined;
      let hasNewText = false; // Flag to track if new text was actually added
  
      for (const msg of messages) {
          if (msg.type === 'ai') {
              // Add text if it's new
              if (msg.text && !newCollectedTextParts.some(part => part.includes(msg.text!))) {
                  newCollectedTextParts.push(msg.text);
                  hasNewText = true;
              }
              if (msg.choices && msg.choices.length > 0) {
                  foundChoicesPayload = msg.choices;
                  // Once choices are found, we consider this the end of the initial payload gathering for animation
                  break; 
              }
          }
      }
      
      // Update interim text parts only if they have actually changed
      // This check helps prevent loops if messages are processed but don't add new unique text to interim parts.
      if (hasNewText || (interimAnimationTextParts.length === 0 && newCollectedTextParts.length > 0 && messages.length > 0)) {
        console.log('[Chatbot] Message Processing useEffect: Setting interimAnimationTextParts', newCollectedTextParts);
        setInterimAnimationTextParts(newCollectedTextParts);
      } else {
        console.log('[Chatbot] Message Processing useEffect: No new text for interimAnimationTextParts, not setting.');
      }
  
      if (foundChoicesPayload) {
        const fullInitialText = newCollectedTextParts.join(' ');
        const newPayload = {
          type: 'ai' as const,
          text: fullInitialText,
          choices: foundChoicesPayload,
        };
        console.log('[Chatbot] Message Processing useEffect: Setting initialVoiceflowPayloadForAnimation', newPayload);
        setInitialVoiceflowPayloadForAnimation(newPayload);
        setCurrentAnimatedChoices(foundChoicesPayload);
  
        if (fullInitialText) {
          const sentences = fullInitialText.match(/[^.!?]+[.!?\r\n]+/g) || [fullInitialText];
          setDynamicAnimatedMessages(sentences.slice(0, 3).map(s => s.trim()).filter(s => s.length > 0));
        } else {
          setDynamicAnimatedMessages([]);
        }
        setInterimAnimationTextParts([]); // Clear interim storage
        setMessages([]); // Clear all Voiceflow messages from main display as animation will take over
      } else {
        // Still waiting for choices, or only text messages received so far.
        // We don't clear `messages` here yet, as they are the source for `interimAnimationTextParts`.
        // If LAUNCH_ACTION only sends text and never choices, animation might not start as intended
        // or will start with no buttons if eventually stopped.
      }
    }
  }, [messages, isInitialAnimationRunning, initialVoiceflowPayloadForAnimation, interimAnimationTextParts]);


  useEffect(() => {
    if (!isInitialAnimationRunning || !initialVoiceflowPayloadForAnimation) {
      return;
    }

    // Clear previous timeouts
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    if (textAnimationCompleteTimerRef.current) clearTimeout(textAnimationCompleteTimerRef.current);
    
    let textContentForAnimation: { title?: string; description?: string; isDescriptionStage?: boolean } = {};

    if (animationCycleIndex === -1) { // Header/Description stage
      if (!isHeaderTitleAnimationComplete) {
        // Stage 1.1: Animate Header Title
        textContentForAnimation = { title: ANIMATION_HEADER, isDescriptionStage: false };
        setCurrentAnimatedTextContent(textContentForAnimation);
        // onAnimationComplete for title will set isHeaderTitleAnimationComplete(true)
      } else {
        // Stage 1.2: Animate Description (after title is complete)
        // Header title remains visible, description animates below it.
        textContentForAnimation = { title: ANIMATION_HEADER, description: ANIMATION_DESCRIPTION, isDescriptionStage: true };
        setCurrentAnimatedTextContent(textContentForAnimation);
        // onAnimationComplete for description will trigger button display and then timeout to next cycle.
      }
    } else { // Dynamic messages stage
      // Header and Description should not be visible here.
      // isHeaderTitleAnimationComplete is reset when cycling back to header or moving to dynamic messages.
      if (dynamicAnimatedMessages.length > 0 && animationCycleIndex < dynamicAnimatedMessages.length) {
        const msgText = dynamicAnimatedMessages[animationCycleIndex];
        textContentForAnimation = { title: msgText };
        setCurrentAnimatedTextContent(textContentForAnimation);
      } else {
        // Loop back if no dynamic messages or index out of bounds.
        // This means we are trying to display a dynamic message but can't.
        // Reset to header animation.
        setCurrentAnimatedTextContent({}); // Clear text before looping
        setIsHeaderTitleAnimationComplete(false); 
        setAnimationCycleIndex(-1); 
        return; 
      }
    }
    return () => {
      // Cleanup timers
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      if (textAnimationCompleteTimerRef.current) clearTimeout(textAnimationCompleteTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationCycleIndex, isInitialAnimationRunning, initialVoiceflowPayloadForAnimation, dynamicAnimatedMessages.length, isHeaderTitleAnimationComplete]); // dynamicAnimatedMessages.length added

  const handleHeaderTitleAnimComplete = () => {
    if (animationCycleIndex === -1 && !isHeaderTitleAnimationComplete && isInitialAnimationRunning) {
      setIsHeaderTitleAnimationComplete(true); // Triggers description animation
    }
  };
  
  const handleDescriptionAnimComplete = () => {
    if (animationCycleIndex === -1 && isHeaderTitleAnimationComplete && isInitialAnimationRunning) {
      // Set this only once when first needed - not on every animation cycle
      if (!showAnimatedButtonsState) {
        setShowAnimatedButtonsState(true);
      }
      
      animationTimerRef.current = setTimeout(() => {
        setCurrentAnimatedTextContent({}); 
        setIsHeaderTitleAnimationComplete(false); 
        if (dynamicAnimatedMessages.length > 0) {
          setAnimationCycleIndex(0); 
        } else {
          setAnimationCycleIndex(-1); 
        }
      }, 2000); 
    }
  };

  const handleDynamicMessageAnimComplete = () => {
    if (animationCycleIndex !== -1 && isInitialAnimationRunning) {
      // Set this only once when first needed - not on every animation cycle
      if (!showAnimatedButtonsState) {
        setShowAnimatedButtonsState(true);
      }
      
      animationTimerRef.current = setTimeout(() => {
        if (animationCycleIndex < dynamicAnimatedMessages.length - 1) {
          setAnimationCycleIndex(prev => prev + 1); 
        } else {
          setCurrentAnimatedTextContent({}); 
          setIsHeaderTitleAnimationComplete(false); 
          setAnimationCycleIndex(-1); 
        }
      }, 1500); 
    }
  };


  // ---- END: New functions and useEffects for initial animation ----

  // Wrapper for choice click to also stop animation
  const handleAnimatedChoiceClick = (choicePayload: any) => {
    stopInitialAnimationAndTransition(); 
    // Create transcript on first actual animated choice action if not already created
    if (!voiceflowTranscriptId) {
      createVoiceflowTranscript();
    }
    if (choicePayload && choicePayload.request) {
        handleChoiceClick(choicePayload); // Pass the whole payload which contains .request
    } else if (choicePayload) { 
        sendInteraction(choicePayload); 
    }
  };

  console.log('[Chatbot] Render: States', { isInitialAnimationRunning, initialVoiceflowPayloadForAnimation: initialVoiceflowPayloadForAnimation !== null, isThinking, lastMessage: lastMessage !== null });

  return (
    <div 
      className="flex flex-col w-full space-y-4 min-h-[350px]"
      // onClick={isInitialAnimationRunning ? () => stopInitialAnimationAndTransition() : undefined}
      // onFocus within input is preferred for stopping via focus
    >
      {/* ===== 1. TOP AREA: Animated Text / Chat Messages / Thinking Indicator ===== */}
      <div className="flex-grow min-h-[100px]"> {/* Ensures this area takes up space and pushes bottom content down */}
        {isInitialAnimationRunning && initialVoiceflowPayloadForAnimation ? (
          <div className={`pt-4 pb-2 transition-opacity duration-300 ${smallScreenMargin} ${largeScreenMarginClass}`}>
            {/* Animated Header Title - Renders only if title is set and it's header stage part 1 */}
            {currentAnimatedTextContent.title && animationCycleIndex === -1 && !currentAnimatedTextContent.isDescriptionStage && (
              <TextGenerateEffect
                key={currentAnimatedTextContent.title + '-header-title'}
                words={currentAnimatedTextContent.title}
                className={`${getAiMessageStyles(currentAnimatedTextContent.title).size} ${getAiMessageStyles(currentAnimatedTextContent.title).weight} text-gray-800 dark:text-white whitespace-pre-wrap`}
                duration={0.5}
                staggerDuration={0.02}
                filter={false}
                as="div"
                onAnimationComplete={handleHeaderTitleAnimComplete}
              />
            )}
            {/* Animated Description - Renders only if description is set and it's header stage part 2 */}
            {currentAnimatedTextContent.description && animationCycleIndex === -1 && currentAnimatedTextContent.isDescriptionStage && (
              <>
                {/* Static Header Title (already animated and visible) */}
                <div className={`${getAiMessageStyles(ANIMATION_HEADER).size} ${getAiMessageStyles(ANIMATION_HEADER).weight} text-gray-800 dark:text-white whitespace-pre-wrap mb-2`}>
                  {ANIMATION_HEADER}
                </div>
                <TextGenerateEffect
                  key={currentAnimatedTextContent.description + '-header-desc'}
                  words={currentAnimatedTextContent.description}
                  className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                  duration={0.5}
                  staggerDuration={0.015}
                  filter={false}
                  as="div"
                  onAnimationComplete={handleDescriptionAnimComplete} 
                />
              </>
            )}
            {/* Animated Dynamic Message - Renders if title is set and it's dynamic message stage */}
            {currentAnimatedTextContent.title && animationCycleIndex !== -1 && (
               <TextGenerateEffect
                key={currentAnimatedTextContent.title + `-dynamic-msg-${animationCycleIndex}`}
                words={currentAnimatedTextContent.title}
                className={`${getAiMessageStyles(currentAnimatedTextContent.title).size} ${getAiMessageStyles(currentAnimatedTextContent.title).weight} text-gray-800 dark:text-white whitespace-pre-wrap`}
                duration={0.5}
                staggerDuration={0.02}
                filter={false}
                as="div"
                onAnimationComplete={handleDynamicMessageAnimComplete}
              />
            )}
          </div>
        ) : isThinking ? (
          thinkingIndicator
        ) : (
          // Normal Chat Message Display (User or AI)
          <>
            {lastMessage && lastMessage.type === 'user' && (
              <div className={`pt-4 pb-2 ${smallScreenMargin} ${largeScreenMarginClass}`}> 
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-sky-600">
                  You: {lastMessage.text}
                </h2>
              </div>
            )}
            {lastMessage && lastMessage.type === 'ai' && ( // Removed !isThinking here as parent checks isThinking
              <div className={`pt-4 pb-2 transition-opacity duration-300 ${inputValue.trim() ? 'opacity-50' : 'opacity-100'}`}> 
                {lastMessage.text && (
                  <div className={`flex-grow ${smallScreenMargin} ${largeScreenMarginClass}`}> 
                    {(() => {
                      const styles = getAiMessageStyles(lastMessage.text);
                      const combinedClassName = `${styles.size} ${styles.weight} text-gray-800 dark:text-white`;

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
                {/* AI Choices for normal chat - rendered below if not in animation */}
                {/* This will be handled by the unified button section below */}
              </div>
            )}
            {lastMessage && lastMessage.type === 'system' && ( // Removed !isThinking
                 <div className={`pt-4 pb-2 ${smallScreenMargin} ${largeScreenMarginClass}`}> 
                    <h2 className="text-md sm:text-lg italic text-red-600">
                        {lastMessage.text}
                    </h2>
                 </div>
            )}
          </>
        )}
      </div>

      {/* Unified Carousel Display Area: Positioned after main text, before fixed bottom elements */}
      { !isInitialAnimationRunning && !isThinking && lastMessage?.carousel && (
        <div className="relative py-6"> {/* Added py-6 for vertical spacing around carousel */}
            {/* Carousel Scroll Container */}
            <div 
              ref={carouselContainerRef} 
              className="mt-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar scroll-pl-2 sm:scroll-pl-4 md:scroll-pl-6 lg:scroll-pl-10 xl:scroll-pl-16"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Force hide scrollbar
            > 
              <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className="flex space-x-3 sm:space-x-4 md:space-x-6 px-2 sm:px-4 md:px-6 lg:px-10 xl:px-16"> 
                {lastMessage.carousel.map((card, index) => {
                  const isActive = index === activeIndex;
                  const buttonColClass = card.buttons.length === 1 ? 'grid-cols-1' : 
                                           card.buttons.length === 2 ? 'grid-cols-2' : 
                                           'grid-cols-3'; 
                  return (
                    // Wrapper Div for Card + Overlay
                    <div
                      key={`${card.id}-wrapper`}
                      className={`relative flex-shrink-0 w-[85vw] sm:w-64 md:w-72 pt-8 transition-all duration-300 ease-out transform ${ 
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
                        className="w-full h-auto aspect-[3/4] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl flex flex-col"
                      >
                        {card.imageUrl && (
                          <div className="relative w-full aspect-[16/10] flex-shrink-0 bg-gray-100">
                            <Image 
                              src={card.imageUrl} 
                              alt={card.title}
                              fill={true}
                              className="object-cover"
                              sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 288px"
                            />
                          </div>
                        )}
                        <div className="p-4 flex flex-col flex-grow"> 
                          <h4 className="font-semibold text-base text-gray-800 dark:text-white truncate mb-2">{card.title}</h4> 
                                                      <div className={`mt-auto grid ${buttonColClass} gap-2 pt-2 border-t border-gray-100 dark:border-gray-700`}> 
                            {card.buttons.map((button, i) => (
                              <button
                                key={i}
                                onClick={() => handleCarouselButtonClick(button.payload)} 
                                className="text-center px-2 py-1.5 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded transition-colors text-xs font-medium truncate"
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
              <div className="hidden sm:flex justify-center items-center space-x-2 pt-4 mt-2">
                {lastMessage.carousel.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => {
                      setActiveIndex(index);
                      scrollToCard(index);
                    }}
                    aria-label={`Go to card ${index + 1}`}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ease-out
                                      ${activeIndex === index ? 'bg-slate-700 scale-125' : 'bg-gray-300 hover:bg-gray-400'}
                                      focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 p-1 sm:p-0.5 box-content`}
                  />
                ))}
              </div>
            )}
            {/* Prev/Next Buttons */} 
            {activeIndex > 0 && (
              <button 
                onClick={handlePrevClick}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md ml-1 sm:ml-2"
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
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md mr-1 sm:mr-2"
                aria-label="Next Card"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
        </div>
      )}

      {/* ===== 2. BOTTOM AREA: Fixed Interactive Elements (Buttons, Input) ===== */}
      <div className="mt-auto pt-4"> {/* mt-auto pushes this block to the bottom, pt-4 for spacing */}
        <FixedBottomControls 
          isInitialAnimationRunning={isInitialAnimationRunning}
          showAnimatedButtonsState={showAnimatedButtonsState}
          choicesToDisplay={isInitialAnimationRunning ? currentAnimatedChoices : lastMessage?.choices}
          isThinking={isThinking} // Pass isThinking for normal chat mode button/input disabling
          inputValue={inputValue}
          onInputChange={setInputValue} // Direct state setter
          onSendMessage={handleSendMessage} // Pass the existing handler
          onChoiceClick={isInitialAnimationRunning ? handleAnimatedChoiceClick : handleChoiceClick} // Conditional handler
          onStopAnimationAndShowMessage={stopInitialAnimationAndTransition} // Pass the existing handler
          disableInteraction={(isInitialAnimationRunning && !initialVoiceflowPayloadForAnimation) || isThinking}
          smallScreenMargin={smallScreenMargin}
          largeScreenMarginClass={largeScreenMarginClass}
        />
      </div> 
    </div>
  )
} 