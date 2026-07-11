import React from 'react';
import { ChevronRight, Lightbulb, Keyboard, ExternalLink } from 'lucide-react';
import { Avatar } from '../components';
import { storyContent } from '../data';
import { appPath, initials, profileTemplateValues, renderTemplate } from '../utils';

function ProfessionalProfile({ profile, transcript, certificate, onFindJobs }) {
  const firstName = profile.name.split(' ')[0] || 'Graduate';
  const tips = storyContent.professionalProfileTips;

  return (
    <section className="professional-profile">
      <div className="profile-main">
        <div className="profile-cover"><span>DATA - ANALYSIS - DECISIONS</span></div>
        <header>
          <Avatar text={initials(profile.name)} />
          <div>
            <h1>{profile.name}</h1>
            <p>Graduate Data Analyst | SQL - Power BI - Data storytelling</p>
            <span>Johannesburg, South Africa - {profile.university}</span>
          </div>
          <button className="primary-button" onClick={onFindJobs}>Find jobs</button>
        </header>
        <div className="profile-open-banner">
          <Lightbulb size={20} />
          <div>
            <strong>{firstName}, always try to apply early.</strong>
            <span>Set alerts, prepare your core documents, and tailor the first strong application instead of waiting for the "perfect" one.</span>
          </div>
        </div>
        <article className="profile-about">
          <h2>About</h2>
          <p>
            Analytical {profile.degree} graduate interested in {profile.afterUni || 'turning data into useful decisions'}. Comfortable with SQL, reporting, and practical problem-solving, with a final weighted average of {transcript.average}%.
          </p>
        </article>
        <article>
          <h2>Education</h2>
          <strong>{profile.university}</strong>
          <p>{profile.degree} - Class of 2026</p>
        </article>
        {certificate && (
          <article>
            <h2>Licences & certifications</h2>
            <strong>{certificate.track} Technical Readiness</strong>
            <p>Verified assessment score: {certificate.score}%</p>
          </article>
        )}
      </div>
      <aside className="profile-coach">
        <div className="coach-heading">
          <img src={appPath('assets/people/executive-burgundy-gesturing.webp')} alt="" />
          <div><span>Profile coach</span><h2>Revamp every section</h2></div>
        </div>
        <p className="profile-score"><strong>{certificate ? 82 : 64}%</strong><span>Profile strength</span></p>
        <div className="profile-tip-list">
          {tips.map(({ title, text, tag }) => (
            <details key={title}>
              <summary><span>{tag}</span>{title}<ChevronRight size={16} /></summary>
              <p>{renderTemplate(text, profileTemplateValues(profile))}</p>
            </details>
          ))}
        </div>
        <a className="official-guide" href="https://www.linkedin.com/help/linkedin/answer/a554351/how-do-i-create-a-good-linkedin-profile-" target="_blank" rel="noreferrer">
          Open LinkedIn's official profile guide <ExternalLink size={15} />
        </a>
        <div className="typing-practice">
          <Keyboard size={25} />
          <div>
            <strong>Build workplace typing confidence</strong>
            <p>Practise accuracy first, then speed. This helps with coding, email, documentation, and timed assessments.</p>
            <a href="https://www.typing.com/en" target="_blank" rel="noreferrer">Start free lessons on Typing.com <ExternalLink size={14} /></a>
          </div>
        </div>
      </aside>
    </section>
  );
}

export default ProfessionalProfile;
