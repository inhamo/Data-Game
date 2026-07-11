import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Pause, Play } from 'lucide-react';
import { SimMeetingRoom, WorkClock } from '../components';
import { characterBible, storyContent } from '../data';
import { cancelSpeech, profileTemplateValues, renderTemplate, speakAsCharacter, speechDelayFor } from '../utils';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function DashboardScopingMeeting({ profile, certificate, workRecord, onComplete }) {
  const meeting = storyContent.dashboardScopingMeeting;
  const [introOpen, setIntroOpen] = useState(true);
  const [scene, setScene] = useState(0);
  const [afterScene, setAfterScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [metric, setMetric] = useState(meeting.playerCue?.defaultMetric || '');
  const [reason, setReason] = useState(meeting.playerCue?.defaultReason || '');
  const [notePinned, setNotePinned] = useState(false);

  const slackContext = useMemo(() => meeting.dialogue.filter((line) => line.mode === 'slack'), [meeting.dialogue]);
  const dialogue = useMemo(() => meeting.dialogue.filter((line) => line.mode !== 'slack').map((line) => ({
    ...line,
    text: renderTemplate(line.text, profileTemplateValues(profile)),
  })), [meeting.dialogue, profile]);
  const afterDialogue = meeting.afterPlayerDialogue || [];
  const afterCurrent = continuing && afterDialogue[afterScene] ? {
    ...afterDialogue[afterScene],
    text: renderTemplate(afterDialogue[afterScene].text, { playerMetric: metric, playerReason: reason }),
  } : null;
  const current = afterCurrent || dialogue[Math.min(scene, dialogue.length - 1)];
  const currentCharacter = characterBible[current?.speakerKey];
  const whiteboardMetric = notePinned ? meeting.pinnedNote?.title : metric;

  useEffect(() => {
    let cancelled = false;

    async function runMeeting() {
      if (introOpen) return;
      while (!cancelled && playing && scene < dialogue.length && !finished && !continuing) {
        const line = dialogue[scene];
        setTranscript((items) => (
          items.some((item) => item.index === scene)
            ? items
            : [...items, { ...line, index: scene }]
        ));
        if (line.spoken !== false && line.speakerKey !== 'system') {
          await speakAsCharacter(line.speakerKey, line.text, {
            cancel: true,
            conversational: true,
            emotion: line.emotion,
            rateMultiplier: line.pace === 'quick' ? 1.1 : 1.02,
            volume: 0.84,
          });
        } else {
          await wait(line.mode === 'slack' ? 900 : 1300);
        }
        if (cancelled || !playing) return;
        if (scene === dialogue.length - 1) {
          setFinished(true);
          return;
        }
        await wait(speechDelayFor(line.text));
        if (!cancelled) setScene((value) => value + 1);
      }
    }

    runMeeting();
    return () => {
      cancelled = true;
      cancelSpeech();
    };
  }, [continuing, dialogue, finished, introOpen, playing, scene]);

  useEffect(() => {
    let cancelled = false;
    async function runAfterPlayer() {
      if (!continuing || !playing || afterScene >= afterDialogue.length) return;
      const rawLine = afterDialogue[afterScene];
      const line = {
        ...rawLine,
        text: renderTemplate(rawLine.text, { playerMetric: metric, playerReason: reason }),
        spokenText: renderTemplate(rawLine.spokenText || rawLine.text, { playerMetric: metric, playerReason: reason }),
      };
      setTranscript((items) => (
        items.some((item) => item.index === `after-${afterScene}`)
          ? items
          : [...items, { ...line, index: `after-${afterScene}` }]
      ));
      if (line.speakerKey !== 'system' && line.spoken !== false) {
        await speakAsCharacter(line.speakerKey, line.text, {
          cancel: true,
          conversational: true,
          emotion: line.emotion,
          rateMultiplier: line.pace === 'quick' ? 1.1 : 1.02,
          volume: 0.84,
        });
      } else if (line.mode === 'system-readback') {
        await speakAsCharacter('system', line.spokenText, {
          cancel: true,
          conversational: true,
          rateMultiplier: 1.02,
          volume: 0.72,
          useFish: false,
        });
      } else {
        await wait(1100);
      }
      if (cancelled || !playing) return;
      if (afterScene === afterDialogue.length - 1) {
        finish({ metric, reason, notePinned });
        return;
      }
      await wait(speechDelayFor(line.text));
      if (!cancelled) setAfterScene((value) => value + 1);
    }

    runAfterPlayer();
    return () => {
      cancelled = true;
      cancelSpeech();
    };
  }, [afterScene, continuing, meeting.afterPlayerDialogue, metric, notePinned, playing, reason]);

  function finish(response) {
    onComplete({
      dashboardMeetingComplete: true,
      dashboardMeetingTranscript: transcript,
      dashboardMetric: response,
      dashboardPinnedNote: notePinned ? meeting.pinnedNote : null,
      totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 75,
    });
  }

  if (introOpen) {
    return (
      <main className="meeting-title-card dashboard-title-card">
        <div className="cinema-grid" />
        <div className="light-ribbon ribbon-one" />
        <div className="light-ribbon ribbon-two" />
        <section>
          <p className="overline">{meeting.intro.overline}</p>
          <h1>{meeting.intro.title}</h1>
          <h2>One trusted Monday view.</h2>
          <p>{meeting.intro.subtitle}</p>
          <button className="primary-button" onClick={() => setIntroOpen(false)}>
            Join the call <ChevronRight size={17} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="boardroom">
      <header>
        <div><span className="live-dot" /> Solstice Retail Group · {meeting.title}</div>
        <WorkClock minutes={(workRecord?.totalMinutes || certificate.minutes) + Math.min(scene, dialogue.length - 1) * 4} />
        <span>{meeting.room} · {meeting.time}</span>
      </header>
      <SimMeetingRoom
        current={current}
        currentCharacter={currentCharacter}
        peopleAsset="assets/people/meeting-side-presentation.webp"
        alt="Sales dashboard scoping call in a boardroom"
        variant="dashboard-call-scene video-call-scene"
      >
          <strong>{meeting.screenTitle}</strong>
          <span>{meeting.screenSubtitle}</span>
          <div className="dashboard-whiteboard">
            <b>{current?.mode === 'slack' ? 'Slack request' : 'Monday question'}</b>
            <p>{current?.mode === 'slack' ? 'Sales dashboard. Nothing fancy. Regional managers.' : 'What changes on Monday morning?'}</p>
            {whiteboardMetric && <em>{whiteboardMetric}</em>}
          </div>
      </SimMeetingRoom>
      <aside className="meeting-panel">
        <div className="meeting-panel-head">
          <div>
            <p className="overline">{current?.mode === 'stage' ? 'Scene note' : 'Voice call'}</p>
            <h1>{current?.speaker}</h1>
          </div>
          <button className="icon-button" onClick={() => setPlaying((value) => !value)} title={playing ? 'Pause meeting audio' : 'Resume meeting audio'}>
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
        </div>
        <blockquote className={`meeting-line ${current?.mode || 'call'}`}>
          {current?.time && <small>{current.time}</small>}
          {current?.text}
        </blockquote>
        {slackContext.length > 0 && transcript.length < 4 && (
          <div className="slack-context">
            <strong>Before the call</strong>
            {slackContext.map((line) => (
              <p key={`${line.speaker}-${line.time}-${line.text}`}>
                <span>{line.time} · {line.speaker.split(' ')[0]}</span>{line.text}
              </p>
            ))}
          </div>
        )}
        <div className="meeting-transcript">
          {transcript.map((line) => (
            <article className={`${line.index === scene || line.index === `after-${afterScene}` ? 'active' : ''} ${line.mode || 'call'}`} key={line.index}>
              <strong>{line.speaker}</strong>
              {line.time && <time>{line.time}</time>}
              <p>{line.text}</p>
            </article>
          ))}
        </div>
        {!finished ? (
          <p className="meeting-listening-note">This starts like real work: a message, a quick call, and one useful question that changes the whole build.</p>
        ) : (
          !continuing ? (
            <div className="meeting-response">
              <p>{meeting.playerCue?.systemLabel}</p>
              <label>
                {meeting.playerCue?.metricPrompt}
                <input value={metric} onChange={(event) => setMetric(event.target.value)} />
              </label>
              <label>
                {meeting.playerCue?.reasonPrompt}
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} />
              </label>
              <button className={notePinned ? 'selected' : ''} onClick={() => setNotePinned((value) => !value)}>
                {notePinned ? 'Pinned: Priya cigarette story' : 'Pin Priya cigarette story to notes'}
              </button>
              <button className="primary-button" disabled={metric.trim().length < 3 || reason.trim().length < 18} onClick={() => setContinuing(true)}>
                Let the system read it back <ChevronRight size={17} />
              </button>
            </div>
          ) : (
            <p className="meeting-listening-note">The call is finishing on its own. If you miss it, the transcript keeps it.</p>
          )
        )}
      </aside>
    </main>
  );
}

export default DashboardScopingMeeting;
