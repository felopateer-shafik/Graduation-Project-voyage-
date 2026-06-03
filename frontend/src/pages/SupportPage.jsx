import { useState, useRef, useEffect } from 'react';
import PageShell from '@/components/common/PageShell';
import GlassPanel from '@/components/common/GlassPanel';
import { cn } from '@/utils/cn';
import { aiAPI } from '@/api/ai';

const INITIAL_MESSAGE = {
  id: 0,
  role: 'assistant',
  content: "Hello! I'm your Voyage travel assistant. I can help you with flights, hotels, bookings, loyalty points, cancellations, and more. What can I do for you today?",
};

const QUICK_ACTIONS = [
  { label: 'Cancel booking', icon: 'cancel', msg: 'How do I cancel a booking?' },
  { label: 'Loyalty points', icon: 'loyalty', msg: 'How do Voyage loyalty points work?' },
  { label: 'Hotel search', icon: 'hotel', msg: 'How do I find and book a hotel?' },
  { label: 'Payment methods', icon: 'payment', msg: 'What payment methods do you accept?' },
];

export default function SupportPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages
      .filter(m => m.id !== 0)
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const data = await aiAPI.support(text.trim(), history);
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process that. Please try again.',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">
          Support Center
        </h1>
        <p className="text-on-surface-variant mb-8">Chat with our AI assistant or use a quick action below.</p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.msg)}
              disabled={isTyping}
              className="glass-card rounded-2xl p-4 text-center hover:shadow-card-hover transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-primary text-2xl block mb-2">{action.icon}</span>
              <span className="text-xs font-bold">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <GlassPanel className="!p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dim text-white p-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div>
              <p className="font-bold">Voyage AI Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-white/70 text-xs">Powered by Gemini · Responds instantly</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="h-[420px] overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-white rounded-br-md'
                    : 'mr-auto bg-surface-container/80 text-on-surface rounded-bl-md'
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {isTyping && (
              <div className="mr-auto max-w-[80%] p-4 rounded-2xl bg-surface-container/80 rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-outline/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-outline/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-outline-variant/10 bg-white/30">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your travel..."
                disabled={isTyping}
                className="flex-1 bg-surface-container/50 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dim transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </form>
        </GlassPanel>
      </div>
    </PageShell>
  );
}
