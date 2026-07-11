import React, { useState } from 'react';
import { ChevronRight, Download, GraduationCap, ShieldCheck, CircleUserRound } from 'lucide-react';

function ResultsPortal({ profile, transcript, onContinue }) {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return (
      <main className="uni-login">
        <section>
          <div className="university-seal"><GraduationCap size={34} /></div>
          <p className="overline">Student self-service</p>
          <h1>{profile.university || 'University Portal'}</h1>
          <p>Academic records and official results</p>
          <button className="primary-button" onClick={() => setOpened(true)}>
            View final results <ChevronRight size={18} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="academic-portal">
      <header>
        <div className="university-seal small"><GraduationCap size={22} /></div>
        <div><strong>{profile.university}</strong><span>Student Records Office</span></div>
        <button><CircleUserRound size={18} /> {profile.name}</button>
      </header>
      <div className="academic-shell">
        <aside>
          <strong>Student Self-Service</strong>
          <button className="active">Academic record</button>
          <button>Registration</button>
          <button>Documents</button>
        </aside>
        <article className="transcript">
          <div className="document-head">
            <div><p className="overline">Official academic record</p><h1>Statement of Results</h1></div>
            <button className="icon-text"><Download size={18} /> Download PDF</button>
          </div>
          <div className="student-record">
            <span>Student</span><strong>{profile.name}</strong>
            <span>Qualification</span><strong>{profile.degree}</strong>
            <span>Academic year</span><strong>2026</strong>
            <span>Status</span><strong className="success">Qualification completed</strong>
          </div>
          <table>
            <thead><tr><th>Module code</th><th>Module</th><th>Credits</th><th>Final mark</th><th>Result</th></tr></thead>
            <tbody>
              {transcript.modules.map((module) => (
                <tr key={module.code}>
                  <td>{module.code}</td>
                  <td>{module.name}</td>
                  <td>12</td>
                  <td>{module.mark}%</td>
                  <td className="success">Pass</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="result-summary">
            <div><span>Credits passed</span><strong>120 / 120</strong></div>
            <div><span>Weighted average</span><strong>{transcript.average}%</strong></div>
            <div><span>Decision</span><strong>{transcript.distinction ? 'Pass with distinction' : 'Degree awarded'}</strong></div>
          </div>
          <footer>
            <ShieldCheck size={19} />
            <span>This record was digitally issued by the Registrar's Office.</span>
            <button className="primary-button" onClick={onContinue}>Continue to graduation</button>
          </footer>
        </article>
      </div>
    </main>
  );
}

export default ResultsPortal;