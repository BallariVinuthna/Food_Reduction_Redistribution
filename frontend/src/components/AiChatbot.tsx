import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { AiChatMessage } from '../types';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RefreshCw,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';

interface AiChatbotProps {
  onNavigateTab?: (tab: string) => void;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content:
        "👋 **Welcome to SurplusFlow AI Assistant!**\n\nI am here to solve any doubts about:\n- 🌡️ **Food Safety:** FSSAI guidelines, 2-hour/4-hour rule, temperature control\n- 🍲 **Donating Food:** AI Image Checker, listings, safety checklists\n- 🔐 **Dual-OTP Handover:** Donor pickup OTP & recipient delivery OTP\n- ⚡ **MCDA Algorithm:** How surplus matches are scored and dispatched\n\nHow can I help you today?",
      source: 'SURPLUSFLOW_ASSISTANT',
      suggestedFollowUps: [
        'What is the 2-hour food safety rule?',
        'How does OTP handover verification work?',
        'How do I claim surplus food?',
        'How does the MCDA matching algorithm work?',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      const res = await api.chatWithAi(text, history);

      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: res.reply,
        source: res.source,
        suggestedFollowUps: res.suggestedFollowUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: AiChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        content:
          "⚠️ I encountered a temporary connection issue. However, you can review our standard food safety guidelines under the **Impact Analytics** and **Find Food** sections, or try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-new',
        sender: 'assistant',
        content: 'Conversation cleared. How else may I assist your redistribution operations?',
        source: 'SURPLUSFLOW_ASSISTANT',
        suggestedFollowUps: [
          'What is the 2-hour food safety rule?',
          'How does OTP handover verification work?',
          'How do I claim surplus food?',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 text-xs font-bold text-slate-700 shadow-lg backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#087B46]" />
            Ask AI Assistant
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-[#032C20] hover:bg-[#087B46] text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2 border-[#8BE34B]/60 group relative"
            aria-label="Open SurplusFlow AI Chatbot"
          >
            <Bot className="w-6 h-6 text-[#8BE34B] group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8BE34B] border-2 border-[#032C20]" />
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 md:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#032C20] p-4 text-white flex items-center justify-between shrink-0 border-b border-[#087B46]/40">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-[#8BE34B]/40 flex items-center justify-center text-[#8BE34B]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  SurplusFlow AI Assistant
                  <span className="w-2 h-2 rounded-full bg-[#8BE34B] animate-ping" />
                </h3>
                <p className="text-[11px] text-emerald-200/80">
                  Food safety, donations & operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 text-xs transition-colors"
                title="Clear Conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimize Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#032C20] text-[#8BE34B] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#087B46] text-white rounded-tr-sm shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.source && (
                      <span className="font-semibold text-emerald-700">
                        • {msg.source === 'OPENAI_GPT4O_MINI' ? 'OpenAI GPT-4o' : 'Knowledge Base'}
                      </span>
                    )}
                  </div>

                  {/* Suggested Follow-Ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleSendMessage(prompt)}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#087B46] text-[11px] font-semibold border border-slate-200 shadow-2xs transition-all text-left"
                        >
                          💬 {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#032C20] text-[#8BE34B] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 flex items-center gap-2 text-xs shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  Consulting food safety database...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about food safety, OTP, matching..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#087B46] disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-[#087B46] hover:bg-[#066337] text-white disabled:opacity-40 transition-colors shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Verified against FSSAI & PSE redistribution protocols</span>
              <span className="font-semibold text-emerald-700">SurplusFlow AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
