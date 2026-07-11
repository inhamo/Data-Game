import React, { useState } from 'react';
import {
  WorkLandingDashboard,
  BoardroomMeeting,
  ProblemDefinitionLesson,
  GuidedProject,
  ReadinessAssessment,
  FirstWorkEmail,
  MeetingReflection,
  DashboardScopingMeeting,
} from '.';

function WorkPortal({ profile, certificate, workRecord, onCertified, onWorkComplete, onExit }) {
  const [phase, setPhase] = useState(certificate ? 'first-email' : 'dashboard');

  if (!certificate) {
    return <ReadinessAssessment profile={profile} onCertified={onCertified} onExit={onExit} />;
  }

  if (phase === 'first-email') {
    return (
      <FirstWorkEmail
        profile={profile}
        certificate={certificate}
        onJoin={() => {
          onWorkComplete({ ...workRecord, firstEmailOpened: true });
          setPhase('meeting');
        }}
        onExit={() => setPhase('dashboard')}
      />
    );
  }

  if (phase === 'meeting') {
    return (
      <BoardroomMeeting
        profile={profile}
        certificate={certificate}
        onComplete={(meeting) => {
          onWorkComplete({ ...workRecord, ...meeting, firstMeetingComplete: true });
          setPhase('reflection');
        }}
      />
    );
  }

  if (phase === 'reflection') {
    return <MeetingReflection onContinue={() => setPhase('dashboard')} />;
  }

  if (phase === 'dashboard-scoping') {
    return (
      <DashboardScopingMeeting
        profile={profile}
        certificate={certificate}
        workRecord={workRecord}
        onComplete={(meeting) => {
          onWorkComplete({ ...workRecord, ...meeting });
          setPhase('dashboard');
        }}
      />
    );
  }

  if (phase === 'lesson-one') {
    return (
      <ProblemDefinitionLesson
        profile={profile}
        onComplete={(lesson) => {
          onWorkComplete({
            ...workRecord,
            ...lesson,
            lessonOneComplete: true,
            dataAccessGranted: true,
            totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 360,
          });
          setPhase('dashboard');
        }}
      />
    );
  }

  if (phase === 'project') {
    return (
      <GuidedProject
        profile={profile}
        certificate={certificate}
        workRecord={workRecord}
        onUpdate={onWorkComplete}
        onExit={onExit}
      />
    );
  }

  return (
    <WorkLandingDashboard
      profile={profile}
      certificate={certificate}
      workRecord={workRecord}
      onMeeting={() => setPhase('meeting')}
      onDashboardMeeting={() => setPhase('dashboard-scoping')}
      onLesson={() => setPhase('lesson-one')}
      onProject={() => setPhase('project')}
      onExit={onExit}
    />
  );
}

export default WorkPortal;
