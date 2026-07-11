import React, { useState } from 'react';
import { ArrowLeft, FileText, Check, ChevronRight } from 'lucide-react';
import { Avatar, WorkClock } from '../components';
import { initials } from '../utils';

function CaseZero({ profile, onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [opened, setOpened] = useState([]);
  const reports = [
    ['Weekly loyalty dashboard notes', 'Priya Osei', '8 months ago'],
    ['Filter behaviour after migration', 'Priya Osei', '7 months ago'],
    ['Customer Insights reporting guide', 'Deshawn Okafor', '3 months ago']
  ];

  function openReport(index) {
    if (!opened.includes(index)) setOpened((current) => [...current, index]);
  }

  return (
    <main className="case-zero">
      <header>
        <button onClick={onBack}><ArrowLeft size={18} /> Case desk</button>
        <div><span>CASE 00</span><strong>WELCOME ABOARD</strong></div>
        <WorkClock minutes={step * 35} />
      </header>
      <div className="case-workspace">
        <aside>
          <p className="overline">Objectives</p>
          {['Open your first ticket', 'Read the last three reports', 'Repair the chart filter'].map((item, index) => (
            <span className={step > index ? 'done' : step === index ? 'current' : ''} key={item}>
              {step > index ? <Check size={15} /> : index + 1}{item}
            </span>
          ))}
        </aside>
        <section>
          {step === 0 && (
            <div className="desk-scene">
              <div className="office-desk">
                <span className="case-laptop">SOLSTICE</span>
                <i className="notebook" /><i className="coffee" />
              </div>
              <div className="slack-card">
                <div>
                  <Avatar text="PS" />
                  <span><strong>Priya Shah</strong><small>Senior Analyst · 09:08</small></span>
                </div>
                <p>Morning, {profile.name.split(' ')[0]}. Easy first ticket: the loyalty dashboard’s region filter is broken.</p>
                <p>Before you touch it, read the last three reports. Someone already thought about this.</p>
                <button className="primary-button" onClick={() => setStep(1)}>Open ticket</button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="report-reader">
              <p className="overline">Ticket CI-104 · Required reading</p>
              <h1>Understand before changing</h1>
              <p>Priya attached three reports to the dashboard. Open all three before the editor unlocks.</p>
              <div>
                {reports.map((report, index) => (
                  <button className={opened.includes(index) ? 'read' : ''} onClick={() => openReport(index)} key={report[0]}>
                    <FileText size={22} />
                    <span><strong>{report[0]}</strong><small>{report[1]} · {report[2]}</small></span>
                    {opened.includes(index) ? <Check size={18} /> : <ChevronRight size={18} />}
                  </button>
                ))}
              </div>
              <button className="primary-button" disabled={opened.length < 3} onClick={() => setStep(2)}>Open dashboard editor</button>
              {opened.length >= 2 && <p className="ghost-hint">Two reports were written by Priya Osei. Her old Slack handle, @posei, still appears in the comments.</p>}
            </div>
          )}
          {step === 2 && (
            <div className="dashboard-fix">
              <div className="broken-chart">
                <header><strong>Loyalty members by region</strong><span>Region: Gauteng</span></header>
                <div className="bars">
                  <i style={{ height: '72%' }} /><i style={{ height: '48%' }} /><i style={{ height: '61%' }} /><i style={{ height: '35%' }} />
                </div>
                <small>Western Cape · Gauteng · KwaZulu-Natal · Eastern Cape</small>
              </div>
              <article>
                <p className="overline">Filter diagnosis</p>
                <h1>The filter label changes, but the chart does not.</h1>
                <p>Which repair respects the logic described in the old migration report?</p>
                <button onClick={onComplete}><b>A</b>Connect the region slicer to the migrated customer-region key, then validate totals.</button>
                <button onClick={() => setStep(1)}><b>B</b>Hide the filter and publish the national total.</button>
              </article>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default CaseZero;