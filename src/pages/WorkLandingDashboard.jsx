import React, { useState } from 'react';
import {
  Search, Bell, ChevronRight, MessageCircle, Mail, Library, Database, Star, ArrowLeft,
  BookOpen, User // or CircleUser if preferred
} from 'lucide-react';
import { Avatar, WorkClock } from '../components';
import {
  TeamsLearningChannel,
  ResearchBoard,
  CompanyDataLab,
} from '.';
import { appPath, initials } from '../utils';

function WorkLandingDashboard({ profile, certificate, workRecord, onMeeting = () => {}, onDashboardMeeting = () => {}, onLesson = () => {}, onProject = () => {}, onExit }) {
  const [tab, setTab] = useState('teams');
  const lessonReady = Boolean(workRecord?.dashboardMeetingComplete);
  const hasDashboardMeeting = Boolean(workRecord?.firstMeetingComplete) && !workRecord?.dashboardMeetingComplete;
  const hasNewMeeting = hasDashboardMeeting || (lessonReady && !workRecord?.lessonOneComplete);

  return (
    <main className="employee-dashboard">
      <header>
        <div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div>
        <div className="workspace-search"><Search size={17} /> Search Solstice</div>
        <WorkClock minutes={workRecord?.totalMinutes || certificate?.minutes || 0} />
        <button className="profile-button"><Avatar text={initials(profile.name)} /></button>
      </header>
      {hasNewMeeting && (
        <button className="workspace-notification" onClick={() => setTab('mail')}>
          <Bell size={18} />
          <span><strong>New invite</strong>{hasDashboardMeeting ? 'Zanele asked for “just a sales dashboard”. Priya wants you to observe the scoping call.' : 'Priya added the problem-definition onboarding notes.'}</span>
          <ChevronRight size={17} />
        </button>
      )}
      <div className="employee-shell">
        <aside>
          <button className={tab === 'teams' ? 'active' : ''} onClick={() => setTab('teams')}>
            <MessageCircle size={20} /><span>Teams</span>
          </button>
          <button className={tab === 'mail' ? 'active' : ''} onClick={() => setTab('mail')}>
            <Mail size={20} /><span>Mail</span>{hasNewMeeting && <b>1</b>}
          </button>
          <button className={tab === 'research' ? 'active' : ''} onClick={() => setTab('research')}>
            <Library size={20} /><span>Research</span>
          </button>
          <button className={tab === 'data' ? 'active' : ''} onClick={() => setTab('data')}>
            <Database size={20} /><span>Data</span>
          </button>
          <button className={tab === 'engagement' ? 'active' : ''} onClick={() => setTab('engagement')}>
            <Star size={20} /><span>Engagement</span>
          </button>
          <button onClick={onExit}><ArrowLeft size={20} /><span>Career</span></button>
        </aside>
        <section className="employee-content">
          {tab === 'teams' && <TeamsLearningChannel profile={profile} />}
          {tab === 'mail' && (
            <>
              <div className="employee-heading">
                <p className="overline">Company mail</p>
                <h1>Inbox</h1>
              </div>
              {hasDashboardMeeting && (
                <button className="meeting-email unread" onClick={onDashboardMeeting}>
                  <Avatar text="ZM" />
                  <div>
                    <strong>Zanele Mahlangu</strong>
                    <span>Invitation: What's actually on the dashboard?</span>
                    <small>Priya added you to a calm scoping call with Regional Sales.</small>
                  </div>
                  <time>11:15</time>
                  <ChevronRight size={18} />
                </button>
              )}
              {lessonReady && (
                <button className="meeting-email unread" onClick={onLesson}>
                  <Avatar text="PS" />
                  <div>
                    <strong>Priya Shah</strong>
                    <span>{workRecord?.lessonOneComplete ? 'Revisit: Problem definition onboarding' : 'Cc: Elena, Marcus, Tom - Invitation: Problem definition onboarding'}</span>
                    <small>{workRecord?.lessonOneComplete ? 'Your transcripts, research and whiteboards remain available.' : 'You are invited to observe how the team turns messy business language into a clear analysis problem.'}</small>
                  </div>
                  <time>10:04</time>
                  <ChevronRight size={18} />
                </button>
              )}
              <button className="meeting-email" onClick={onMeeting}>
                <Avatar text="PS" />
                <div>
                  <strong>Priya Shah</strong>
                  <span>Invitation: Customer Insights welcome meeting</span>
                  <small>Meet the team and hear about your first assignment.</small>
                </div>
                <time>09:12</time>
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {tab === 'research' && <ResearchBoard />}
          {tab === 'data' && <CompanyDataLab granted={Boolean(workRecord?.dataAccessGranted)} />}
          {tab === 'engagement' && (
            <>
              <div className="employee-heading">
                <p className="overline">Assigned work</p>
                <h1>Your active participation</h1>
                <p>Work starts as observation, then contribution, then ownership. Each card is something you were assigned to attend, think through, or deliver.</p>
              </div>
              <div className="assignment-board">
                <article className="complete">
                  <img src={appPath('assets/people/man-black-desktop.webp')} alt="" />
                  <span>Verified</span>
                  <strong>Tools readiness</strong>
                  <small>{certificate?.track || 'Python'} gate passed. You can enter the work floor.</small>
                </article>
                <article className={workRecord?.firstMeetingComplete ? 'complete' : 'active'}>
                  <img src={appPath('assets/people/meeting-overhead-team.webp')} alt="" />
                  <span>{workRecord?.firstMeetingComplete ? 'Completed' : 'Active'}</span>
                  <strong>Customer Insights briefing</strong>
                  <small>Sit in, listen for the real decision, then give one clear point.</small>
                </article>
                <article className={workRecord?.dashboardMeetingComplete ? 'complete' : hasDashboardMeeting ? 'active' : ''}>
                  <img src={appPath('assets/people/meeting-side-presentation.webp')} alt="" />
                  <span>{workRecord?.dashboardMeetingComplete ? 'Completed' : 'Assigned'}</span>
                  <strong>Sales dashboard scoping</strong>
                  <small>Observe Priya turn a vague dashboard request into a Monday decision.</small>
                </article>
                <article className={workRecord?.lessonOneComplete ? 'complete' : lessonReady ? 'active' : ''}>
                  <img src={appPath('assets/people/planner-corkboard.webp')} alt="" />
                  <span>{workRecord?.lessonOneComplete ? 'Completed' : 'Queued'}</span>
                  <strong>Chapter 1 learning task</strong>
                  <small>Problem definition, SCQA, in-web exercise, then take-home brief.</small>
                </article>
              </div>
              {workRecord?.lessonOneComplete && (
                <div className="engagement-actions">
                  <button onClick={onLesson}><BookOpen size={17} /> Revisit learning</button>
                  <button className="primary-button" onClick={onProject}>Open first project <ChevronRight size={17} /></button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default WorkLandingDashboard;
