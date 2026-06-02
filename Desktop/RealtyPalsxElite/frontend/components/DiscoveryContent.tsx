'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatMessage } from '@/types/property';
import type { ProjectCard as ProjectCardType } from '@/types/project';
import ProjectCard from '@/components/ProjectCard';
import ProjectDetailPanel from '@/components/ProjectDetailPanel';
import PropertyDetailView from '@/components/PropertyDetailView';
import ChatLoader from '@/components/ChatLoader';
import ThemeToggle from '@/components/ThemeToggle';
import VisualGuide from './VisualGuide';
import Image from 'next/image';
import Toast from '@/components/Toast';
import { API_BASE } from '@/lib/env';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '@/components/Header';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import ComparisonTable from '@/components/ComparisonTable';
import SectorMap from '@/components/SectorMap';
import CalculatorPanel from '@/components/CalculatorPanel';
import SiteVisitScheduler from '@/components/SiteVisitScheduler';
import {
  MessageSquare, User, RotateCcw, AlertTriangle, Send, Mic, ExternalLink, Activity, Info, TrendingUp,
  Share2, Settings, Plus, Search, GitCompare, HelpCircle, ChevronDown, Copy, ThumbsUp, ThumbsDown,
} from 'lucide-react';

// ── Chip types ─────────────────────────────────────────────────────────────
type ChipPickerMode = 'single' | 'multi'

interface Chip {
  emoji: string
  label: string
  msg?: string          // direct message to send
  picker?: ChipPickerMode
  pickerAction?: string // key used to build the final message
  pickerModal?: boolean // true → picker opens a modal, not a chat message
  special?: string      // e.g. '__open_calculator__', '__share_shortlist__'
}

// ── Message builders for picker-backed chips ────────────────────────────────
function buildPickerMessage(action: string, selected: ProjectCardType[]): string {
  const names = selected.map(p => p.name)
  switch (action) {
    case 'emi':
      return `What would be the monthly EMI for ${names[0]}? Show a breakdown at 8.5% for 20 years.`
    case 'stamp_duty':
      return `Calculate stamp duty and registration charges for ${names[0]}.`
    case 'gst':
      return `What is the GST applicable on ${names[0]}?`
    case 'compare':
      return names.length === 2
        ? `Compare ${names[0]} vs ${names[1]} in detail — price, amenities, builder, location, trade-offs.`
        : `Compare ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} in detail.`
    case 'builder':
      return `Tell me about ${selected[0].builder.name}'s delivery history, reputation, and any complaints.`
    case 'area':
      return `Give me a full area overview of ${selected[0].sector} — metro access, schools, hospitals, appreciation potential.`
    case 'risks':
      return `What are the main risks and concerns I should know about ${names[0]}?`
    default:
      return names[0]
  }
}

