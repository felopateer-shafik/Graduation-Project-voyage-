import { useState, useRef, useEffect } from 'react';
import useChatStore from '@/store/useChatStore';
import { cn } from '@/utils/cn';
import { aiAPI } from '@/api/ai';

const GREETING = {
  id: '__greeting__',
  role: 'assistant',
  content: "Hi! I'm your Voyage assistant. Ask me about bookings, hotels, tours, or anything travel-related!",
  timestamp: new Date().toISOString(),
};

export default function ChatWidget() {
  const { isOpen, messages, isTyping, toggleChat, addMessage, setTyping } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    setTyping(true);

    const history = messages.slice(-4).map(m => ({ role: m.role, content: m.content }));

    try {
      const data = await aiAPI.support(userMessage, history);
      addMessage({
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process that. Please try again.',
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Try again in a moment.",
      });
    } finally {
      setTyping(false);
    }
  };

  const allMessages = messages.length === 0 ? [GREETING] : messages;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl',
          'bg-gradient-to-br from-primary to-primary-dim text-white',
          'flex items-center justify-center',
          'transition-all duration-200',
          isOpen && 'rotate-90'
        )}
        aria-label="Toggle support chat"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] flex flex-col glass-panel ghost-border rounded-[1.5rem] shadow-glass-xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dim text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Voyage Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <p className="text-white/70 text-xs">Powered by Gemini · Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide" style={{ maxHeight: '340px' }}>
            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'max-w-[85%] p-3 rounded-2xl text-sm',
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-white rounded-br-md'
                    : 'mr-auto bg-surface-container rounded-bl-md text-on-surface'
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            ))}

            {isTyping && (
              <div className="mr-auto max-w-[85%] p-3 rounded-2xl bg-surface-container rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-outline/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-outline/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-outline/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 bg-surface-container/50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dim transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
