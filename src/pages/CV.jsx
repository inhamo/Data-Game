import React from 'react';
import { Download } from 'lucide-react';
import { appPath, formatMinutes, downloadCvTemplate } from '../utils';

function CV({ profile, transcript, certificate, workRecord }) {
  return (
    <section className="cv-page">
      <div className="cv-actions">
        <div>
          <p className="overline">Step one · Build your CV</p>
          <h1>Your résumé</h1>
          <span className="auto-update-note">This career record keeps growing. Download an editable template now; export the final version when your story is complete.</span>
        </div>
        <button className="icon-text" onClick={() => downloadCvTemplate(profile)}>
          <Download size={18} /> Download editable template
        </button>
      </div>
      <div className="cv-builder-layout">
        <article className="cv-document">
          <header>
            <h1>{profile.name}</h1>
            <p>{certificate ? 'Junior Data Analyst' : 'Graduate Data Analyst'}</p>
            <span>Johannesburg · South Africa · {certificate ? 'employed' : 'available immediately'}</span>
          </header>
          <section>
            <h2>Profile</h2>
            <p>Analytical graduate with a foundation in {profile.favoriteModule}, SQL, reporting, and practical problem-solving. Interested in {profile.afterUni}.</p>
          </section>
          {certificate && (
            <section className="cv-new-entry">
              <h2>Experience</h2>
              <div className="cv-line">
                <div><strong>Junior Data Analyst · Solstice Retail Group</strong><span>Customer Intelligence</span></div>
                <time>August 2026 – Present</time>
              </div>
              <ul>
                <li>Passed the {certificate.track} technical readiness assessment with {certificate.score}%.</li>
                {workRecord && <li>Completed senior stakeholder onboarding and documented the agreed customer-metric investigation plan.</li>}
                {workRecord && <li>Logged {formatMinutes(workRecord.totalMinutes)} of verified onboarding and workplace activity.</li>}
              </ul>
            </section>
          )}
          <section>
            <h2>Education</h2>
            <div className="cv-line">
              <div><strong>{profile.degree}</strong><span>{profile.university}</span></div>
              <time>Completed 2026</time>
            </div>
            <p>Final weighted average: {transcript.average}%</p>
          </section>
          <section>
            <h2>Core skills</h2>
            <p>SQL · Power BI · Excel · Data cleaning · Data storytelling · Stakeholder communication</p>
          </section>
          {certificate && (
            <section>
              <h2>Certifications</h2>
              <div className="cv-line">
                <div><strong>Solstice {certificate.track} Technical Readiness</strong><span>Verified score: {certificate.score}% · Completed in {formatMinutes(certificate.minutes)}</span></div>
                <time>August 2026</time>
              </div>
            </section>
          )}
        </article>
        <aside className="cv-expert-rail">
          <img src={appPath('assets/people/senior-executive-coffee-full.webp')} alt="" />
          <p className="overline">Career expert lessons</p>
          <h2>Make the first scan count.</h2>
          <a href="https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/" target="_blank" rel="noreferrer">
            <strong>Write for fast readers</strong><span>Harvard: specific, active, fact-based language</span>
          </a>
          <a href="https://www.careers.ox.ac.uk/node/768221" target="_blank" rel="noreferrer">
            <strong>Build an ATS-readable CV</strong><span>Oxford: clarity, relevance, and tailoring</span>
          </a>
          <a href="https://careerservices.upenn.edu/channels/resume/" target="_blank" rel="noreferrer">
            <strong>Use a clean graduate format</strong><span>UPenn: one page, simple structure, visible evidence</span>
          </a>
          <div>
            <strong>Before applying</strong>
            <ul>
              <li>Tailor the profile to the role.</li>
              <li>Use action verbs and outcomes.</li>
              <li>Keep formatting simple.</li>
              <li>Name the final PDF professionally.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CV;