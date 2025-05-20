"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SupabaseProvider, useSupabase } from "../supabase-provider";
import type { User } from '@supabase/supabase-js';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatRow {
  question: string;
  answer: string;
}

export default function ChatbotPage() {
  return (
    <SupabaseProvider>
      <ChatbotContent />
    </SupabaseProvider>
  );
}

function ChatbotContent() {
  const supabase = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfText, setPdfText] = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState<'pdf' | 'ai'>('pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
      setLoading(false);
      if (!data.user) router.replace("/signin");
    });
  }, [supabase, router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfLoading(true);
    setPdfText("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setPdfText(data.text || "");
    setPdfLoading(false);
    setMessages([]);
  };

  const saveChat = async (question: string, answer: string) => {
    if (!user) return;
    await fetch("/api/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        pdf_id: null,
        question,
        answer,
      }),
    });
  };

  const loadHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    const res = await fetch("/api/get-chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
    const data = await res.json();
    if (data.chats) {
      setHistory(
        (data.chats as ChatRow[]).map((c) => [
          { role: 'user' as const, content: c.question },
          { role: 'bot' as const, content: c.answer },
        ]).flat()
      );
    }
    setLoadingHistory(false);
  };

  const handleSend = async () => {
    if (!input.trim() || (mode === 'pdf' && !pdfText)) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setSending(true);
    setInput("");
    let answer = '';
    try {
      if (mode === 'pdf') {
        const res = await fetch("/api/gemini-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input, pdfText }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to get response');
        }
        answer = data.answer || 'No response';
      } else {
        const res = await fetch("/api/gemini-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input, pdfText: '' }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to get response');
        }
        answer = data.answer || 'No response';
      }
      setMessages((msgs) => [...msgs, { role: 'bot', content: answer }]);
      await saveChat(input, answer);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((msgs) => [...msgs, { 
        role: 'bot', 
        content: error instanceof Error ? error.message : 'Failed to get response from Gemini'
      }]);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-2xl flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Chatbot</h1>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${mode === 'pdf' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setMode('pdf')}
          >
            PDF Chat
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${mode === 'ai' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setMode('ai')}
          >
            AI Chat
          </button>
        </div>
        <button
          onClick={loadHistory}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded-lg transition"
          disabled={loadingHistory}
        >
          {loadingHistory ? "Loading history..." : "Load Previous Chats"}
        </button>
        {history.length > 0 && (
          <div className="w-full flex flex-col gap-2 max-h-40 overflow-y-auto bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <strong className="text-yellow-800">Previous Chats:</strong>
            {history.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={msg.role === 'user' ? 'bg-indigo-50 text-indigo-800' : 'bg-green-50 text-green-800'}
                  style={{ display: 'inline-block', borderRadius: 8, padding: '4px 10px', margin: '2px 0' }}>
                  <b>{msg.role === 'user' ? 'You' : 'Gemini'}:</b> {msg.content}
                </span>
              </div>
            ))}
          </div>
        )}
        {mode === 'pdf' && (
          <div className="w-full flex flex-col items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow"
              disabled={pdfLoading}
            >
              {pdfLoading ? "Parsing PDF..." : "Upload PDF"}
            </button>
            {pdfText && (
              <div className="w-full bg-gray-50 border rounded p-4 mt-4 max-h-60 overflow-y-auto text-gray-700 text-sm">
                <strong>PDF loaded. Start chatting below!</strong>
              </div>
            )}
          </div>
        )}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto bg-slate-50 border rounded p-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={msg.role === 'user' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}
                  style={{ display: 'inline-block', borderRadius: 8, padding: '6px 12px', margin: '2px 0' }}>
                  <b>{msg.role === 'user' ? 'You' : 'Gemini'}:</b> {msg.content}
                </span>
              </div>
            ))}
            {sending && <div className="text-gray-400">Gemini is typing...</div>}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1 border rounded-lg px-4 py-2 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              placeholder={mode === 'pdf' ? "Ask a question about your PDF..." : "Chat with Gemini AI..."}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim() || (mode === 'pdf' && !pdfText)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}