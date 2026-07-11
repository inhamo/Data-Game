import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, FileText, ShieldCheck, Clock3 } from 'lucide-react';
import { sqlAssessment, pythonAssessment } from '../data';
import { appPath, formatMinutes, normalizeAssessmentBank } from '../utils';
import { Check } from 'lucide-react';

function ReadinessAssessment({ profile, onCertified, onExit }) {
  const [track, setTrack] = useState(null);
  const [bank, setBank] = useState(null);
  const [bankSource, setBankSource] = useState('');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  async function chooseTrack(nextTrack) {
    setTrack(nextTrack);
    setBank(null);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'assessment',
          persona: 'Priya',
          message: `Create a fresh ${nextTrack} data readiness assessment.`,
          context: `Junior Data Analyst pre-employment test. Track: ${nextTrack}. Pass mark: 70%.`
        })
      });
      const payload = await response.json();
      if (!response.ok || payload.data?.questions?.length !== 20) throw new Error('Generated assessment unavailable');
      setBank(normalizeAssessmentBank(payload.data.questions, nextTrack));
      setBankSource('Fresh adaptive assessment');
    } catch {
      try {
        const response = await fetch(appPath('data/simulation-content.json'));
        const payload = await response.json();
        const fallback = nextTrack === 'Python' ? payload.pythonAssessment : payload.sqlAssessment;
        setBank(normalizeAssessmentBank(fallback, nextTrack));
        setBankSource('Saved offline assessment');
      } catch {
        setBank(normalizeAssessmentBank(nextTrack === 'Python' ? pythonAssessment : sqlAssessment, nextTrack));
        setBankSource('Built-in assessment');
      }
    }
  }

  function answer() {
    const nextAnswers = [...answers, selected];
    if (index === 19) {
      const correct = nextAnswers.reduce((total, value, i) => total + (value === bank[i][5] ? 1 : 0), 0);
      setResult({ correct, score: correct * 5 });
    } else {
      setAnswers(nextAnswers);
      setIndex((value) => value + 1);
      setSelected(null);
    }
  }

  function reset() {
    setTrack(null); setBank(null); setIndex(0); setAnswers([]); setSelected(null); setResult(null);
  }

  if (!track) {
    return (
      <main className="assessment-gate">
        <header>
          <div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div>
          <button onClick={onExit}><ArrowLeft size={18} /> Return to career portal</button>
        </header>
        <section className="assessment-intro">
          <p className="overline">Pre-employment requirement</p>
          <h1>Technical readiness assessment</h1>
          <p>Your contract is signed. Before your employee account is activated, choose one assessment and demonstrate the core skills required for your role.</p>
          <div className="assessment-rules">
            <span><strong>20</strong> questions</span>
            <span><strong>70%</strong> pass mark</span>
            <span><strong>4–6h</strong> simulated work</span>
          </div>
          <div className="track-options">
            <button onClick={() => chooseTrack('SQL')}>
              <span>SQL</span>
              <strong>SQL Readiness</strong>
              <small>Queries, joins, aggregation, quality, and safe data changes</small>
              <ChevronRight size={19} />
            </button>
            <button onClick={() => chooseTrack('Python')}>
              <span>PY</span>
              <strong>Python Readiness</strong>
              <small>Core Python, data structures, files, and pandas fundamentals</small>
              <ChevronRight size={19} />
            </button>
          </div>
          <div className="learning-library">
            <div><p className="overline">Prepare before testing</p><h2>Learning library</h2></div>
            <a href="https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/" target="_blank" rel="noreferrer"><strong>T-SQL learning path</strong><span>Microsoft Learn · 6 modules</span></a>
            <a href="https://learn.microsoft.com/en-us/shows/programming-databases-with-t-sql-for-beginners/" target="_blank" rel="noreferrer"><strong>T-SQL video series</strong><span>Microsoft Learn · beginner videos</span></a>
            <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer"><strong>Python tutorial</strong><span>Official Python documentation</span></a>
            <a href="https://pandas.pydata.org/docs/getting_started/intro_tutorials/" target="_blank" rel="noreferrer"><strong>pandas tutorials</strong><span>Official data-analysis guides</span></a>
          </div>
          <p className="assessment-warning">Questions change between attempts when the adaptive service is available. If it is offline, a saved 20-question data bank loads automatically.</p>
        </section>
      </main>
    );
  }

  if (!bank) {
    return (
      <main className="assessment-result">
        <section>
          <div className="result-emblem"><FileText size={34} /></div>
          <p className="overline">{track} readiness</p>
          <h1>Preparing a fresh assessment</h1>
          <p>Building 20 practical data questions. The saved offline bank will load automatically if needed.</p>
        </section>
      </main>
    );
  }

  if (result) {
    const passed = result.score >= 70;
    const minutes = 260 + (20 - result.correct) * 6;
    return (
      <main className={`assessment-result ${passed ? 'passed' : 'failed'}`}>
        <section>
          <div className="result-emblem">{passed ? <ShieldCheck size={42} /> : <FileText size={42} />}</div>
          <p className="overline">{track} readiness assessment</p>
          <h1>{passed ? 'You are cleared to start.' : 'Your start is on hold.'}</h1>
          <strong className="score-display">{result.score}%</strong>
          <p>You answered {result.correct} of 20 questions correctly in {formatMinutes(minutes)} of simulated workplace time. The required pass mark is 70%.</p>
          {passed ? (
            <>
              <div className="certificate-preview">
                <span>PLATO VERIFIED</span>
                <h2>Technical Readiness Certificate</h2>
                <p>This certifies that</p>
                <strong>{profile.name}</strong>
                <p>has passed the Solstice Retail Group {track} readiness assessment with a score of {result.score}%.</p>
                <small>Credential ID · AI-{track.toUpperCase()}-2026-{result.correct}20</small>
              </div>
              <button className="primary-button" onClick={() => onCertified({ track, score: result.score, minutes })}>
                Upload certificate and open company email
              </button>
            </>
          ) : (
            <>
              <div className="hold-notice">
                <Clock3 size={20} />
                <span><strong>Employee access remains locked</strong><small>Review the learning material before attempting the assessment again.</small></span>
              </div>
              <button className="primary-button" onClick={reset}>Choose a test and try again</button>
            </>
          )}
        </section>
      </main>
    );
  }

  const item = bank[index];
  return (
    <main className="assessment-test">
      <header>
        <div className="offer-brand"><span>SR</span><strong>{track} READINESS</strong></div>
        <span>{bankSource} · Question {index + 1} of 20</span>
      </header>
      <div className="assessment-progress"><span style={{ width: `${((index + 1) / 20) * 100}%` }} /></div>
      <section>
        <p className="overline">{track} applied knowledge</p>
        <h1>{item[0]}</h1>
        <div className="test-options">
          {item.slice(1, 5).map((option, optionIndex) => (
            <button className={selected === optionIndex ? 'selected' : ''} onClick={() => setSelected(optionIndex)} key={`${optionIndex}-${option}`}>
              <b>{"ABCD"[optionIndex]}</b>
              <span>{option}</span>
              <Check size={20} />
            </button>
          ))}
        </div>
        <footer>
          <span>{answers.length} answered · {20 - answers.length} remaining</span>
          <button className="primary-button" disabled={selected === null} onClick={answer}>
            {index === 19 ? 'Submit assessment' : 'Next question'} <ChevronRight size={17} />
          </button>
        </footer>
      </section>
    </main>
  );
}

export default ReadinessAssessment;
