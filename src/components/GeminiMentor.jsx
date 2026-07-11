import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Avatar } from '../components';

function GeminiMentor({ step }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "ai", text: "Hi, I’m Priya. I can help you think through the approach while you build the answer yourself." }]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, loading, open]);

  async function send() {
    if (!draft.trim() || loading) return;
    const text = draft.trim();
    setMessages((current) => [...current, { from: "me", text }]);
    setDraft("");
    setLoading(true);
    try {
      const history = [...messages, { from: "me", text }].slice(-8).map((item) => `${item.from === "me" ? "Junior" : "Priya"}: ${item.text}`).join("\n");
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          persona: "Priya",
          context: `Current milestone: ${step}\nConversation so far:\n${history}\nContinue the conversation coherently. Do not restart your answer or repeat an unfinished fragment.`
        })
      });
      const payload = await response.json();
      setMessages((current) => [...current, { from: "ai", text: payload.reply || payload.error }]);
    } catch {
      setMessages((current) => [...current, { from: "ai", text: "I can’t reach the AI service right now. Check that the local development server is running." }]);
    } finally { setLoading(false); }
  }

  return (
    <aside className={`gemini-mentor ${open ? "open" : ""}`}>
      <button className="mentor-toggle" onClick={() => setOpen((value) => !value)}>
        <MessageCircle size={20} /><span>Ask Priya</span>
      </button>
      {open && (
        <div className="mentor-window">
          <header>
            <Avatar text="PS" />
            <div><strong>Priya Shah</strong><span>Senior Analyst · available</span></div>
          </header>
          <div className="mentor-messages" ref={messagesRef}>
            {messages.map((message, index) => (
              <p className={message.from} key={index}>{message.text}</p>
            ))}
            {loading && <p className="ai">Typing…</p>}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); send(); }}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message Priya…" />
            <button type="submit"><Send size={17} /></button>
          </form>
        </div>
      )}
    </aside>
  );
}

export default GeminiMentor;