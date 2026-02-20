
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, Bot, Copy, Check, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
  onCopy?: () => void;
}

const ChatInterface: React.FC<Props> = ({ messages, onSendMessage, isProcessing, onCopy }) => {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    if (onCopy) onCopy();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="glass flex flex-col h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide">Ai Chat Assistant</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl relative group/msg ${
              msg.role === 'user' 
                ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-50' 
                : 'bg-white/5 border border-white/10 text-gray-200 shadow-xl'
            }`}>
              <div className="text-[10px] uppercase font-bold mb-1 opacity-50 flex justify-between">
                {msg.role === 'model' ? 'Assistant' : 'Me'}
                <button onClick={() => handleCopy(msg.content, i)} className="opacity-0 group-hover/msg:opacity-100 transition-opacity">
                  {copiedIndex === i ? <Check size={10} className="text-blue-500" /> : <Copy size={10} />}
                </button>
              </div>
              <div className="whitespace-pre-wrap leading-relaxed mono text-xs mb-2">
                {msg.content}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                  <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">Sources Found</p>
                  <div className="flex flex-col gap-1">
                    {msg.sources.map((s, idx) => (
                      <a key={idx} href={s.uri} target="_blank" className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                        <ExternalLink size={10} />
                        <span className="truncate">{s.title || s.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && messages[messages.length - 1].role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-emerald-400" />
              <span className="text-xs text-emerald-400 animate-pulse mono font-bold uppercase tracking-tighter">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-emerald-500/50 transition-all text-sm mono shadow-inner"
          />
          <button type="submit" disabled={isProcessing} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black active:scale-90 transition-all disabled:opacity-20">
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
