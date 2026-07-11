import React, { useMemo, useState, useEffect } from 'react';
import { ChevronRight, GraduationCap, Volume2 } from 'lucide-react';
import { Person, Caps } from '../components';
import { storyContent } from '../data';
import { appPath, renderTemplate } from '../utils';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function speakCeremonyLine(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.78;
      utterance.pitch = 0.82;
      utterance.volume = 0.72;
      const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith('en'));
      utterance.voice = voices.find((voice) => /Daniel|David|George|Microsoft|Google UK English Male/i.test(voice.name)) || voices[0] || null;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    if (window.speechSynthesis.getVoices().length) speak();
    else window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
  });
}

function playApplause() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.15;
    master.connect(context.destination);

    Array.from({ length: 42 }).forEach((_, index) => {
      const start = context.currentTime + index * 0.045;
      const buffer = context.createBuffer(1, context.sampleRate * 0.08, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.55, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
      source.connect(gain).connect(master);
      source.start(start);
      source.stop(start + 0.14);
    });

    setTimeout(() => context.close(), 3400);
  } catch {
    // Browsers may block generated audio until a user gesture. The visual applause still runs.
  }
}

function Graduation({ profile, onContinue }) {
  const [moment, setMoment] = useState('queue');
  const [queueStep, setQueueStep] = useState(0);
  const [currentGraduate, setCurrentGraduate] = useState(0);
  const [ceremonyLine, setCeremonyLine] = useState('');
  const [cheering, setCheering] = useState(false);
  const ceremony = storyContent.graduationCeremony;

  const degree = profile.degree || 'Bachelor of Data Analytics';
  const ceremonyQueue = useMemo(() => [
    ...ceremony.calledBeforePlayer.map((graduate) => ({ ...graduate, player: false })),
    { name: profile.name || 'Graduate', degree, player: true },
  ], [ceremony.calledBeforePlayer, degree, profile.name]);

  useEffect(() => {
    let cancelled = false;
    const steps = [
      {
        after: 600,
        moment: 'queue',
        queueStep: 0,
        graduate: 0,
        line: renderTemplate(ceremony.callTemplate, ceremonyQueue[0]),
      },
      {
        after: 650,
        moment: 'queue',
        queueStep: 1,
        graduate: 0,
        line: renderTemplate(ceremony.guestConferralTemplate, ceremonyQueue[0]),
      },
      {
        after: 800,
        moment: 'queue',
        queueStep: 1,
        graduate: 1,
        line: renderTemplate(ceremony.callTemplate, ceremonyQueue[1]),
      },
      {
        after: 650,
        moment: 'queue',
        queueStep: 2,
        graduate: 1,
        line: renderTemplate(ceremony.guestConferralTemplate, ceremonyQueue[1]),
      },
      {
        after: 900,
        moment: 'walk',
        queueStep: 3,
        graduate: 2,
        line: renderTemplate(ceremony.playerCallTemplate, ceremonyQueue[2]),
      },
      {
        after: 3100,
        moment: 'award',
        queueStep: 3,
        graduate: 2,
        line: renderTemplate(ceremony.playerConferralTemplate, ceremonyQueue[2]),
      },
      {
        after: 900,
        moment: 'celebrate',
        queueStep: 3,
        graduate: 2,
        line: ceremony.cheerLine,
        cheer: true,
      },
    ];

    async function runCeremony() {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      for (const step of steps) {
        await wait(step.after);
        if (cancelled) return;
        setMoment(step.moment);
        setQueueStep(step.queueStep);
        setCurrentGraduate(step.graduate);
        setCeremonyLine(step.line);
        await speakCeremonyLine(step.line);
        if (cancelled) return;
        if (step.cheer) {
          setCheering(true);
          playApplause();
        }
      }
    }

    runCeremony();
    return () => {
      cancelled = true;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [ceremony, ceremonyQueue]);

  const guests = Array.from({ length: ceremony.guests });
  const queue = Array.from({ length: ceremony.queue });
  const activeGraduate = ceremonyQueue[currentGraduate];

  return (
    <main className={`graduation-hall ${moment} ${cheering ? 'cheering' : ''}`}>
      <div className="hall-ceiling"><i /><i /><i /></div>
      <div className="hall-banner"><GraduationCap size={30} /><span>{profile.university || 'University'} - Class of 2026</span></div>
      <section className="graduation-stage-real">
        <div className="stage-curtain left" /><div className="stage-curtain right" />
        <div className="faculty-row">{Array.from({ length: 7 }).map((_, i) => <Person key={i} faculty />)}</div>
        <div className="lectern"><GraduationCap size={26} /></div>
        <Person graduate main />
        <Person faculty presenter />
      </section>
      <div className="graduate-queue">
        {queue.slice(queueStep).map((_, i) => (
          <div className={i === 0 ? 'queue-position next' : 'queue-position'} key={i + queueStep}>
            <Person graduate />
          </div>
        ))}
      </div>
      <div className="audience">{guests.map((_, i) => <span key={i} style={{ '--delay': `${i * 20}ms` }} />)}</div>
      <div className="ceremony-caption" aria-live="polite">
        <Volume2 size={17} />
        <span>{activeGraduate?.player ? 'Your name is called' : 'Conferring degrees'}</span>
        <strong>{ceremonyLine || 'The ceremony begins.'}</strong>
      </div>
      {moment === 'award' && (
        <div className="name-call">
          <span>{ceremony.awardLabel}</span>
          <strong>{profile.name}</strong>
          <small>{degree}</small>
        </div>
      )}
      {moment === 'celebrate' && <Caps />}
      {moment === 'celebrate' && (
        <>
          <div className="cheer-callout">{ceremony.cheerLabel}</div>
          <div className="graduate-3d-celebration">
            <img src={appPath('assets/people/graduate-man-diploma.webp')} alt="" />
            <img src={appPath('assets/people/graduate-woman-celebrating.webp')} alt="" />
          </div>
        </>
      )}
      {moment === 'celebrate' && (
        <button className="graduation-next" onClick={onContinue}>
          Enter the world of work <ChevronRight size={18} />
        </button>
      )}
    </main>
  );
}

export default Graduation;
