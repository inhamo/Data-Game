import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Avatar } from '../components';
import { initials } from '../utils';

function TeamsLearningChannel({ profile }) {
  const [channel, setChannel] = useState('learning');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { speaker: 'Priya', text: 'Question for the channel: when does a useful breakdown become a MECE issue tree rather than just a list?' },
    { speaker: 'Tom', text: 'When each branch implies different data and different work. If two branches send me the same request, you probably split the problem badly.' },
    { speaker: 'Elena', text: 'And when the branches together cover the decision. Four tidy boxes can still omit the only cause that matters.' },
    { speaker: 'Marcus', text: 'I still reserve the right to say pricing until someone brings evidence. Predictable, I know.' }
  ]);
  const generalMessages = [
    ['Lebo', 'Kitchen coffee machine is back. It now makes coffee and a concerning noise.'],
    ['Daniel', 'The 14:00 capacity review moved to tomorrow.'],
    ['Aisha', 'Welcome to the new graduates joining this week.'],
    ['Tom', 'Whoever named the new table final_final_v2, we need to talk.']
  ];

  async function contribute() {
    if (!draft.trim() || loading) return;
    const text = draft.trim();
    setMessages((current) => [...current, { speaker: profile.name.split(' ')[0] || 'You', text, mine: true, priority: true }]);
    setDraft('');
    setLoading(true);
    const speakerCycle = ['Priya', 'Elena', 'Marcus', 'Tom'];
    const persona = speakerCycle[messages.filter((message) => message.mine).length % speakerCycle.length];
    const fallback = {
      Priya: 'Make that more testable. What would be different in the data if your point were true?',
      Elena: 'What source would let us verify that rather than merely agree with it?',
      Marcus: 'Could that still be pricing showing up through a different symptom?',
      Tom: 'Translate that into grain, fields, and a bounded period, then it becomes work.'
    }[persona];
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          message: text,
          context: `Internal Teams learning channel. ${profile.name} contributed a point, so it is now the priority thread. Continue a deep but natural discussion about problem definition, MECE issue trees, evidence, and data-analysis practice. Reply in 1-3 conversational sentences and ask one question that moves the idea deeper.`
        })
      });
      const payload = await response.json();
      setMessages((current) => [...current, { speaker: persona, text: payload.reply || fallback }]);
    } catch {
      setMessages((current) => [...current, { speaker: persona, text: fallback }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="teams-workspace">
      <aside>
        <button className={channel === 'learning' ? 'active' : ''} onClick={() => setChannel('learning')}>
          <strong>Problem-solving lab</strong><span>AI-assisted deep dive</span>
        </button>
        <button className={channel === 'general' ? 'active' : ''} onClick={() => setChannel('general')}>
          <strong>Customer Insights · General</strong><span>Team conversation</span>
        </button>
      </aside>
      <section>
        <header>
          <div>
            <strong>{channel === 'learning' ? 'Problem-solving lab' : 'Customer Insights · General'}</strong>
            <span>{channel === 'learning' ? 'Your contribution becomes the active learning thread' : 'Regular team chat · backend connection later'}</span>
          </div>
        </header>
        <div className="teams-messages">
          {channel === 'learning' ? (
            messages.map((message, index) => (
              <article className={`${message.mine ? 'mine' : ''} ${message.priority ? 'priority' : ''}`} key={index}>
                <Avatar text={initials(message.speaker)} />
                <div>
                  <strong>{message.speaker}{message.priority && <span>Priority thread</span>}</strong>
                  <p>{message.text}</p>
                </div>
              </article>
            ))
          ) : (
            generalMessages.map(([speaker, text]) => (
              <article key={speaker + text}>
                <Avatar text={initials(speaker)} />
                <div><strong>{speaker}</strong><p>{text}</p></div>
              </article>
            ))
          )}
          {loading && (
            <article>
              <Avatar text="PS" />
              <div><strong>Team</strong><p>Someone is typing…</p></div>
            </article>
          )}
        </div>
        {channel === 'learning' && (
          <form onSubmit={(event) => { event.preventDefault(); contribute(); }}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a point or ask the team…" />
            <button disabled={!draft.trim() || loading}><Send size={17} /></button>
          </form>
        )}
      </section>
    </div>
  );
}

export default TeamsLearningChannel;