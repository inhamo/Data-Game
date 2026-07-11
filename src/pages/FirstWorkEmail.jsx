import React from 'react';
import { Search, ArrowLeft, Inbox, Star, Send, CalendarDays } from 'lucide-react';
import { Avatar } from '../components';
import { initials } from '../utils';
import { MoreVertical } from 'lucide-react';

function FirstWorkEmail({ profile, certificate, onJoin, onExit }) {
  return (
    <main className="first-mail">
      <header>
        <div className="offer-brand"><span>SR</span><strong>SOLSTICE MAIL</strong></div>
        <div className="workspace-search"><Search size={17} /> Search company mail</div>
        <button onClick={onExit}><ArrowLeft size={18} /> Career portal</button>
      </header>
      <div className="first-mail-shell">
        <aside>
          <button className="compose">New message</button>
          <button className="active"><Inbox size={18} /> Inbox <b>1</b></button>
          <button><Star size={18} /> Starred</button>
          <button><Send size={18} /> Sent</button>
        </aside>
        <section className="first-mail-list">
          <p>Focused</p>
          <button className="active">
            <Avatar text="PS" />
            <div>
              <strong>Priya Shah</strong>
              <span>First morning: come sit in</span>
              <small>No prep deck. Bring a notebook and listen for the decision behind the noise.</small>
            </div>
            <time>08:31</time>
          </button>
        </section>
        <article className="first-mail-reader">
          <div className="mail-tools"><ArrowLeft size={19} /><span /><MoreVertical size={19} /></div>
          <h1>First morning: come sit in</h1>
          <div className="sender-line">
            <Avatar text="PS" />
            <div><strong>Priya Shah</strong><span>Senior Analyst · to you</span></div>
            <time>3 Aug 2026, 08:31</time>
          </div>
          <div className="mail-body">
            <p>Hi {profile.name.split(' ')[0]},</p>
            <p>Welcome to Solstice. Your {certificate.track} readiness certificate is through, so today is less about proving you belong and more about learning how the room works.</p>
            <p>At 09:30 I want you to sit in on a Customer Insights briefing in Boardroom 4. You do not need to perform. Listen for what people are really asking, where they sound certain too quickly, and which decision the data is supposed to support.</p>
            <p>I may ask for one small thought at the end. Small is fine. Clear is better than impressive.</p>
            <p>See you shortly,<br />Priya</p>
          </div>
          <div className="calendar-invite">
            <CalendarDays size={23} />
            <div><strong>Customer Insights briefing</strong><span>09:30 – 11:00 · Boardroom 4 · 7 attendees</span></div>
            <button className="primary-button" onClick={onJoin}>Join meeting</button>
          </div>
        </article>
      </div>
    </main>
  );
}

export default FirstWorkEmail;
