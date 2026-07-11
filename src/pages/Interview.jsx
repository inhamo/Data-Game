import React, { useState, useEffect } from 'react';
import { Video, Building2, Volume2, VolumeX, ChevronRight, Check } from 'lucide-react';
import { Person, Empty } from '../components';
import { characterBible, recruiterFallbackQuestions } from '../data';
import { appPath, selectCharacterVoice } from '../utils';
import { CalendarDays } from 'lucide-react';
import TechnicalInterview from './TechnicalInterview';
import TeamAssessment from './TeamAssessment';

function Interview({ application, onSubmit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [format] = useState(() => Math.random() > 0.5 ? 'online' : 'office');
  const [speaking, setSpeaking] = useState(true);
  const [questionBank, setQuestionBank] = useState(null);
  const [questionSource, setQuestionSource] = useState('Preparing interview');
  const [voiceOn, setVoiceOn] = useState(true);

  const currentRound = application?.round || 1;
  const totalRounds = application?.job.interviewRounds || 1;

  const setup = currentRound === 1
    ? { title: 'Talent acquisition conversation', lead: application?.job.interviewer, role: application?.job.interviewerRole, members: [] }
    : currentRound < totalRounds
      ? { title: 'Technical panel', lead: 'Tom Reyes', role: 'Data Engineer', members: ['Lebo · Analyst', 'Daniel · Data Engineer'] }
      : totalRounds === 1
        ? { title: 'Hiring team interview', lead: application?.job.interviewer, role: application?.job.interviewerRole, members: ['Team representative'] }
        : { title: 'Senior team panel', lead: 'Elena Cho', role: 'Chief Financial Officer', members: ['Priya · Senior Analyst', 'Marcus · VP Marketing', 'Tom · Data Engineer'] };

  const interviewerCharacter = Object.values(characterBible).find((character) => character.name === setup.lead);
  const interviewerAsset = interviewerCharacter?.portrait || (/Priya|Elena|Amara|Naledi|Aisha/i.test(setup.lead || '')
    ? '/assets/people/executive-burgundy-gesturing.webp'
    : '/assets/people/executive-blue-speaking.webp');

  useEffect(() => {
    if (!application) return;
    if (currentRound > 1) return;
    let active = true;
    async function prepareInterview() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500);
      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            mode: 'interview',
            persona: 'Recruiter',
            message: `Create round ${application.round || 1} interview questions.`,
            context: `Company: ${application.job.company}. Role: ${application.job.title}. Interview format: ${setup.title}. Lead interviewer: ${setup.lead}, ${setup.role}.`
          })
        });
        const payload = await response.json();
        if (!response.ok || !payload.data?.questions?.length) throw new Error('Generated interview unavailable');
        if (active) { setQuestionBank(payload.data.questions); setQuestionSource('Adaptive interview'); }
      } catch {
        try {
          const response = await fetch(appPath('data/simulation-content.json'));
          if (!response.ok) throw new Error('Saved interview unavailable');
          const payload = await response.json();
          if (active && payload.recruiterQuestions?.length) {
            setQuestionBank(payload.recruiterQuestions);
            setQuestionSource('Saved interview');
          } else throw new Error('Saved interview is empty');
        } catch {
          if (active) {
            setQuestionBank(recruiterFallbackQuestions.map((item) => ({
              category: item[0],
              question: item[1],
              options: [item[2], item[3]],
              correct: item[4]
            })));
            setQuestionSource('Built-in interview');
          }
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    prepareInterview();
    return () => { active = false; };
  }, [application, setup.lead, setup.role, setup.title]);

  useEffect(() => {
    setSpeaking(true);
    const timer = setTimeout(() => setSpeaking(false), 1350);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!voiceOn || !questionBank?.[index] || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(questionBank[index].question);
      utterance.pitch = 1;
      utterance.voice = selectCharacterVoice(interviewerCharacter);
      utterance.rate = interviewerCharacter?.voiceRate || 0.94;
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length) speak();
    else window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', speak);
      window.speechSynthesis.cancel();
    };
  }, [index, questionBank, voiceOn]);

  if (!application) return <Empty icon={CalendarDays} title="No interview scheduled" text="An employer must invite you before an interview appears." />;
  if (currentRound > 1 && currentRound < totalRounds) return <TechnicalInterview application={application} onSubmit={onSubmit} />;
  if (currentRound === totalRounds && totalRounds > 1) return <TeamAssessment application={application} onSubmit={onSubmit} />;
  if (!questionBank) return (
    <section className="interview-loading">
      <div className="result-emblem"><Video size={32} /></div>
      <p className="overline">{application.job.company}</p>
      <h1>{questionSource}</h1>
      <p>{application.job.interviewer} is preparing questions for round {application.round || 1}.</p>
    </section>
  );

  const question = questionBank[index];
  function next() {
    const nextAnswers = [...answers, selected];
    if (index === questionBank.length - 1) {
      onSubmit(nextAnswers.reduce((score, answer, i) => score + (answer === questionBank[i].correct ? 1 : 0), 0));
    } else {
      setAnswers(nextAnswers);
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  return (
    <section className={`interview-room ${format} ${setup.members.length ? 'panel-interview' : 'solo-interview'}`}>
      <header>
        <div>
          <p className="overline">{application.job.company} · Round {currentRound} of {totalRounds}</p>
          <h1>{application.job.title}</h1>
        </div>
        <div className="interview-format">
          {format === 'online' ? <Video size={16} /> : <Building2 size={16} />}
          <span>{setup.title} · {format === 'online' ? 'video' : 'in office'}</span>
        </div>
        <button className="voice-button" onClick={() => setVoiceOn((value) => !value)} title={voiceOn ? 'Mute interviewer' : 'Enable interviewer voice'}>
          {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <span>{questionSource} · {index + 1} of {questionBank.length}</span>
      </header>
      <div className="interview-scene">
        <div className="office-window" />
        <div className={`speech-bubble ${speaking ? 'speaking' : ''}`}>
          <strong>{setup.lead} asks</strong>
          <span>{question.question}</span>
          {speaking && <i><b /><b /><b /></i>}
        </div>
        {setup.members.length > 0 && (
          <div className="interview-panel-members">
            {setup.members.map((member, memberIndex) => (
              <div key={member} className={`panel-member member-${memberIndex}`}>
                <Person faculty />
                <span>{member}</span>
              </div>
            ))}
          </div>
        )}
        <img className="interviewer-3d" src={appPath(interviewerAsset)} alt={`${setup.lead}, ${setup.role}`} />
        <div className="interviewer-nameplate">
          <strong>{setup.lead}</strong>
          <small>{setup.role}</small>
        </div>
        <div className="desk"><span className="laptop">{application.job.company.split(' ')[0].toUpperCase()}</span></div>
        {format === 'online' && <div className="video-controls"><span /><span className="end-call" /><span /></div>}
      </div>
      <article key={index} className="question-panel">
        <span>{question.category || 'Interview'}</span>
        <h2>Your response</h2>
        {question.options.map((answer, i) => (
          <button className={selected === i ? 'selected' : ''} key={answer} onClick={() => setSelected(i)}>
            <b>{"ABCD"[i]}</b>{answer}<Check size={18} />
          </button>
        ))}
        <button className="primary-button" disabled={selected === null} onClick={next}>
          {index === questionBank.length - 1 ? 'Submit interview' : 'Answer and continue'} <ChevronRight size={17} />
        </button>
      </article>
    </section>
  );
}

export default Interview;