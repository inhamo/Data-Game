import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Check, ChevronRight, Clock3, FileText, GraduationCap, ShieldCheck, BookOpen, CalendarDays, ExternalLink
} from 'lucide-react';
import { Avatar } from '../components';
import { appPath, initials } from '../utils';

function CertificationWorkspace({ profile, companyCertificate }) {
  const [mode, setMode] = useState('library');
  const [bank, setBank] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(() => {
    try { return JSON.parse(localStorage.getItem('plato-dp700-result') || 'null'); } catch { return null; }
  });
  const [secondsLeft, setSecondsLeft] = useState(6000);

  useEffect(() => {
    fetch(appPath('data/certifications/dp-700.json'))
      .then((response) => response.json())
      .then(setBank)
      .catch(() => setBank({ questions: [] }));
  }, []);

  useEffect(() => {
    if (mode !== 'test' || result || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [mode, result, secondsLeft]);

  function start(nextMode) {
    setMode(nextMode);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setSecondsLeft(6000);
    if (nextMode === 'test') setResult(null);
  }

  function nextPractice() {
    if (!revealed) { setRevealed(true); return; }
    if (index === bank.questions.length - 1) { setMode('library'); return; }
    setIndex((value) => value + 1);
    setSelected(null);
    setRevealed(false);
  }

  function nextTest() {
    const next = [...answers, selected];
    if (index === bank.questions.length - 1 || secondsLeft === 0) {
      const correct = next.reduce((total, answer, itemIndex) => total + (answer === bank.questions[itemIndex].correct ? 1 : 0), 0);
      const finalResult = { correct, total: next.length, score: Math.round((correct / next.length) * 100), completed: new Date().toISOString() };
      setResult(finalResult);
      localStorage.setItem('plato-dp700-result', JSON.stringify(finalResult));
    } else {
      setAnswers(next);
      setIndex((value) => value + 1);
      setSelected(null);
    }
  }

  if (mode === 'library') {
    return (
      <section className="certification-library">
        <header>
          <div>
            <p className="overline">Personal workspace</p>
            <h1>Certificates and preparation</h1>
            <p>Credentials, company assessments, and exam preparation stay organised by issuing company.</p>
          </div>
          <Avatar text={initials(profile.name)} />
        </header>
        <div className="certificate-company">
          <div className="company-certificate-heading">
            <span className="company-logo large">SR</span>
            <div><h2>Solstice Retail Group</h2><p>Internal workplace credentials</p></div>
          </div>
          {companyCertificate ? (
            <article className="earned-certificate">
              <ShieldCheck size={25} />
              <div><strong>{companyCertificate.track} Technical Readiness</strong><span>Passed with {companyCertificate.score}% · Verified</span></div>
            </article>
          ) : (
            <p className="certificate-empty">Your Solstice readiness certificate will appear here after you pass the entry assessment.</p>
          )}
        </div>
        <div className="certificate-company microsoft-company">
          <div className="company-certificate-heading">
            <span className="microsoft-mark"><i /><i /><i /><i /></span>
            <div><h2>Microsoft</h2><p>Data Engineering</p></div>
          </div>
          <div className="certification-path">
            <div>
              <span>Certification path</span>
              <h2>DP-700</h2>
              <p>Implementing Data Engineering Solutions Using Microsoft Fabric</p>
              <small>36-question practice session · 100-minute test simulation</small>
            </div>
            <div className="certification-actions">
              <a href="https://learn.microsoft.com/en-us/training/courses/dp-700t00" target="_blank" rel="noreferrer"><BookOpen size={17} /> Learn it</a>
              <button onClick={() => start('practice')}><FileText size={17} /> Practice 36</button>
              <button className="primary-button" onClick={() => start('test')}><Clock3 size={17} /> Take test</button>
              <a href="https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/" target="_blank" rel="noreferrer"><CalendarDays size={17} /> Schedule exam</a>
            </div>
          </div>
          {result && (
            <div className={`dp-result-strip ${result.score >= 70 ? 'passed' : ''}`}>
              <strong>{result.score}%</strong>
              <span>{result.score >= 70 ? 'Practice test passed. This is preparation, not the Microsoft credential.' : 'Keep practising before scheduling the official exam.'}</span>
            </div>
          )}
          <div className="domain-bands">
            <span>Implement and manage <b>30–35%</b></span>
            <span>Ingest and transform <b>30–35%</b></span>
            <span>Monitor and optimize <b>30–35%</b></span>
          </div>
        </div>
      </section>
    );
  }

  if (!bank?.questions?.length) {
    return (
      <section className="certification-loading">
        <FileText size={30} />
        <h1>Preparing DP-700</h1>
        <p>Loading the 36-question practice bank.</p>
      </section>
    );
  }

  const question = bank.questions[index];
  const testFinished = mode === 'test' && result;

  if (testFinished) {
    return (
      <section className="dp-test-result">
        <div className="result-emblem"><GraduationCap size={38} /></div>
        <p className="overline">DP-700 test simulation</p>
        <h1>{result.score >= 70 ? 'Practice test passed' : 'More preparation recommended'}</h1>
        <strong>{result.score}%</strong>
        <p>{result.correct} of {result.total} correct. This simulator result does not grant the Microsoft certification.</p>
        <button className="primary-button" onClick={() => setMode('library')}>Return to certificates</button>
        <button className="text-button" onClick={() => start('practice')}>Review question by question</button>
      </section>
    );
  }

  return (
    <main className={`dp-practice ${mode}`}>
      <header>
        <button onClick={() => setMode('library')}><ArrowLeft size={18} /> Certificates</button>
        <div><span>Microsoft · Data Engineering</span><strong>DP-700 {mode === 'practice' ? 'Practice' : 'Test'}</strong></div>
        {mode === 'test' ? (
          <time>{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}</time>
        ) : (
          <span>{index + 1} / {bank.questions.length}</span>
        )}
      </header>
      <div className="dp-progress"><span style={{ width: `${((index + 1) / bank.questions.length) * 100}%` }} /></div>
      <section>
        <p className="dp-domain">{question.domain}</p>
        <h1>{question.question}</h1>
        <div className="dp-options">
          {question.options.map((option, optionIndex) => (
            <button
              className={`${selected === optionIndex ? 'selected' : ''} ${revealed && optionIndex === question.correct ? 'correct' : ''} ${revealed && selected === optionIndex && optionIndex !== question.correct ? 'incorrect' : ''}`}
              disabled={revealed}
              onClick={() => setSelected(optionIndex)}
              key={option}
            >
              <b>{"ABCD"[optionIndex]}</b>
              <span>{option}</span>
              {revealed && optionIndex === question.correct && <Check size={19} />}
            </button>
          ))}
        </div>
        {revealed && (
          <div className="practice-explanation">
            <strong>{selected === question.correct ? 'Correct.' : `Best answer: ${"ABCD"[question.correct]}.`}</strong>
            <p>{question.explanation}</p>
            <a href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700" target="_blank" rel="noreferrer">
              Open the current Microsoft study guide <ExternalLink size={14} />
            </a>
          </div>
        )}
        <footer>
          <span>Source question {question.sourceQuestion} · Session of 36</span>
          <button className="primary-button" disabled={selected === null} onClick={mode === 'practice' ? nextPractice : nextTest}>
            {mode === 'practice'
              ? revealed
                ? index === bank.questions.length - 1 ? 'Finish practice' : 'Next question'
                : 'Check answer'
              : index === bank.questions.length - 1 ? 'Submit test' : 'Save and continue'}
            <ChevronRight size={16} />
          </button>
        </footer>
      </section>
    </main>
  );
}

export default CertificationWorkspace;