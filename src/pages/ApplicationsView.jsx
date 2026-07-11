import React from 'react';
import { ChevronRight, Clock3, FileText } from 'lucide-react';
import { CompanyLogo, Status, Empty } from '../components';

function ApplicationsView({ applications, open }) {
  const betweenRounds = applications.find((item) => item.status === 'Interview requested' && (item.round || 1) > 1);
  const awaitingDecision = applications.find((item) => item.status === 'Interview submitted');

  return (
    <section className="applications-page">
      <p className="overline">Your search</p>
      <h1>My applications</h1>
      <p className="page-subtitle">
        Submitted means the employer has your application. It may remain under review, move to interview, or close without an offer.
      </p>
      {(betweenRounds || awaitingDecision) && (
        <div className="between-interviews">
          <Clock3 size={24} />
          <div>
            <strong>{betweenRounds ? `Round ${betweenRounds.round} is ready` : 'The hiring team is reviewing your interview'}</strong>
            <p>
              {betweenRounds
                ? 'Reaching another round means the team saw enough to keep learning about you. The next conversation may feel completely different: prepare again, but do not erase what already worked.'
                : 'Silence between interviews is normal. Teams compare notes, schedules, budgets, and other candidates. Waiting is not the same as rejection.'}
            </p>
          </div>
        </div>
      )}
      {applications.length === 0 ? (
        <Empty icon={FileText} title="No applications yet" text="Jobs you apply for will appear here." />
      ) : (
        <div className="application-table">
          <div className="table-labels"><span>Role</span><span>Submitted</span><span>Status</span><span /></div>
          {applications.map((item) => (
            <div className="application-row" key={item.job.id}>
              <div>
                <CompanyLogo job={item.job} />
                <span><strong>{item.job.title}</strong><small>{item.job.company}</small></span>
              </div>
              <span>{item.date}</span>
              <Status text={item.status} />
              <button onClick={() => open(item)}>View <ChevronRight size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ApplicationsView;