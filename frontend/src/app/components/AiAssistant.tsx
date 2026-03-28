import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, User, Terminal, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // External trigger listener for dashboard integration
  useEffect(() => {
    const handleExternalOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail?.message) {
        sendMessage(e.detail.message);
      }
    };
    window.addEventListener("suci-open-chat", handleExternalOpen);
    return () => window.removeEventListener("suci-open-chat", handleExternalOpen);
  }, [sendMessage]);

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

    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#E8DCCF] text-[#0B0B0B] shadow-2xl z-50 flex items-center justify-center border-4 border-black/20"
      >
        <MessageSquare className="w-6 h-6" />
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
                <div>
                  <h3 className="text-sm font-medium text-white">SUCI Intelligence Terminal</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Quantum Link Active</span>
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
                  <p className="text-white/20 text-xs font-light tracking-widest uppercase italic">Initializing Secure Link...</p>
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
                      {m.role === 'user' ? <User className="w-4 h-4 text-[#E8DCCF]" /> : <div className="w-4 h-4 flex items-center justify-center text-white/40 text-[10px] uppercase font-bold tracking-tighter">AI</div>}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-[#E8DCCF] text-[#0B0B0B] rounded-tr-none shadow-lg whitespace-pre-wrap' 
                        : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none prose prose-invert prose-xs max-w-none'
                    }`}>
                      {m.role === 'assistant' ? (
                        m.isNew ? <Typewriter text={m.content} /> : <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Thinking Effect */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center border border-white/5 animate-pulse">
                      <Terminal className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <div className="flex gap-1">
                        <motion.span 
                          animate={{ opacity: [0.2, 1, 0.2] }} 
                          transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1] }} 
                          className="w-1.5 h-1.5 rounded-full bg-[#E8DCCF]"
                        />
                        <motion.span 
                          animate={{ opacity: [0.2, 1, 0.2] }} 
                          transition={{ repeat: Infinity, duration: 1.4, delay: 0.2, times: [0, 0.5, 1] }} 
                          className="w-1.5 h-1.5 rounded-full bg-[#E8DCCF]"
                        />
                        <motion.span 
                          animate={{ opacity: [0.2, 1, 0.2] }} 
                          transition={{ repeat: Infinity, duration: 1.4, delay: 0.4, times: [0, 0.5, 1] }} 
                          className="w-1.5 h-1.5 rounded-full bg-[#E8DCCF]"
                        />
                      </div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-light animate-pulse">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
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
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (displayedText.length >= text.length) return;

    if (index < text.length) {
      const randomDelay = Math.random() * 25 + 5;
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, randomDelay);
      return () => clearTimeout(timeout);
    }
  }, [index, text, displayedText]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
}
