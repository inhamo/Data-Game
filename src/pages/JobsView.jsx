import React from 'react';
import { ChevronRight, Lightbulb, MapPin, Star, Clock3, UserRound, BriefcaseBusiness } from 'lucide-react';
import { CompanyLogo, Avatar } from '../components';

function JobsView({ jobs: marketJobs, selected, setSelected, application, apply, savedJobs, toggleSaved }) {
  const approachedJob = marketJobs.find((job) => job.approached);

  return (
    <div className="job-browser">
      <div className="job-list">
        <div className="list-heading">
          <p className="overline">Recommended for you</p>
          <h1>Graduate opportunities</h1>
          <span><i className="market-live-dot" /> Live market · {marketJobs.length} roles now</span>
        </div>
        <div className="early-apply-tip">
          <Lightbulb size={18} />
          <div>
            <strong>Apply while the role is fresh.</strong>
            <span>Early applications are more likely to be reviewed before the shortlist fills.</span>
          </div>
        </div>
        {approachedJob && (
          <button className="recruiter-approach" onClick={() => setSelected(approachedJob)}>
            <Avatar text="AN" />
            <div>
              <strong>Dr. Amara Naidoo viewed your profile</strong>
              <span>Mosaic Health invited you to discuss its Graduate BI Analyst role.</span>
            </div>
            <ChevronRight size={17} />
          </button>
        )}
        {marketJobs.map((job) => (
          <button
            key={job.id}
            className={`job-row ${selected.id === job.id ? 'selected' : ''} ${job.isNew ? 'new-job' : ''}`}
            onClick={() => setSelected(job)}
          >
            <CompanyLogo job={job} />
            <div>
              <strong>{job.title}</strong>
              <span>{job.company}</span>
              <small><MapPin size={13} /> {job.location}</small>
              <small>{job.posted} · {job.applicants} applicants</small>
            </div>
            <span className="match">{job.isNew ? 'New' : `${job.match}% match`}</span>
          </button>
        ))}
      </div>
      <article className="job-detail">
        <div className="job-cover"><CompanyLogo job={selected} large /></div>
        <h1>{selected.title}</h1>
        <p className="company-line">{selected.company} · {selected.location}</p>
        <p>{selected.type}</p>
        <div className="job-actions">
          <button className="primary-button" disabled={application} onClick={() => apply(selected)}>
            {application ? application.status : selected.approached ? 'Respond to recruiter' : 'Easy Apply'}
          </button>
          <button
            className={`icon-button ${savedJobs.includes(selected.id) ? 'saved' : ''}`}
            onClick={() => toggleSaved(selected.id)}
            title="Save job"
          >
            <Star size={19} fill={savedJobs.includes(selected.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="job-facts">
          <span><Clock3 size={17} /> {selected.posted}</span>
          <span className="applicant-counter"><UserRound size={17} /> {selected.applicants} applicants</span>
          <span><BriefcaseBusiness size={17} /> {selected.salary}</span>
        </div>
        <div className="hiring-process">
          <strong>Hiring process</strong>
          <span>{selected.interviewRounds} {selected.interviewRounds === 1 ? 'interview' : 'interview rounds'} · technical assessment may apply</span>
        </div>
        <h2>About the role</h2>
        <p>{selected.description}</p>
        <h2>Skills</h2>
        <div className="skill-row">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      </article>
    </div>
  );
}

export default JobsView;