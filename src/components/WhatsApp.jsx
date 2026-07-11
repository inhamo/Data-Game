import React from 'react';
import { ArrowLeft, Video, Search, MoreVertical, ShieldCheck, Paperclip, Send } from 'lucide-react';
import { Avatar } from '../components';

function WhatsApp({ contact, messages, draft, setDraft, onSend, placeholder }) {
  return (
    <main className="whatsapp-page">
      <section className="whatsapp-phone">
        <header className="wa-header">
          <ArrowLeft size={22} />
          <Avatar text={contact.initial} />
          <div><strong>{contact.name}</strong><span>online</span></div>
          <Video size={21} /><Search size={20} /><MoreVertical size={20} />
        </header>
        <div className="wa-wallpaper">
          <p className="wa-date">TODAY</p>
          <p className="wa-encryption"><ShieldCheck size={13} /> Messages are end-to-end encrypted.</p>
          {messages.map((message, index) => (
            <div key={`${message.text}-${index}`} className={`wa-bubble ${message.from}`}>
              {message.text}<span>{message.time}{message.from === "me" && " ✓✓"}</span>
            </div>
          ))}
        </div>
        <form className="wa-compose" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
          <button type="button" aria-label="Attach"><Paperclip size={21} /></button>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} autoFocus />
          <button className="wa-send" type="submit" aria-label="Send message"><Send size={19} /></button>
        </form>
      </section>
    </main>
  );
}

export default WhatsApp;