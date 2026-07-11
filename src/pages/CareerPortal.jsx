import React, { useState } from 'react';
import {
  Search, UserRound, CircleUserRound, GraduationCap, BriefcaseBusiness, FileText, Mail,
  Building2, ChevronRight, ShieldCheck
} from 'lucide-react';
import {
  JobsView,
  ApplicationsView,
  Mailbox,
  CV,
  ProfessionalProfile,
  CertificationWorkspace,
  Interview,
  Offer,
  WorkPortal,
  InterviewIntermission,
} from '.';
import { BrandMark, Avatar, NavButton } from '../components';
import { useLiveJobMarket } from '../hooks';
import { initials, relativeTime } from '../utils';
import { jobs } from '../data';

function CareerPortal({ profile, transcript }) {
  const [view, setView] = useState('cv');
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const liveJobs = useLiveJobMarket();
  const [applications, setApplications] = useState([]);
  const [mailId, setMailId] = useState(null);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [workRecord, setWorkRecord] = useState(null);
  const [transitionMessage, setTransitionMessage] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  const selectedApplication = applications.find((item) => item.job.id === selectedJob.id);

  function apply(job) {
    if (applications.some((item) => item.job.id === job.id)) return;
    const outcomes = { aurora: 'Interview requested', mosaic: 'Interview requested', northstar: 'Not selected' };
    setApplications((current) => [
      ...current,
      {
        job,
        status: outcomes[job.id] || 'Under review',
        date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
        round: 1,
      },
    ]);
    setSelectedJob(job);
    setView('applications');
  }

  function updateApplication(jobId, patch) {
    setApplications((current) =>
      current.map((item) => (item.job.id === jobId ? { ...item, ...patch } : item))
    );
  }

  function completeInterview(application, score) {
    updateApplication(application.job.id, { status: 'Interview submitted', score });
    setView('applications');
    window.setTimeout(() => {
      if (score < 6) {
        updateApplication(application.job.id, { status: 'Not selected after interview' });
      } else if ((application.round || 1) < application.job.interviewRounds) {
        updateApplication(application.job.id, { status: 'Round complete' });
        setTransitionMessage({
          jobId: application.job.id,
          company: application.job.company,
          nextRound: (application.round || 1) + 1,
          totalRounds: application.job.interviewRounds,
        });
      } else if (application.job.id === 'aurora') {
        updateApplication(application.job.id, { status: 'Offer received' });
      } else {
        updateApplication(application.job.id, { status: 'Not selected after final interview' });
      }
    }, 2500);
  }

  if (transitionMessage) {
    return (
      <InterviewIntermission
        details={transitionMessage}
        onContinue={() => {
          updateApplication(transitionMessage.jobId, { status: 'Interview requested', round: transitionMessage.nextRound });
          setTransitionMessage(null);
        }}
      />
    );
  }

  if (workOpen) {
    return (
      <WorkPortal
        profile={profile}
        certificate={certificate}
        workRecord={workRecord}
        onCertified={setCertificate}
        onWorkComplete={setWorkRecord}
        onExit={() => setWorkOpen(false)}
      />
    );
  }

  return (
    <main className="career-portal">
      <header className="career-topbar">
        <BrandMark compact />
        <div className="global-search"><Search size={18} /><input placeholder="Search jobs, companies, or skills" /></div>
        <button className="profile-button" onClick={() => setView('profile')}>
          <Avatar text={initials(profile.name)} /><span>{profile.name}</span>
        </button>
      </header>
      <div className="career-layout">
        <aside className="career-sidebar">
          <div className="identity">
            <Avatar text={initials(profile.name)} />
            <strong>{profile.name}</strong>
            <span>{profile.degree}</span>
            <small>{profile.university}</small>
            {certificate && (
              <div className="profile-certificate">
                <ShieldCheck size={17} />
                <span><b>{certificate.track} Ready</b><small>Verified · {certificate.score}%</small></span>
              </div>
            )}
          </div>
          <nav>
            <NavButton icon={UserRound} label="Build CV" active={view === 'cv'} onClick={() => setView('cv')} />
            <NavButton icon={CircleUserRound} label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
            <NavButton icon={GraduationCap} label="Certificates" active={view === 'certificates'} onClick={() => setView('certificates')} />
            <NavButton icon={BriefcaseBusiness} label="Find jobs" active={view === 'jobs'} onClick={() => setView('jobs')} />
            <NavButton icon={FileText} label="My applications" active={view === 'applications'} count={applications.length} onClick={() => setView('applications')} />
            <NavButton icon={Mail} label="Inbox" active={view === 'mail'} count={applications.length} onClick={() => setView('mail')} />
          </nav>
          {offerAccepted && (
            <button className="work-launcher" onClick={() => setWorkOpen(true)}>
              <Building2 size={19} />
              <span>Solstice workspace<small>Employee portal</small></span>
              <ChevronRight size={16} />
            </button>
          )}
        </aside>
        <section className="career-main">
          {view === 'jobs' && (
            <JobsView
              jobs={liveJobs}
              selected={liveJobs.find((job) => job.id === selectedJob.id) || selectedJob}
              setSelected={setSelectedJob}
              application={selectedApplication}
              apply={apply}
              savedJobs={savedJobs}
              toggleSaved={(jobId) =>
                setSavedJobs((current) =>
                  current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]
                )
              }
            />
          )}
          {view === 'applications' && (
            <ApplicationsView
              applications={applications}
              open={(item) => {
                setSelectedJob(item.job);
                setView(item.status === 'Interview requested' ? 'interview' : 'mail');
                setMailId(item.job.id);
              }}
            />
          )}
          {view === 'mail' && (
            <Mailbox
              applications={applications}
              selectedId={mailId}
              setSelectedId={setMailId}
              openInterview={() => setView('interview')}
              openOffer={() => setView('offer')}
            />
          )}
          {view === 'cv' && <CV profile={profile} transcript={transcript} certificate={certificate} workRecord={workRecord} />}
          {view === 'profile' && <ProfessionalProfile profile={profile} transcript={transcript} certificate={certificate} onFindJobs={() => setView('jobs')} />}
          {view === 'certificates' && <CertificationWorkspace profile={profile} companyCertificate={certificate} />}
          {view === 'interview' && (
            <Interview
              key={`${selectedApplication?.job.id}-${selectedApplication?.round || 1}`}
              application={selectedApplication}
              onSubmit={(score) => completeInterview(selectedApplication, score)}
            />
          )}
          {view === 'offer' && (
            <Offer
              profile={profile}
              accepted={offerAccepted}
              onAccept={() => { setOfferAccepted(true); updateApplication('aurora', { status: 'Offer accepted' }); }}
              onOpenWork={() => setWorkOpen(true)}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default CareerPortal;