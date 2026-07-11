import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { BrandMark } from '../components';
import { storyContent } from '../data';

function ProblemSolvingAcademy({ onComplete }) {
  const academy = storyContent.academy;
  const [stage, setStage] = useState('chapter');
  const [pretest, setPretest] = useState([]);
  const [scenarios, setScenarios] = useState(['', '', '']);
  const [takeHome, setTakeHome] = useState('');

  function answerPretest(option) {
    const next = [...pretest, option];
    setPretest(next);
    if (next.length === academy.pretestQuestions.length) setStage('learn');
  }

  const question = academy.pretestQuestions[pretest.length];

  if (stage === 'chapter') {
    return (
      <main className="academy-screen">
        <header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Chapter 1 - Dashboard thinking</span></header>
        <section className="academy-learn chapter-brief">
          <p className="overline">What this chapter teaches</p>
          <h1>Before you build, find the decision.</h1>
          <p>You are learning two things only: how to define the real problem behind a request, and how to explain your answer with SCQA once you have enough evidence.</p>
          <div className="chapter-path">
            <article><strong>1. Short readiness check</strong><span>See what you already understand.</span></article>
            <article><strong>2. Meeting example</strong><span>Priya turns a dashboard request into a decision.</span></article>
            <article><strong>3. Web exercise</strong><span>Read/watch the source material and practise on-screen.</span></article>
            <article><strong>4. Take-home project</strong><span>Write the brief you will use for your first build.</span></article>
          </div>
          <button className="primary-button" onClick={() => setStage('pretest')}>Start chapter <ChevronRight size={17} /></button>
        </section>
      </main>
    );
  }

  if (stage === 'pretest') {
    return (
      <main className="academy-screen">
        <header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Problem solving - Pre-test</span></header>
        <section className="academy-pretest">
          <p className="overline">Before the lesson - {pretest.length + 1} of {academy.pretestQuestions.length}</p>
          <h1>{question.question}</h1>
          {question.options.map((option, index) => (
            <button onClick={() => answerPretest(index)} key={option}>
              <b>{index === 0 ? 'A' : 'B'}</b>{option}
            </button>
          ))}
        </section>
      </main>
    );
  }

  if (stage === 'learn') {
    return (
      <main className="academy-screen">
        <header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Problem definition - SCQA</span></header>
        <section className="academy-learn">
          <p className="overline">Meeting example</p>
          <h1>What Priya did in the sales dashboard call.</h1>
          <p>She did not ask for fields first. She asked what changed on Monday morning. That is problem definition in motion.</p>
          <div className="framework-grid">
            {academy.frameworks.map((framework, index) => (
              <article key={framework.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{framework.title}</h2>
                <p>{framework.body}</p>
              </article>
            ))}
          </div>
          <div className="academy-resources">
            {academy.resources.map((resource) => (
              <a href={resource.url} target="_blank" rel="noreferrer" key={resource.url}>
                <strong>{resource.title}</strong><span>{resource.body}</span>
              </a>
            ))}
          </div>
          <button className="primary-button" onClick={() => setStage('practice')}>Open web exercise <ChevronRight size={17} /></button>
        </section>
      </main>
    );
  }

  if (stage === 'practice') {
    return (
      <main className="academy-screen">
        <header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Web exercise - 3 scenarios</span></header>
        <section className="scenario-practice">
          <p className="overline">In-web exercise</p>
          <h1>Practise the move while the example is still fresh.</h1>
          {academy.practicePrompts.map((prompt, index) => (
            <label key={prompt}>
              <span>Scenario {index + 1}</span>
              <strong>{prompt}</strong>
              <textarea value={scenarios[index]} onChange={(event) => setScenarios((current) => current.map((value, i) => i === index ? event.target.value : value))} placeholder="Draft your response..." />
            </label>
          ))}
          <button className="primary-button" disabled={scenarios.some((value) => value.trim().length < 40)} onClick={() => setStage('take-home')}>
            Continue to take-home project
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="academy-screen">
      <header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Take-home application</span></header>
      <section className="take-home">
        <BrandMark />
        <p className="overline">Final learning task</p>
        <h1>Frame your first data project.</h1>
        <p>Before downloading or querying anything, write the problem definition and an SCQA outline for the Solstice loyalty investigation. This becomes the brief for your guided Python and Power BI project.</p>
        <textarea value={takeHome} onChange={(event) => setTakeHome(event.target.value)} placeholder={`Problem definition:\nDecision:\nUser:\nMetric:\nPeriod and comparison:\n\nSCQA:\nSituation:\nComplication:\nQuestion:\nAnswer hypothesis:`} />
        <button className="primary-button" disabled={takeHome.trim().length < 180} onClick={onComplete}>Complete learning case and start work</button>
      </section>
    </main>
  );
}

export default ProblemSolvingAcademy;
