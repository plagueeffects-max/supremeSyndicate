'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatMessage } from '@/types/property';
import ProjectCard from '@/components/ProjectCard';
import PropertyDetailView from '@/components/PropertyDetailView';
import AIThinkingIndicator from '@/components/AIThinkingIndicator';
import ThemeToggle from '@/components/ThemeToggle';
import VisualGuide from './VisualGuide';
import Image from 'next/image';
import Toast from '@/components/Toast';
import { API_BASE } from '@/lib/env';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '@/components/Header';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import {
  MessageSquare, User, RotateCcw, AlertTriangle, Send, Mic, ExternalLink, Activity, Info, TrendingUp,
  Share2, Settings, Plus, Search, GitCompare, HelpCircle
} from 'lucide-react';

const SUGGESTION_CHIPS = [
  '3BHK in Sector 150 under 3 Cr — luxury',
  '2BHK in Sector 137 under 1.5 Cr — ready to move',
  '3BHK in Sector 78 under 2 Cr — central Noida',
  'Compare ATS Kingston Heath vs Godrej Palm Retreat',
];

interface DiscoveryContentProps {
  userId: string | null;
}

export default function DiscoveryContent({ userId }: DiscoveryContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);
  const [chatTurnCount, setChatTurnCount] = useState(0);
  const [hasShownLengthWarning, setHasShownLengthWarning] = useState(false);
  const [chatPhase, setChatPhase] = useState<'DISCOVERY' | 'ADVISOR'>('DISCOVERY');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resolvedFields, setResolvedFields] = useState<{
    property_type?: boolean;
    bhk?: boolean;
    budget?: boolean;
    purpose?: boolean;
    timeline?: boolean;
    status?: boolean;
  }>({});
  const [nextExpectedField, setNextExpectedField] = useState<'property_type' | 'bhk' | 'budget' | 'purpose' | 'timeline' | 'status' | undefined>(undefined);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isInputMinimized, setIsInputMinimized] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // ── Image carousel state for in-chat galleries ──
  const [carouselIndexes, setCarouselIndexes] = useState<Record<number, number>>({});

  // ── Mobile detection state ──
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // ── Voice input (Web Speech API) ──
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition once
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setChatInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setToast({ message: 'Microphone access denied. Please allow microphone in browser settings.' });
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setToast({ message: 'Voice input is not supported in this browser. Try Chrome or Edge.' });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setChatInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) scrollToBottom();
  }, [chatHistory.length, isSubmitting, scrollToBottom]);

  // ── Mobile keyboard handling via Visual Viewport API ──
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const vv = window.visualViewport;
    const onResize = () => {
      if (!vv) return;
      const isOpen = vv.height < window.innerHeight * 0.75;
      setKeyboardOpen(isOpen);
      setViewportHeight(`${vv.height}px`);
      
      if (isOpen) {
        setTimeout(scrollToBottom, 50);
      }
    };

    if (vv) {
      vv.addEventListener('resize', onResize);
      vv.addEventListener('scroll', onResize);
      return () => {
        vv.removeEventListener('resize', onResize);
        vv.removeEventListener('scroll', onResize);
      };
    }
  }, [scrollToBottom]);

  // Track scroll position to show/hide scroll-to-bottom button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollBtn(distanceFromBottom > 150);
      
      // Minimize input if scrolled up significantly (on mobile)
      if (window.innerWidth < 768) {
        if (distanceFromBottom > 200) {
          setIsInputMinimized(true);
        } else if (distanceFromBottom < 50) {
          setIsInputMinimized(false);
        }
      } else {
        // Desktop behavior - maybe just keep it visible or a less aggressive minimize
        setIsInputMinimized(false);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Ctrl+K keyboard shortcut to focus chat input ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        chatInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── "Ask AI" button on PropertyCard injects text via CustomEvent ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { text } = (e as CustomEvent<{ text: string }>).detail;
      setChatInput(text);
      setTimeout(() => chatInputRef.current?.focus(), 50);
    };
    window.addEventListener('realtypals:ask-ai', handler);
    return () => window.removeEventListener('realtypals:ask-ai', handler);
  }, []);

  const performReset = async () => {
    setChatHistory([]);
    setChatInput('');
    setShowRecommendations(false);
    setIsInitialized(false);
    setChatPhase('DISCOVERY');
    setChatTurnCount(0);
    setHasShownLengthWarning(false);
    setResolvedFields({});
    setNextExpectedField(undefined);
    setIsSubmitting(false);
    setCarouselIndexes({});
    if (userId) {
      try {
        const res = await fetch(`${API_BASE}/chat/intent`, {
          method: 'DELETE',
          headers: { 'X-User-Id': userId },
        });
        const data = await res.json();
        if (data.session_id) setSessionId(data.session_id);
      } catch (e) {
        console.error('Failed to reset intent:', e);
      }
    }
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'ai',
      content: "Hey, I am RealtyPal at your assistance, tell me how can I help you?",
      timestamp: new Date().toISOString(),
    };
    setChatHistory([welcomeMessage]);
    setIsInitialized(true);
  };

  // Handle ?new=1
  useEffect(() => {
    if (searchParams.get('new') !== '1' || !userId) return;
    (async () => {
      await performReset();
      router.replace('/discover');
    })();
  }, [searchParams, userId]);

  // Initialize: fetch session from server and restore history
  useEffect(() => {
    if (!userId || isInitialized || searchParams.get('new') === '1') return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/session`, {
          headers: { 'X-User-Id': userId },
        });
        if (!res.ok) throw new Error('session fetch failed');
        const data = await res.json();

        setSessionId(data.session_id);

        if (data.messages && data.messages.length > 0) {
          const restored: ChatMessage[] = data.messages.map((m: { id: string; role: string; content: string; created_at: string }) => ({
            id: m.id,
            type: m.role === 'user' ? 'user' : 'ai',
            content: m.content,
            timestamp: m.created_at,
          }));
          setChatHistory(restored);
        } else {
          setChatHistory([{
            id: crypto.randomUUID(),
            type: 'ai',
            content: "Hey, I am RealtyPal at your assistance, tell me how can I help you?",
            timestamp: new Date().toISOString(),
          }]);
        }
      } catch {
        setChatHistory([{
          id: crypto.randomUUID(),
          type: 'ai',
          content: "Hey, I am RealtyPal at your assistance, tell me how can I help you?",
          timestamp: new Date().toISOString(),
        }]);
      } finally {
        setIsInitialized(true);
      }
    })();
  }, [userId, isInitialized, searchParams]);

  // Pick up prefill query from compare page (sessionStorage)
  useEffect(() => {
    if (!isInitialized) return;
    const prefill = sessionStorage.getItem('rp_prefill_chat');
    if (prefill) {
      sessionStorage.removeItem('rp_prefill_chat');
      setTimeout(() => submitMessage(prefill), 200);
    }
  }, [isInitialized]);

  // Expose reset function for Sidebar "New Chat"
  useEffect(() => {
    (window as any).__resetDiscoveryChat = async () => {
      await performReset();
    };
    return () => {
      delete (window as any).__resetDiscoveryChat;
    };
  }, [userId]);

  const handleChatSubmit = async (e: React.FormEvent, textOverride?: string) => {
    e.preventDefault();
    const inputText = textOverride ?? chatInput;
    if (!inputText.trim() || !userId || isSubmitting || submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitting(true);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatTurnCount((count) => count + 1);
    const currentInput = inputText;
    setChatInput('');

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
        },
        body: JSON.stringify({ message: currentInput, session_id: sessionId }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get chat response';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (typeof data.message === 'string' && data.message.trim().length === 0) {
        if (data.next_expected_field !== undefined) {
          setNextExpectedField(data.next_expected_field);
        }
        return;
      }

      const safeMessage =
        typeof data.message === 'string' && data.message.trim().length > 0
          ? data.message
          : "I'll ask a few quick questions to narrow this down.";

      if (data.chatPhase) setChatPhase(data.chatPhase);
      if (data.session_id) setSessionId(data.session_id);
      if (data.next_expected_field !== undefined) setNextExpectedField(data.next_expected_field);
      if (data.resolvedFields) setResolvedFields(data.resolvedFields);

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: safeMessage,
        properties: data.showRecommendations ? (data.projects || []) : undefined,
        images: data.images || undefined,
        highlights: data.highlights || undefined,
        amenities: data.amenities || undefined,
        propertyDetail: data.propertyDetail || undefined,
        showSectorIntelligence: data.showSectorIntelligence || undefined,
        timestamp: new Date().toISOString(),
        intent: data.intent,
      };

      setChatHistory((prev) => {
        const nextHistory = [...prev, aiMessage];
        if (!hasShownLengthWarning && chatTurnCount + 1 >= 10) {
          nextHistory.push({
            id: crypto.randomUUID(),
            type: 'ai',
            content: "We've covered a lot. Starting a fresh chat may give clearer recommendations.",
            timestamp: new Date().toISOString(),
          });
          setHasShownLengthWarning(true);
        }
        return nextHistory;
      });

      setShowRecommendations(data.showRecommendations && !!data.projects);
    } catch (error: any) {
      console.error('Error in chat:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: `Sorry, I encountered an error. ${error.message ? `(${error.message})` : ''} Please try again.`,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  };

  // ── Regenerate: resend the last user message to get a fresh AI response ──
  const handleRegenerate = async (aiMsgIndex: number) => {
    if (!userId || isSubmitting || regeneratingIdx !== null) return;

    // Find the user message immediately before this AI message
    let userMsg = '';
    for (let i = aiMsgIndex - 1; i >= 0; i--) {
      if (chatHistory[i].type === 'user') {
        userMsg = chatHistory[i].content;
        break;
      }
    }
    if (!userMsg) return;

    setRegeneratingIdx(aiMsgIndex);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ message: userMsg, session_id: sessionId }),
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      const data = await response.json();
      const safeMessage = typeof data.message === 'string' && data.message.trim().length > 0
        ? data.message
        : 'Let me try that again...';

      if (data.chatPhase) setChatPhase(data.chatPhase);

      // Replace the AI message at this index
      setChatHistory(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          id: crypto.randomUUID(),
          type: 'ai',
          content: safeMessage,
          properties: data.showRecommendations ? (data.projects || []) : undefined,
          images: data.images || undefined,
          highlights: data.highlights || undefined,
          amenities: data.amenities || undefined,
          propertyDetail: data.propertyDetail || undefined,
          showSectorIntelligence: data.showSectorIntelligence || undefined,
          timestamp: new Date().toISOString(),
          intent: data.intent,
        };
        return updated;
      });
    } catch (error: any) {
      console.error('Regenerate error:', error);
      setToast({ message: 'Failed to regenerate. Please try again.' });
    } finally {
      setRegeneratingIdx(null);
    }
  };

  const handleQuickReply = async (field: 'property_type' | 'bhk' | 'budget' | 'purpose' | 'timeline' | 'status', value: string) => {
    if (!userId || isSubmitting) return;

    const previousNext = nextExpectedField;
    setResolvedFields(prev => ({ ...prev, [field]: true }));
    setNextExpectedField(undefined);
    setIsSubmitting(true);

    let message = '';
    switch (field) {
      case 'property_type': message = value; break;
      case 'bhk': message = `${parseInt(value)} BHK`; break;
      case 'budget': message = value; break;
      case 'purpose': message = value; break;
      case 'timeline': message = value; break;
      case 'status': message = value; break;
    }

    const userMessage: ChatMessage = { id: crypto.randomUUID(), type: 'user', content: message, timestamp: new Date().toISOString() };
    setChatHistory((prev) => [...prev, userMessage]);
    setChatTurnCount((count) => count + 1);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ message, session_id: sessionId }),
      });

      if (!response.ok) throw new Error('Failed to get chat response');

      const data = await response.json();

      if (typeof data.message === 'string' && data.message.trim().length === 0) {
        if (data.next_expected_field !== undefined) setNextExpectedField(data.next_expected_field);
        return;
      }

      const safeMessage =
        typeof data.message === 'string' && data.message.trim().length > 0
          ? data.message
          : "I'll ask a few quick questions to narrow this down.";

      if (data.chatPhase) setChatPhase(data.chatPhase);
      if (data.session_id) setSessionId(data.session_id);
      if (data.next_expected_field !== undefined) setNextExpectedField(data.next_expected_field);
      if (data.resolvedFields) setResolvedFields(data.resolvedFields);

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: safeMessage,
        properties: data.showRecommendations ? (data.projects || []) : undefined,
        images: data.images || undefined,
        highlights: data.highlights || undefined,
        amenities: data.amenities || undefined,
        propertyDetail: data.propertyDetail || undefined,
        showSectorIntelligence: data.showSectorIntelligence || undefined,
        timestamp: new Date().toISOString(),
        intent: data.intent,
      };
      setChatHistory((prev) => [...prev, aiMessage]);

      setShowRecommendations(data.showRecommendations && !!data.projects);
    } catch (error: any) {
      console.error('Error in quick reply:', error);
      setResolvedFields(prev => { const next = { ...prev }; delete next[field]; return next; });
      setNextExpectedField(previousNext);
      setChatHistory((prev) => [...prev, {
        id: crypto.randomUUID(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your selection. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUserReplied = chatHistory.some((m) => m.type === 'user');

  // ── Submit a message programmatically (used by suggestion chips and advisor chips) ──
  const submitMessage = useCallback((text: string) => {
    handleChatSubmit({ preventDefault: () => {} } as React.FormEvent, text);
  }, [handleChatSubmit]);

  // ── Carousel navigation helper ──
  const setCarouselIndex = (msgIndex: number, imgIndex: number) => {
    setCarouselIndexes(prev => ({ ...prev, [msgIndex]: imgIndex }));
  };

  // ── Render a single chat message ──
  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.type === 'user';

    return (
      <div key={message.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-message-in`}>
        <div className={`flex w-full ${isUser ? 'items-end gap-4 flex-row-reverse' : 'items-start gap-4'}`}>
          {/* Avatar */}
          {isUser ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <User size={20} className="text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full glass-surface flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border border-white/50 dark:border-white/10">
              <Image
                src="/images/logo/realtypals.png"
                alt="RP"
                width={36}
                height={36}
              />
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`rounded-[20px] px-5 py-3.5 shadow-sm transition-all duration-300 ${isUser
              ? 'max-w-[78%] bg-[#0064E5] text-white shadow-blue-500/10'
              : 'flex-1 min-w-0 glass-surface text-gray-900 dark:text-gray-100 border border-white/40 dark:border-white/5 relative overflow-hidden shadow-lg'
              }`}
          >
            {/* Added a subtle glow to AI bubbles */}
            {!isUser && <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none"></div>}

            {!isUser ? (
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-blue-700 dark:prose-headings:text-blue-400 prose-a:text-blue-500 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 relative z-10 prose-table:w-full prose-table:text-sm prose-table:my-4 prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-blue-900/40 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-gray-800 dark:prose-th:text-blue-200 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-[16px] font-medium leading-relaxed relative z-10">{message.content}</p>
            )}
          </div>
        </div>

        {/* ── Regenerate button (only on AI messages in ADVISOR mode) ── */}
        {!isUser && chatPhase === 'ADVISOR' && index > 0 && !message.properties?.length && (
          <button
            onClick={() => handleRegenerate(index)}
            disabled={regeneratingIdx === index || isSubmitting}
            className="ml-[56px] mt-1 inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-white/50 dark:hover:bg-gray-800 disabled:opacity-40 touch-target-min"
            title="Regenerate response"
          >
            <RotateCcw size={11} className={regeneratingIdx === index ? 'animate-spin' : ''} />
            {regeneratingIdx === index ? 'Regenerating...' : 'Regenerate'}
          </button>
        )}

        {/* ── Rich Property Detail View (3-panel: amenities + floor plan + specs) ── */}
        {message.propertyDetail && (
          <PropertyDetailView
            propertyDetail={message.propertyDetail}
            onToast={(msg) => setToast({ message: msg })}
          />
        )}

        {/* ── In-chat image gallery (standalone floor plan / interior / images) ── */}
        {!message.propertyDetail && message.images && message.images.length > 0 && (
          <div className="mt-3 ml-12 w-full max-w-[80%]">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
              {/* Image type badge */}
              {message.images[carouselIndexes[index] || 0]?.type && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium capitalize">
                    {(message.images[carouselIndexes[index] || 0].type || '').replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              <Image
                src={message.images[carouselIndexes[index] || 0]?.url || message.images[0].url}
                alt={message.images[carouselIndexes[index] || 0]?.caption || 'Property image'}
                width={680}
                height={400}
                className="w-full h-72 object-cover"
                unoptimized
              />
              {/* Carousel dots */}
              {message.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {message.images.map((_, imgIdx) => (
                    <button
                      key={imgIdx}
                      onClick={() => setCarouselIndex(index, imgIdx)}
                      className={`carousel-dot ${(carouselIndexes[index] || 0) === imgIdx ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
              {/* Caption */}
              {message.images[carouselIndexes[index] || 0]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-2">
                  <p className="text-white text-xs">{message.images[carouselIndexes[index] || 0].caption}</p>
                </div>
              )}
            </div>
            {/* Image count indicator */}
            {message.images.length > 1 && (
              <p className="text-xs text-gray-400 mt-1.5 text-center">{carouselIndexes[index] ? carouselIndexes[index] + 1 : 1} / {message.images.length}</p>
            )}
          </div>
        )}

        {/* ── Highlights bullets (standalone when no propertyDetail) ── */}
        {!message.propertyDetail && message.highlights && message.highlights.length > 0 && (
          <div className="mt-3 ml-12 max-w-[80%] bg-[#F7F7F7] dark:bg-gray-800 border border-[#E8E8E8] dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Highlights</p>
            <ul className="space-y-2">
              {message.highlights.map((h, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Amenities Cards (standalone when no propertyDetail) ── */}
        {!message.propertyDetail && message.amenities && message.amenities.length > 0 && (
          <div className="mt-4 ml-12 sm:ml-14 w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {message.amenities.map((amenity, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-center text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                  <span className="text-[12px] sm:text-[13px] font-semibold text-blue-800 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Property cards grid ── */}
        {(() => {
          const isGeneralOrComparison =
            message.content.includes('| Property |') ||
            message.content.includes('| ---') ||
            message.intent?.is_general_query === true;
          if (!message.properties || message.properties.length === 0 || isGeneralOrComparison) return null;
          return (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl overflow-hidden">
              {message.properties.map((property) => (
                <div key={property.id}>
                  <ProjectCard project={property} userId={userId} />
                </div>
              ))}
            </div>
          );
        })()}

      </div>
    );
  };

  // ── Chat input form ──
  const chatInputForm = (
    <div className="w-full">
      <div className="relative flex items-center gap-2">
        {/* Reset / New Chat Button */}
        <div id="new-chat-guide">
          <button
            onClick={performReset}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 group flex items-center justify-center"
            title="Reset conversation"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div id="chat-input-guide" className="relative flex-1 group">
          <PlaceholdersAndVanishInput
            placeholders={
              chatPhase === 'ADVISOR'
                ? ['Ask anything about these properties...', 'Any risks associated?', 'Compare prices...']
                : ["Tell me what you're looking for...", "Find me a 3 BHK in Sector 150...", "Show me properties under 2 Crores..."]
            }
            onChange={(e) => setChatInput(e.target.value)}
            onSubmit={handleChatSubmit}
            value={chatInput}
          />
        </div>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 touch-target-min ${isListening
            ? 'text-red-500 animate-pulse scale-105 bg-red-100 dark:bg-red-900/40'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          title="Voice Input"
        >
          {isListening ? (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 -m-1 rounded-full bg-red-100 dark:bg-red-900/30 animate-ping opacity-50" />
              <Mic size={18} className="relative text-red-500 fill-current" />
            </div>
          ) : (
            <Mic size={18} className="text-gray-500 dark:text-gray-400" />
          )}
        </button>
        
        {/* Help / Guide Button */}
        <div id="help-guide">
          <VisualGuide />
        </div>
      </div>
      {isListening && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs text-red-500 font-medium">Listening... Speak now</span>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2 text-center">
        AI can make mistakes. Verify Critical property details.
      </p>
    </div>
  );

  return (
    <div
      className="flex-1 flex flex-col min-h-0 bg-transparent dark:bg-gray-900 overflow-hidden"
      style={isMobile ? { height: viewportHeight } : undefined}
    >
      <Header title="RealtyPal Intelligence Engine™" onToast={(msg: string) => setToast({ message: msg })} />

      {/* Main: centered input when no chat, scrollable messages + bottom input when chat started */}
      <div className={`flex-1 flex flex-col min-h-0 overflow-hidden relative z-10 ${!hasUserReplied ? 'justify-center' : ''}`}>

        {/* Animated Orbs Overlay Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob" />
          <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-[-10%] left-[40%] w-[400px] h-[400px] bg-teal-400/10 dark:bg-teal-600/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob" style={{ animationDelay: "4s" }} />
        </div>

        {!hasUserReplied ? (
          /* Welcome screen */
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
            <div className="text-center mb-10 max-w-lg">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl glass-surface border border-white/50 dark:border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
                <Image src="/images/logo/realtypals.png" alt="RealtyPal" width={44} height={44} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                Find your perfect property
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Ask me anything about real estate across India — or pick a suggestion to start.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full mb-10">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => submitMessage(chip)}
                  className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-200 dark:hover:border-violet-700 hover:text-violet-700 dark:hover:text-violet-400 transition-all text-left shadow-sm font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="w-full max-w-2xl">
              {chatInputForm}
            </div>
          </div>
        ) : (
          /* Feed layout */
          <>
            <div ref={chatContainerRef} className="flex-1 h-full min-h-0 overflow-y-auto px-4 md:px-8 pt-6 pb-36 relative z-10">
              <div className="max-w-4xl mx-auto space-y-6">
                {chatHistory.map((message, index) => renderMessage(message, index))}

                {isSubmitting && (
                  <AIThinkingIndicator
                    query={chatHistory.slice().reverse().find(m => m.type === 'user')?.content}
                  />
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Floating FAB for minimized mobile input */}
              <AnimatePresence>
                {isInputMinimized && !isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden"
                  >
                    <button
                      onClick={() => {
                        setIsInputMinimized(false);
                        scrollToBottom();
                        setTimeout(() => chatInputRef.current?.focus(), 300);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all font-semibold border border-blue-400"
                    >
                      <MessageSquare size={18} />
                      <span>Send Message</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {showScrollBtn && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-6 w-9 h-9 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-all z-10"
                  aria-label="Scroll to bottom"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              )}
            </div>

            {/* Frosted glass input bar — absolute so it sits flush at the container bottom */}
            <AnimatePresence initial={false}>
              {!isInputMinimized && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`absolute bottom-0 left-0 right-0 w-full z-10 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent pt-10 pb-4 ${keyboardOpen ? 'pb-safe' : ''}`}
                  style={keyboardOpen ? { paddingBottom: 'env(safe-area-inset-bottom, 8px)' } : undefined}
                >
                  <div className="px-4 md:px-8 max-w-4xl mx-auto flex flex-col justify-center w-full">
                    {chatInputForm}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}

    </div>
  );
}
