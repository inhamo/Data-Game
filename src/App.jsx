import React, { useState, useMemo } from 'react';
import {
  Welcome,
  Profile,
  FamilyChat,
  ResultsChat,
  ResultsPortal,
  Graduation,
  CareerPortal,
  WorkPortal,
} from './pages';
import { initialProfile, contacts } from './data';
import { makeTranscript } from './utils';

function App() {
  const workspaceProfile = {
    ...initialProfile,
    name: initialProfile.name || 'Innocent Nkosi',
    university: initialProfile.university || 'Plato Metropolitan University',
    degree: initialProfile.degree || 'BSc Data Science',
    favoriteModule: initialProfile.favoriteModule || 'Business Intelligence',
    worstModule: initialProfile.worstModule || 'Research Methods',
    afterUni: initialProfile.afterUni || 'Data Engineering',
    expectedCompany: initialProfile.expectedCompany || 'Solstice Retail Group',
  };
  const [chapter, setChapter] = useState('workspace');
  const [profile, setProfile] = useState(workspaceProfile);
  const [certificate, setCertificate] = useState({ track: 'Python', score: 82, minutes: 312 });
  const [workRecord, setWorkRecord] = useState({ totalMinutes: 312 });
  const [contact] = useState(() => contacts[Math.floor(Math.random() * contacts.length)]);
  const transcript = useMemo(() => makeTranscript(profile), [profile]);

  switch (chapter) {
    case 'workspace':
      return (
        <WorkPortal
          profile={profile}
          certificate={certificate}
          workRecord={workRecord}
          onCertified={setCertificate}
          onWorkComplete={setWorkRecord}
          onExit={() => setChapter('workspace')}
        />
      );
    case 'welcome':
      return <Welcome onContinue={() => setChapter('profile')} />;
    case 'profile':
      return <Profile profile={profile} setProfile={setProfile} onContinue={() => setChapter('family-chat')} />;
    case 'family-chat':
      return <FamilyChat contact={contact} profile={profile} setProfile={setProfile} onContinue={() => setChapter('results-chat')} />;
    case 'results-chat':
      return <ResultsChat profile={profile} onContinue={() => setChapter('results')} />;
    case 'results':
      return <ResultsPortal profile={profile} transcript={transcript} onContinue={() => setChapter('graduation')} />;
    case 'graduation':
      return <Graduation profile={profile} onContinue={() => setChapter('career')} />;
    case 'career':
      return <CareerPortal profile={profile} transcript={transcript} />;
    default:
      return null;
  }
}

export default App;
