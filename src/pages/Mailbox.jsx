import React, { useState } from 'react';
import { ChevronRight, Inbox, Star, Send, Search, ArrowLeft, MoreVertical } from 'lucide-react';
import { Avatar, Empty } from '../components';
import { Mail } from 'lucide-react';

function Mailbox({ applications, selectedId, setSelectedId, openInterview, openOffer }) {
  const messages = applications.map(mailFor);
  const selected = messages.find((m) => m.id === selectedId) || messages[0];
  const [starred, setStarred] = useState([]);

  function mailFor(application) {
    if (application.status.startsWith('Not selected')) {
      return {
        id: application.job.id,
        initials: application.job.logo,
        from: `${application.job.company} Careers`,
        subject: 'Update on your application',
        preview: 'Thank you for the time you invested...',
        body: [
          'Hello,',
          `Thank you for applying and for the time you invested${application.status.includes('interview') ? ' in your interview' : ''} for the ${application.job.title} position. After careful review, we will not be progressing your application at this time.`,
          'We appreciate your interest and encourage you to apply for future opportunities that match your experience.',
          'Kind regards,',
          `${application.job.company} Talent Team`,
        ],
      };
    }
    if (application.status === 'Offer received' || application.status === 'Offer accepted') {
      return {
        id: application.job.id,
        initials: 'SR',
        from: 'Solstice Retail Group People Team',
        subject: 'Your offer from Solstice Retail Group',
        preview: 'We are delighted to offer you...',
        action: 'offer',
        body: [
          'Dear candidate,',
          'We are delighted to offer you the Junior Data Analyst position at Solstice Retail Group.',
          'Please review the salary, benefits, start date, and full employment agreement before signing.',
          'Warm regards,',
          'Solstice Retail Group People Team',
        ],
      };
    }
    if (application.status === 'Interview requested' || application.status === 'Interview submitted') {
      return {
        id: application.job.id,
        initials: application.job.logo,
        from: `${application.job.company} Talent`,
        subject: application.status === 'Interview submitted' ? `Round ${application.round || 1} interview received` : `Interview invitation · Round ${application.round || 1}`,
        preview: application.status === 'Interview submitted' ? 'Your answers are now with the hiring team...' : 'We would like to continue the conversation...',
        action: application.status === 'Interview submitted' ? null : 'interview',
        body: application.status === 'Interview submitted'
          ? [
              'Hello,',
              `Your round ${application.round || 1} interview responses have been submitted successfully. The hiring team is reviewing them.`,
              'Waiting between stages is normal. We will contact you when a decision has been made.',
              `${application.job.company} Talent Team`,
            ]
          : [
              'Hello,',
              `We would like to invite you to round ${application.round || 1} of ${application.job.interviewRounds} for the ${application.job.title} role.`,
              'This stage may involve a hiring manager, technical colleagues, or senior team members. Please prepare for a different conversation at each stage.',
              `${application.job.company} Talent Team`,
            ],
      };
    }
    return {
      id: application.job.id,
      initials: application.job.logo,
      from: `${application.job.company} Careers`,
      subject: `Application received · ${application.job.title}`,
      preview: 'Your application is now under review...',
      body: [
        'Hello,',
        `We have received your application for ${application.job.title}. It is currently under review.`,
        'We will contact you if your experience matches the next stage.',
        `${application.job.company} Careers`,
      ],
    };
  }

  return (
    <section className="mailbox">
      <aside className="mail-folders">
        <button className="compose">New message</button>
        <button className="active"><Inbox size={18} /> Inbox <b>{messages.length}</b></button>
        <button><Star size={18} /> Starred</button>
        <button><Send size={18} /> Sent</button>
      </aside>
      <div className="mail-list">
        <div className="mail-search"><Search size={17} /> Search mail</div>
        {messages.map((message) => (
          <button key={message.id} className={selected?.id === message.id ? 'active' : ''} onClick={() => setSelectedId(message.id)}>
            <Avatar text={message.initials} />
            <div>
              <strong>{message.from}</strong>
              <span>{message.subject}</span>
              <small>{message.preview}</small>
            </div>
            <time>09:42</time>
          </button>
        ))}
      </div>
      <article className="mail-reader">
        {selected ? (
          <>
            <div className="mail-tools">
              <ArrowLeft size={19} />
              <span />
              <button
                className={starred.includes(selected.id) ? 'starred' : ''}
                onClick={() => setStarred((current) =>
                  current.includes(selected.id) ? current.filter((id) => id !== selected.id) : [...current, selected.id]
                )}
                title="Star email"
              >
                <Star size={19} fill={starred.includes(selected.id) ? 'currentColor' : 'none'} />
              </button>
              <MoreVertical size={19} />
            </div>
            <h1>{selected.subject}</h1>
            <div className="sender-line">
              <Avatar text={selected.initials} />
              <div><strong>{selected.from}</strong><span>to me</span></div>
              <time>8 Jul 2026, 09:42</time>
            </div>
            <div className="mail-body">{selected.body.map((p) => <p key={p}>{p}</p>)}</div>
            {selected.action === 'interview' && <button className="primary-button" onClick={openInterview}>Start interview</button>}
            {selected.action === 'offer' && <button className="primary-button" onClick={openOffer}>Review offer and contract</button>}
          </>
        ) : (
          <Empty icon={Mail} title="Your inbox is ready" text="Application updates will arrive here." />
        )}
      </article>
    </section>
  );
}

export default Mailbox;