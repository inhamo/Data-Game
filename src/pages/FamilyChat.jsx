import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { WhatsApp } from '../components';
import { storyContent } from '../data';
import { now, profileTemplateValues, renderTemplate } from '../utils';

function FamilyChat({ contact, profile, setProfile, onContinue }) {
  const chatScript = storyContent.familyChat;
  const [messages, setMessages] = useState([
    { from: 'them', text: renderTemplate(chatScript.opening, profileTemplateValues(profile)), time: '09:41' },
  ]);
  const [draft, setDraft] = useState('');
  const [conversationStep, setConversationStep] = useState(0);

  function send() {
    if (!draft.trim()) return;
    const answer = draft.trim();
    setMessages((current) => [...current, { from: 'me', text: answer, time: now() }]);
    setDraft('');

    const step = chatScript.steps[conversationStep];
    if (step) {
      if (step.saveAs) setProfile((current) => ({ ...current, [step.saveAs]: answer }));
      setConversationStep((current) => current + 1);
      setTimeout(() => {
        setMessages((current) => [
          ...current,
          { from: 'them', text: renderTemplate(step.reply, profileTemplateValues(profile, { answer })), time: now() },
        ]);
      }, 450);
      return;
    }

    setTimeout(() => {
      setMessages((current) => [...current, { from: 'them', text: chatScript.fallbackReply, time: now() }]);
    }, 450);
  }

  const goalComplete = Boolean(profile.afterUni && profile.expectedCompany);
  return (
    <div className="chat-with-action">
      <WhatsApp contact={contact} messages={messages} draft={draft} setDraft={setDraft} onSend={send} placeholder="Type a message" />
      {goalComplete && (
        <button className="portal-action" onClick={onContinue}>
          Continue to results day <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

export default FamilyChat;
