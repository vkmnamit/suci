import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, User, FileText, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "../hooks/useChat";
import { Button } from "./ui/button";

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessageStream, generateBriefing } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessageStream(input);
    setInput("");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#E8DCCF] text-[#0B0B0B] shadow-2xl z-50 flex items-center justify-center border-4 border-black/20"
      >
        <MessageSquare className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0B0B0B]"></div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-[#0B0B0B]/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8DCCF]/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[#E8DCCF]" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">SUCI Reasoning AI</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-white/40">Connected to local model</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8DCCF]/5 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-[#E8DCCF]/40" />
                  </div>
                  <h4 className="text-white font-medium mb-2">How can I help you today?</h4>
                  <p className="text-xs text-white/40 leading-relaxed mb-6">
                    Ask me about city carbon trends, energy forecasts, or generate a morning climate briefing.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => generateBriefing()}
                    className="border-[#E8DCCF]/30 text-[#E8DCCF] hover:bg-[#E8DCCF]/10 h-9 px-4 text-xs font-light"
                  >
                    Generate Morning Briefing
                  </Button>
                </div>
              )}

              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      m.role === 'user' ? 'bg-[#E8DCCF]/20' : 'bg-white/10'
                    }`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-[#E8DCCF]" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user' 
                        ? 'bg-[#E8DCCF] text-[#0B0B0B] rounded-tr-none' 
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                    }`}>
                      {m.content}
                      {m.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-[#E8DCCF] animate-pulse align-middle"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask SUCI AI..."
                  className="w-full bg-[#0B0B0B] border border-white/20 rounded-2xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#E8DCCF]/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#E8DCCF] text-[#0B0B0B] flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-white/30 font-light px-1">
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Reasoning</span>
                <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Local Model</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