// ── Follow-up chip generator — contextual per phase ───────────────────────
function getFollowUpChips(
  phase: 'DISCOVERY' | 'ADVISOR',
  shortlist: ProjectCardType[],
  turnCount: number,
): Chip[] {
  if (phase === 'ADVISOR' && shortlist.length > 0) {
    return [
      { emoji: '📅', label: 'Book Site Visit',   picker: 'single', pickerAction: 'site_visit', pickerModal: true },
      { emoji: '📞', label: 'Get Callback',       picker: 'single', pickerAction: 'callback',   pickerModal: true },
      { emoji: '📊', label: 'Calculate EMI',      picker: 'single', pickerAction: 'emi' },
      { emoji: '🏷️', label: 'Stamp Duty',        picker: 'single', pickerAction: 'stamp_duty' },
      { emoji: '💸', label: 'GST',                picker: 'single', pickerAction: 'gst' },
      ...(shortlist.length >= 2 ? [{ emoji: '⚖️', label: 'Compare', picker: 'multi' as ChipPickerMode, pickerAction: 'compare' }] : []),
      { emoji: '🧮', label: 'Calculator',         special: '__open_calculator__' },
      { emoji: '📤', label: 'Share shortlist',    special: '__share_shortlist__' },
      { emoji: '🇮🇳', label: 'Hindi mein batao', msg: 'Please explain your last response in simple Hindi' },
      { emoji: '🏗️', label: 'Builder track record', picker: 'single', pickerAction: 'builder' },
      { emoji: '📍', label: 'Area overview',      picker: 'single', pickerAction: 'area' },
      { emoji: '⚠️', label: 'Risks & concerns',   picker: 'single', pickerAction: 'risks' },
      { emoji: '🔍', label: 'More options',       msg: 'Show me more properties similar to these in Noida' },
    ]
  }
  if (phase === 'DISCOVERY' && turnCount >= 2) {
    return [
      { emoji: '🏘️', label: 'Show properties',  msg: 'Show me available 3BHK properties in Noida Sector 150' },
      { emoji: '📊', label: 'EMI calculator',    msg: 'How do I calculate EMI for a 1.5 Cr flat?' },
      { emoji: '🏆', label: 'Best sectors',       msg: 'Which sectors in Noida have the best appreciation right now?' },
      { emoji: '📋', label: 'RERA explained',     msg: 'What is RERA and how does it protect home buyers?' },
    ]
  }
  return []
}

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
  const [detailProject, setDetailProject] = useState<ProjectCardType | null>(null);
  const [lastShortlist, setLastShortlist] = useState<ProjectCardType[]>([]);
  const [expandedShortlists, setExpandedShortlists] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [chipPicker, setChipPicker] = useState<{
    mode: ChipPickerMode
    action: string
    label: string
    isModal: boolean
    selected: string[] // project slugs
  } | null>(null);
  const [siteVisitProject, setSiteVisitProject] = useState<ProjectCardType | null>(null);
  const [callbackProject, setCallbackProject] = useState<ProjectCardType | null>(null);
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '' });
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);
  const [callbackDone, setCallbackDone] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
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
  const streamingMsgIdRef = useRef<string | null>(null);
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
        recognition.lang = 'hi-IN';  // Hindi India — handles Hindi + English

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleVoiceInput = async () => {
    // Primary: browser SpeechRecognition (real-time, best UX)
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setChatInput('');
        recognitionRef.current.start();
        setIsListening(true);
      }
      return;
    }

    // Fallback: MediaRecorder → Whisper (when SpeechRecognition unavailable)
    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob, 'recording.webm');
        try {
          const res = await fetch('/api/v1/transcribe', { method: 'POST', body: fd });
          const data = await res.json();
          if (data.text) setChatInput(data.text);
        } catch { /* silent */ }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch {
      setToast({ message: 'Microphone access denied. Please allow microphone in browser settings.' });
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
        const sessionFromUrl = searchParams.get('session')
        const sessionUrl = sessionFromUrl
          ? `${API_BASE}/chat/session?id=${sessionFromUrl}`
          : `${API_BASE}/chat/session`
        const res = await fetch(sessionUrl, {
          headers: { 'X-User-Id': userId },
        });
        if (!res.ok) throw new Error('session fetch failed');
        const data = await res.json();

        setSessionId(data.session_id);
        // Clean up ?session= from URL without triggering a navigation
        if (searchParams.get('session')) {
          router.replace('/discover', { scroll: false });
        }

        // Restore chat phase
        if (data.chat_phase === 'ADVISOR') {
          setChatPhase('ADVISOR');
        }

        // Restore last property shortlist (re-surfaces cards after page reload / session resume)
        if (Array.isArray(data.last_projects) && data.last_projects.length > 0) {
          setLastShortlist(data.last_projects);
          setShowRecommendations(true);
        }

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

  const streamChat = useCallback(async (userText: string): Promise<void> => {
    if (!userId || isSubmitting || submitLockRef.current) return;
    submitLockRef.current = true;
    setIsSubmitting(true);
    setChipPicker(null); // close any open picker

    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, userMsg]);
    setChatTurnCount(c => c + 1);
    setChatInput('');

    // Add streaming placeholder AI message
    const streamId = crypto.randomUUID();
    streamingMsgIdRef.current = streamId;
    setChatHistory(prev => [...prev, {
      id: streamId,
      type: 'ai',
      content: '',
      isSearching: false,
      userQuery: userText,
      timestamp: new Date().toISOString(),
    }]);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
        body: JSON.stringify({ message: userText, session_id: sessionId }),
      });

      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let payload: any;
          try { payload = JSON.parse(line.slice(6)); } catch { continue; }

          if (payload.type === 'text') {
            setChatHistory(prev => prev.map(m =>
              m.id === streamId
                ? { ...m, content: m.content + payload.delta, isSearching: false }
                : m
            ));
          } else if (payload.type === 'searching') {
            setChatHistory(prev => prev.map(m =>
              m.id === streamId ? { ...m, isSearching: true, content: '' } : m
            ));
          } else if (payload.type === 'error') {
            setChatHistory(prev => prev.map(m =>
              m.id === streamId
                ? { ...m, content: payload.message || 'Something went wrong. Please try again.', isSearching: false }
                : m
            ));
          } else if (payload.type === 'done') {
            const d = payload.data;
            if (d.session_id) setSessionId(d.session_id);
            if (d.chatPhase) setChatPhase(d.chatPhase);
            const hasProjects = d.showRecommendations && d.projects?.length > 0;
            setChatHistory(prev => prev.map(m =>
              m.id === streamId
                ? {
                    ...m,
                    isSearching: false,
                    properties: hasProjects ? d.projects : undefined,
                    showComparisonTable: (
                      userText.toLowerCase().includes('compare') && lastShortlist.length >= 2
                    ),
                  }
                : m
            ));
            if (hasProjects) setLastShortlist(d.projects);
            setShowRecommendations(hasProjects);
            setExpandedShortlists(new Set());
          }
        }
      }

      // Length warning
      setChatHistory(prev => {
        if (!hasShownLengthWarning && chatTurnCount + 1 >= 12) {
          setHasShownLengthWarning(true);
          return [...prev, {
            id: crypto.randomUUID(),
            type: 'ai',
            content: "We've covered a lot of ground. Starting a new chat may give you sharper recommendations.",
            timestamp: new Date().toISOString(),
          }];
        }
        return prev;
      });

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '';
      setChatHistory(prev => prev.map(m =>
        m.id === streamId
          ? { ...m, content: `Sorry, something went wrong. ${errorMsg ? `(${errorMsg})` : ''} Please try again.`, isSearching: false }
          : m
      ));
    } finally {
      streamingMsgIdRef.current = null;
      setIsSubmitting(false);
      submitLockRef.current = false;
    }
  }, [userId, isSubmitting, sessionId, chatTurnCount, hasShownLengthWarning, lastShortlist]);

  const handleChatSubmit = useCallback(async (e: React.FormEvent, textOverride?: string) => {
    e.preventDefault();
    const text = (textOverride ?? chatInput).trim();
    if (!text) return;
    await streamChat(text);
  }, [chatInput, streamChat]);

  // ── Regenerate: re-send the last user message ──
  const handleRegenerate = useCallback(async (aiMsgIndex: number) => {
    let userMsg = '';
    for (let i = aiMsgIndex - 1; i >= 0; i--) {
      if (chatHistory[i].type === 'user') { userMsg = chatHistory[i].content; break; }
    }
    if (userMsg) await streamChat(userMsg);
  }, [chatHistory, streamChat]);

  const handleQuickReply = useCallback(async (field: string, value: string) => {
    let message = value;
    if (field === 'bhk') message = `${parseInt(value)} BHK`;
    await streamChat(message);
  }, [streamChat]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => setToast({ message: 'Copied!' }))
      .catch(() => {})
  }, []);

  const hasUserReplied = chatHistory.some((m) => m.type === 'user');

  // Index of the last chat message that has property cards — only that one shows full grid
  const lastPropertiesIndex = useMemo(() =>
    chatHistory.reduce((last, msg, i) =>
      (msg.properties && msg.properties.length > 0 ? i : last), -1
    ), [chatHistory]);

  // ── Submit a message programmatically (used by suggestion chips and advisor chips) ──
  const submitMessage = useCallback((text: string) => {
    streamChat(text);
  }, [streamChat]);

  // ── Carousel navigation helper ──
  const setCarouselIndex = (msgIndex: number, imgIndex: number) => {
    setCarouselIndexes(prev => ({ ...prev, [msgIndex]: imgIndex }));
  };

  // ── Render a single chat message ──
  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.type === 'user';

    return (
      <div key={message.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-message-in group/msg`}>
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
              <div className="relative z-10">
                {!message.content ? (
                  <ChatLoader
                    userQuery={message.userQuery ?? ''}
                    isSearching={!!message.isSearching}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-blue-700 dark:prose-headings:text-blue-400 prose-a:text-blue-500 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-table:w-full prose-table:text-sm prose-table:my-4 prose-table:border-collapse prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-blue-900/40 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-gray-800 dark:prose-th:text-blue-200 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </motion.div>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-[16px] font-medium leading-relaxed relative z-10">{message.content}</p>
            )}
          </div>
        </div>

        {/* ── Message actions — copy / thumbs (appear on hover) ── */}
        {!isUser && message.content && (
          <div className="ml-14 mt-1 flex items-center gap-0.5 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => handleCopy(message.content)}
              title="Copy response"
              className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all text-[11px]"
            >
              <Copy size={12} />
            </button>
            <button
              onClick={() => setToast({ message: 'Thanks for the feedback!' })}
              title="Good response"
              className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all text-[11px]"
            >
              <ThumbsUp size={12} />
            </button>
            <button
              onClick={() => setToast({ message: 'Thanks for the feedback!' })}
              title="Bad response"
              className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all text-[11px]"
            >
              <ThumbsDown size={12} />
            </button>
          </div>
        )}

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

          const isLatest = index === lastPropertiesIndex;

          if (!isLatest) {
            // Collapsed chip for older messages — keep history readable
            return (
              <div className="mt-2">
                <button
                  onClick={() => setExpandedShortlists((prev) => {
                    const next = new Set(prev);
                    if (next.has(message.id)) next.delete(message.id);
                    else next.add(message.id);
                    return next;
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-100 rounded-xl text-[12px] font-semibold text-gray-500 hover:text-blue-700 transition-all"
                >
                  <span>🏠</span>
                  {expandedShortlists.has(message.id) ? 'Hide' : `View`} {message.properties.length} properties from this search
                  <ChevronDown size={13} className={`transition-transform duration-200 ${expandedShortlists.has(message.id) ? 'rotate-180' : ''}`} />
                </button>
                {expandedShortlists.has(message.id) && (
                  <div className="mt-3 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto snap-x snap-mandatory sm:overflow-x-visible pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                    {message.properties.map((property, pi) => (
                      <div key={property.id} className="min-w-[85vw] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink">
                        <ProjectCard project={property} userId={userId} index={pi} onDetailOpen={setDetailProject} onCallback={setCallbackProject} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <>
              {/* Card reveal header */}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center gap-3"
              >
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-[15px]">🏘️</span>
                  <span className="text-[13px] font-bold text-gray-800 dark:text-gray-200">
                    {message.properties.length} {message.properties.length === 1 ? 'property' : 'properties'} found
                  </span>
                  {message.properties[0]?.sector && (
                    <span className="text-[11px] text-gray-400">· {message.properties[0].sector}</span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-2.5 py-1 rounded-full">
                  Ranked by fit
                </span>
              </motion.div>

              <div className="mt-3 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto snap-x snap-mandatory sm:overflow-x-visible pb-2 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0 w-full">
                {message.properties.map((property, pi) => (
                  <div key={property.id} className="min-w-[85vw] sm:min-w-0 snap-center flex-shrink-0 sm:flex-shrink">
                    <ProjectCard
                      project={property}
                      userId={userId}
                      index={pi}
                      onDetailOpen={setDetailProject}
                      onCallback={setCallbackProject}
                    />
                  </div>
                ))}
              </div>
              {/* ── Sector map ── */}
              {message.properties.length >= 2 && (
                <div className="mt-3 w-full">
                  <button
                    onClick={() => setShowMap((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-100 rounded-xl text-[12px] font-semibold text-gray-600 hover:text-blue-700 transition-all mb-2"
                  >
                    <span>🗺️</span>
                    {showMap ? 'Hide map' : `View on map — ${message.properties.length} properties`}
                  </button>
                  {showMap && (
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <SectorMap properties={message.properties} />
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })()}

        {/* ── Collapsible shortlist for ADVISOR follow-up messages ── */}
        {message.type === 'ai' && chatPhase === 'ADVISOR' && !message.properties?.length && lastShortlist.length > 0 && index === chatHistory.length - 1 && (
          <div className="mt-3 ml-14 w-full">
            <button
              onClick={() => setExpandedShortlists((prev) => {
                const next = new Set(prev);
                if (next.has(message.id)) next.delete(message.id);
                else next.add(message.id);
                return next;
              })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-[12px] font-semibold text-blue-700 transition-all"
            >
              <span>View {lastShortlist.length} shortlisted properties</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${expandedShortlists.has(message.id) ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedShortlists.has(message.id) && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lastShortlist.map((p, pi) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    userId={userId}
                    index={pi}
                    onDetailOpen={setDetailProject}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Follow-up chips + property picker ── */}
        {message.type === 'ai' && message.content && index === chatHistory.length - 1 && !isSubmitting && (() => {
          const chips = getFollowUpChips(chatPhase, lastShortlist, chatTurnCount)
          if (chips.length === 0) return null
          return (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-3 ml-14"
            >
              {/* Chip row */}
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {chips.map((chip) => {
                  const isActive = chipPicker?.label === chip.label
                  return (
                    <button
                      key={chip.label}
                      onClick={() => {
                        if (chip.special === '__open_calculator__') { setShowCalculator(true); setChipPicker(null); return }
                        if (chip.special === '__share_shortlist__') { setShareSheetOpen(true); setChipPicker(null); return }
                        if (chip.msg) { setChipPicker(null); submitMessage(chip.msg); return }
                        if (chip.picker && chip.pickerAction) {
                          if (isActive) { setChipPicker(null); return }
                          setChipPicker({ mode: chip.picker, action: chip.pickerAction, label: chip.label, isModal: chip.pickerModal ?? false, selected: [] })
                        }
                      }}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-semibold transition-all shadow-sm whitespace-nowrap border ${
                        isActive
                          ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 dark:shadow-blue-900'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                      }`}
                    >
                      <span>{chip.emoji}</span>
                      {chip.label}
                      {chip.picker && <span className={`text-[10px] ml-0.5 ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>▾</span>}
                    </button>
                  )
                })}
              </div>

              {/* Property picker — slides in below chips when active */}
              <AnimatePresence>
                {chipPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-2xl p-3 shadow-lg">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          {chipPicker.mode === 'multi' ? 'Select properties to compare' : `Which property?`}
                        </span>
                        <button onClick={() => setChipPicker(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none px-1">×</button>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {lastShortlist.map((p) => {
                          const isSelected = chipPicker.selected.includes(p.slug)
                          return (
                            <button
                              key={p.slug}
                              onClick={() => {
                                if (chipPicker.mode === 'single') {
                                  setChipPicker(null)
                                  if (chipPicker.isModal) {
                                    if (chipPicker.action === 'site_visit') { setSiteVisitProject(p); return }
                                    if (chipPicker.action === 'callback') { setCallbackProject(p); setCallbackForm({ name: '', phone: '' }); setCallbackDone(false); return }
                                  }
                                  submitMessage(buildPickerMessage(chipPicker.action, [p]))
                                } else {
                                  // Toggle selection
                                  setChipPicker(prev => {
                                    if (!prev) return prev
                                    const next = isSelected
                                      ? prev.selected.filter(s => s !== p.slug)
                                      : prev.selected.length < 3 ? [...prev.selected, p.slug] : prev.selected
                                    return { ...prev, selected: next }
                                  })
                                }
                              }}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all border ${
                                isSelected
                                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200'
                                  : 'border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {chipPicker.mode === 'multi' && (
                                  <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border ${
                                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'
                                  }`}>
                                    {isSelected && <span className="text-white text-[10px]">✓</span>}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-semibold text-[13px] truncate">{p.name}</div>
                                  <div className="text-[11px] text-gray-400 dark:text-gray-500">{p.price_range_label} · {p.sector}</div>
                                </div>
                              </div>
                              {chipPicker.mode === 'single' && (
                                <span className="text-gray-300 dark:text-gray-600 text-xs ml-2 flex-shrink-0">→</span>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Confirm button for multi-select */}
                      {chipPicker.mode === 'multi' && chipPicker.selected.length >= 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={() => {
                              const selected = lastShortlist.filter(p => chipPicker.selected.includes(p.slug))
                              const msg = buildPickerMessage(chipPicker.action, selected)
                              setChipPicker(null)
                              submitMessage(msg)
                            }}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold rounded-xl transition-all"
                          >
                            Compare {chipPicker.selected.length} properties →
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })()}

        {/* ── Inline comparison table ── */}
        {message.type === 'ai' && message.showComparisonTable && lastShortlist.length >= 2 && (
          <div className="mt-3 ml-14 w-full">
            <ComparisonTable left={lastShortlist[0]} right={lastShortlist[1]} />
          </div>
        )}

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

      {/* Project detail slide-over */}
      <ProjectDetailPanel project={detailProject} onClose={() => setDetailProject(null)} />

      {/* Calculator panel */}
      {showCalculator && (
        <CalculatorPanel
          onClose={() => setShowCalculator(false)}
          defaultPriceCr={lastShortlist[0]?.price_min_cr ?? 1.5}
        />
      )}

      {/* ── Site Visit Scheduler modal ── */}
      <AnimatePresence>
        {siteVisitProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setSiteVisitProject(null) }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl"
            >
              <SiteVisitScheduler
                projectId={siteVisitProject.id}
                projectSlug={siteVisitProject.slug}
                projectName={siteVisitProject.name}
                onClose={() => setSiteVisitProject(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Callback request modal ── */}
      <AnimatePresence>
        {callbackProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setCallbackProject(null); setCallbackDone(false) } }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 pb-safe"
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 sm:hidden" />

              {callbackDone ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Request sent!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Our team will call you back within 2 hours during business hours.</p>
                  <button onClick={() => { setCallbackProject(null); setCallbackDone(false) }} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors">Done</button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">Request Callback</h3>
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">{callbackProject.name} · {callbackProject.price_range_label}</p>
                    </div>
                    <button onClick={() => setCallbackProject(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none transition-colors">×</button>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Your Name</label>
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={callbackForm.name}
                        onChange={(e) => setCallbackForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    disabled={!callbackForm.name.trim() || callbackForm.phone.trim().length < 10 || callbackSubmitting}
                    onClick={async () => {
                      setCallbackSubmitting(true)
                      try {
                        await fetch(`${API_BASE}/callback`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: callbackForm.name.trim(),
                            phone: callbackForm.phone.trim(),
                            project_id: callbackProject.id,
                            project_slug: callbackProject.slug,
                            project_name: callbackProject.name,
                          }),
                        })
                        setCallbackDone(true)
                      } catch { /* silent */ } finally {
                        setCallbackSubmitting(false)
                      }
                    }}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 text-white font-bold rounded-xl transition-all text-sm"
                  >
                    {callbackSubmitting ? 'Sending...' : '📞 Request Callback'}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">We'll call within 2 hours · Business hours only</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share shortlist sheet ── */}
      <AnimatePresence>
        {shareSheetOpen && lastShortlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setShareSheetOpen(false); setShareCopied(false) } }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 pb-safe"
            >
              <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-5 sm:hidden" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white">Share Shortlist</h3>
                <button onClick={() => { setShareSheetOpen(false); setShareCopied(false) }} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none transition-colors">×</button>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700 text-[12px] text-gray-600 dark:text-gray-300 font-mono leading-relaxed">
                <div className="font-bold text-gray-800 dark:text-gray-100 mb-1">🏠 My RealtyPals Shortlist</div>
                {lastShortlist.map((p, i) => (
                  <div key={p.id}>{i + 1}. {p.name} — {p.price_range_label} ({p.sector})</div>
                ))}
                <div className="mt-2 text-gray-400 text-[11px]">Researched with RealtyPal AI</div>
              </div>

              <div className="flex flex-col gap-2">
                {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🏠 My RealtyPals Shortlist\n\n` +
                      lastShortlist.map((p, i) => `${i + 1}. ${p.name} — ${p.price_range_label} (${p.sector})`).join('\n') +
                      `\n\nResearched with RealtyPal AI`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Share on WhatsApp
                  </a>
                )}
                <button
                  onClick={() => {
                    const text = `🏠 My RealtyPals Shortlist\n\n` +
                      lastShortlist.map((p, i) => `${i + 1}. ${p.name} — ${p.price_range_label} (${p.sector})`).join('\n') +
                      `\n\nResearched with RealtyPal AI`
                    navigator.clipboard.writeText(text).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000) })
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {shareCopied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
