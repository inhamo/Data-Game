import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { WhatsApp } from '../components';
import { friend, storyContent } from '../data';
import { now, profileTemplateValues, renderTemplate } from '../utils';

function ResultsChat({ profile, onContinue }) {
  const chatScript = storyContent.resultsChat;
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const values = profileTemplateValues(profile);
    const one = setTimeout(() => {
      setMessages([{ from: 'them', text: renderTemplate(chatScript.opening, values), time: now() }]);
    }, 600);
    const two = setTimeout(() => {
      setMessages((current) => [...current, { from: 'them', text: chatScript.announcement, time: now() }]);
    }, 1500);
    return () => { clearTimeout(one); clearTimeout(two); };
  }, [chatScript.announcement, chatScript.opening, profile]);

  function send() {
    if (!draft.trim()) return;
    const text = draft.trim();
    setMessages((current) => [...current, { from: 'me', text, time: now() }]);
    setDraft('');
    const reply = chatScript.replies[messages.length % chatScript.replies.length];
    setTimeout(() => setMessages((current) => [...current, { from: 'them', text: reply, time: now() }]), 400);
  }

  return (
    <div className="chat-with-action">
      <WhatsApp contact={friend} messages={messages} draft={draft} setDraft={setDraft} onSend={send} placeholder="Message Thando" />
      {messages.length > 1 && (
        <button className="portal-action" onClick={onContinue}>
          Open student portal <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

export default ResultsChat;
