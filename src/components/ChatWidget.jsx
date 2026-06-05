import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CHAT_API = '/api/chat';

export default function ChatWidget() {
  const { isRTL } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: isRTL ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟' : 'Hello! How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const extractReply = (data, fallback) =>
      data?.reply || data?.output || data?.message || data?.text ||
      (Array.isArray(data) && (data[0]?.output || data[0]?.message || data[0]?.text || data[0]?.reply)) ||
      (typeof data === 'string' ? data : null) ||
      fallback;

    const parseResponse = async (response, fallback) => {
      if (!response.ok) return null;
      try {
        const data = await response.json();
        return extractReply(data, fallback);
      } catch {
        const text = await response.text().catch(() => '');
        return text || null;
      }
    };

    try {
      const fallbackText = isRTL ? 'حدث خطأ، يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.';

      const response = await apiFetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: isRTL ? 'ar' : 'en',
          sessionId: 'chat-session',
        }),
      });
      const botText = await parseResponse(response, fallbackText);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', text: botText || fallbackText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: isRTL ? 'حدث خطأ، يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9999] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
          style={{
            width: 360,
            maxHeight: 520,
            background: '#fff',
            border: '1px solid #e2e8f0',
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm leading-none">
                {isRTL ? 'مساعد CV Mister' : 'CV Mister Assistant'}
              </p>
              <p className="text-white/70 text-xs mt-0.5">
                {isRTL ? 'متاح الآن' : 'Online'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 280, maxHeight: 340 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}
              >
                <div
                  className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderBottomRightRadius: isRTL ? 16 : 4, borderBottomLeftRadius: isRTL ? 4 : 16 }
                      : { background: '#f1f5f9', color: '#1e293b', borderBottomRightRadius: isRTL ? 4 : 16, borderBottomLeftRadius: isRTL ? 16 : 4 }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <div className="px-4 py-3 rounded-2xl bg-slate-100 flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-slate-100 flex gap-2 items-end">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isRTL ? 'اكتب رسالتك...' : 'Type a message...'}
              disabled={loading}
              className="flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 transition-colors bg-slate-50 disabled:opacity-50"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', flexShrink: 0 }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
          </svg>
        )}
      </button>
    </>
  );
}
