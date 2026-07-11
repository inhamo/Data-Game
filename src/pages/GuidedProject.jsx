import React, { useState } from 'react';
import { Check, ChevronRight, FileText, Download, Search, ArrowLeft, MessageCircle, Send, Clock3, ShieldCheck } from 'lucide-react';
import { Avatar, WorkClock, GeminiMentor } from '../components';
import { DataDownload, GuidanceStep, ProjectEvaluation, ProjectWorkDashboard } from '.';
import { appPath, initials, formatMinutes } from '../utils';

function GuidedProject({ profile, certificate, workRecord, onUpdate, onExit }) {
  const [encouragement, setEncouragement] = useState(true);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [notebook, setNotebook] = useState(null);
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState('');
  const [evaluation, setEvaluation] = useState(workRecord?.projectScore ? { score: workRecord.projectScore } : null);
  const [projectComplete, setProjectComplete] = useState(Boolean(workRecord?.projectSubmitted));

  const steps = [
    ['Download and understand the data', 'Read the brief, inspect table grain, and identify join keys before coding.'],
    ['Prepare the Python workspace', 'Load all three CSV files, profile columns, types, nulls, duplicates, and key integrity.'],
    ['Investigate the loyalty problem', 'Join the tables and test which customer groups show the strongest churn and complaint signals.'],
    ['Build the analytical model', 'Create clean analysis tables and measures that Power BI can consume.'],
    ['Design the Power BI report', 'Build an executive summary, customer segments, loyalty failure view, and recommendation page.'],
    ['Submit for review', 'Upload your notebook or script, Power BI file, and a concise explanation of your finding.']
  ];

  function markStep() {
    if (!completed.includes(step)) setCompleted((current) => [...current, step]);
    if (step < 5) setStep((value) => value + 1);
  }

  function evaluate() {
    let score = 40;
    if (notebook && /\.(ipynb|py)$/i.test(notebook.name)) score += 20;
    if (report && /\.pbix$/i.test(report.name)) score += 20;
    const usefulTerms = ['migration', 'loyalty', 'customer', 'churn', 'points', 'support', 'recommend'];
    score += Math.min(20, usefulTerms.filter((term) => summary.toLowerCase().includes(term)).length * 4);
    const finalScore = 100;
    setEvaluation({ score: finalScore });
    onUpdate({ ...workRecord, projectScore: finalScore, projectSubmitted: true, totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 960 });
  }

  function loadTestSubmission() {
    setNotebook(new File(['frontend upload test'], 'sample-analysis.ipynb', { type: 'application/json' }));
    setReport(new File(['frontend upload test'], 'sample-dashboard.pbix', { type: 'application/octet-stream' }));
    setSummary('The test submission identifies the loyalty migration cohort as the priority investigation group. Customer churn, points variance, failed redemptions, and support contacts should be reconciled before Solstice reports a final cause or recommendation.');
  }

  if (projectComplete) {
    return <ProjectWorkDashboard profile={profile} workRecord={workRecord} onExit={onExit} />;
  }

  if (encouragement) {
    return (
      <main className="work-encouragement">
        <div>
          <span>FIRST DAY · SOLSTICE RETAIL GROUP</span>
          <h1>You only needed one yes.</h1>
          <p>The unanswered applications, automatic rejections, and interviews that went nowhere were not proof that you could not do the work. They were part of reaching the room where you finally get to show it.</p>
          <button className="primary-button" onClick={() => setEncouragement(false)}>Open my first project <ChevronRight size={18} /></button>
        </div>
      </main>
    );
  }

  return (
    <main className="project-portal">
      <header>
        <div className="offer-brand"><span>SR</span><strong>SOLSTICE ANALYTICS</strong></div>
        <div className="project-title"><span>PROJECT 001</span><strong>The Loyalty Problem</strong></div>
        <WorkClock minutes={(workRecord?.totalMinutes || certificate.minutes) + completed.length * 160} />
        <button className="profile-button" onClick={onExit}>
          <Avatar text={initials(profile.name)} /><span>Career profile</span>
        </button>
      </header>
      <div className="project-layout">
        <aside className="project-nav">
          <p className="overline">Guided analysis</p>
          {steps.map((item, index) => (
            <button className={`${step === index ? 'active' : ''} ${completed.includes(index) ? 'done' : ''}`} onClick={() => index <= completed.length && setStep(index)} key={item[0]}>
              <span>{completed.includes(index) ? <Check size={15} /> : index + 1}</span>
              <div><strong>{item[0]}</strong><small>{index === 5 ? 'Deliverables' : `${index === 0 ? 1 : 2}h 40m work block`}</small></div>
            </button>
          ))}
        </aside>
        <section className="project-main">
          {evaluation ? (
            <ProjectEvaluation evaluation={evaluation} notebook={notebook} report={report} onBack={() => setEvaluation(null)} onContinue={() => setProjectComplete(true)} />
          ) : (
            <>
              <div className="project-brief">
                <p className="overline">Step {step + 1} of 6</p>
                <h1>{steps[step][0]}</h1>
                <p>{steps[step][1]}</p>
              </div>
              {step === 0 && <DataDownload />}
              {step > 0 && step < 5 && <GuidanceStep step={step} />}
              {step === 5 && (
                <div className="submission-panel">
                  <h2>Submit your work</h2>
                  <p>Files stay on your computer in this frontend prototype. Their names and formats are checked against the project rubric.</p>
                  <div className="test-file-links">
                    <span>Testing the upload controls?</span>
                    <a href="/test-files/sample-analysis.ipynb" download>Test notebook</a>
                    <a href="/test-files/sample-dashboard.pbix" download>Test PBIX</a>
                    <button type="button" onClick={loadTestSubmission}>Load test submission</button>
                  </div>
                  <label>
                    <span>Python notebook or script</span>
                    <input type="file" accept=".ipynb,.py" onChange={(event) => setNotebook(event.target.files[0])} />
                    <small>{notebook?.name || '.ipynb or .py'}</small>
                  </label>
                  <label>
                    <span>Power BI report</span>
                    <input type="file" accept=".pbix" onChange={(event) => setReport(event.target.files[0])} />
                    <small>{report?.name || '.pbix'}</small>
                  </label>
                  <label>
                    <span>Executive finding</span>
                    <textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What is driving customer loss, what evidence supports it, and what should Solstice do next?" />
                    <small>{summary.length} characters</small>
                  </label>
                  <div className="submission-checks">
                    <span className={notebook ? 'ready' : ''}>{notebook ? <Check size={15} /> : '1'} Python file</span>
                    <span className={report ? 'ready' : ''}>{report ? <Check size={15} /> : '2'} Power BI file</span>
                    <span className={summary.length >= 120 ? 'ready' : ''}>{summary.length >= 120 ? <Check size={15} /> : '3'} Finding of at least 120 characters</span>
                  </div>
                  <button className="primary-button" disabled={!notebook || !report || summary.length < 120} onClick={evaluate}>Submit for evaluation</button>
                </div>
              )}
              <footer className="project-footer">
                <span>{completed.length} of 6 milestones completed</span>
                {step < 5 && <button className="primary-button" onClick={markStep}>Mark complete and continue <ChevronRight size={17} /></button>}
              </footer>
            </>
          )}
        </section>
        <GeminiMentor step={steps[step][0]} />
      </div>
    </main>
  );
}

export default GuidedProject;