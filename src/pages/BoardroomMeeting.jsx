import React, { useMemo, useState, useEffect } from 'react';
import { ChevronRight, Pause, Play } from 'lucide-react';
import { SimMeetingRoom, WorkClock } from '../components';
import { characterBible, storyContent } from '../data';
import { cancelSpeech, profileTemplateValues, renderTemplate, speakAsCharacter, speechDelayFor } from '../utils';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function BoardroomMeeting({ profile, certificate, onComplete }) {
  const meeting = storyContent.firstBoardroomMeeting;
  const [scene, setScene] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [answerMode, setAnswerMode] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [introOpen, setIntroOpen] = useState(true);

  const dialogue = useMemo(() => meeting.dialogue.map((line) => ({
    ...line,
    text: renderTemplate(line.text, profileTemplateValues(profile)),
  })), [meeting.dialogue, profile]);
  const current = dialogue[Math.min(scene, dialogue.length - 1)];
  const currentCharacter = characterBible[current?.speakerKey];

  useEffect(() => {
    let cancelled = false;

    async function runMeeting() {
      if (introOpen) return;
      while (!cancelled && playing && scene < dialogue.length && !finished) {
        const line = dialogue[scene];
        setTranscript((currentTranscript) => (
          currentTranscript.some((item) => item.index === scene)
            ? currentTranscript
            : [...currentTranscript, { ...line, index: scene }]
        ));
        await speakAsCharacter(line.speakerKey, line.text, {
          cancel: true,
          conversational: true,
          rateMultiplier: line.pace === 'quick' ? 1.12 : 1.04,
          volume: 0.84,
        });
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
  }, [dialogue, finished, introOpen, playing, scene]);

  function finish(response) {
    onComplete({
      totalMinutes: certificate.minutes + 90,
      meetingMinutes: 90,
      response,
      firstMeetingTranscript: transcript,
    });
  }

  if (introOpen) {
    return (
      <main className="meeting-title-card">
        <div className="cinema-grid" />
        <div className="light-ribbon ribbon-one" />
        <div className="light-ribbon ribbon-two" />
        <section>
          <p className="overline">Solstice Retail Group presents</p>
          <h1>First Meeting</h1>
          <h2>Who is the imposter here?</h2>
          <p>Boardroom 4. Your certificate got you through the door. Now the room starts speaking in workplace language.</p>
          <button className="primary-button" onClick={() => setIntroOpen(false)}>
            Enter the meeting <ChevronRight size={17} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="boardroom">
      <header>
        <div><span className="live-dot" /> Solstice Retail Group · {meeting.title}</div>
        <WorkClock minutes={certificate.minutes + Math.min(scene, dialogue.length - 1) * 5} />
        <span>{meeting.room} · {meeting.time}</span>
      </header>
      <SimMeetingRoom
        current={current}
        currentCharacter={currentCharacter}
        peopleAsset="assets/people/meeting-overhead-team.webp"
        alt="Customer Insights team seated around the boardroom table"
      >
          <strong>{meeting.screenTitle}</strong>
          <span>{meeting.screenSubtitle}</span>
          <div className="metric-down">{finished ? 'YOUR TURN' : 'LIVE'}</div>
      </SimMeetingRoom>
      <aside className="meeting-panel">
        <div className="meeting-panel-head">
          <div>
            <p className="overline">Company welcome meeting</p>
            <h1>{current?.speaker}</h1>
          </div>
          <button className="icon-button" onClick={() => setPlaying((value) => !value)} title={playing ? 'Pause meeting audio' : 'Resume meeting audio'}>
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>
        </div>
        <blockquote>{current?.text}</blockquote>
        <div className="meeting-transcript">
          {transcript.map((line) => (
            <article className={line.index === scene ? 'active' : ''} key={line.index}>
              <strong>{line.speaker}</strong>
              <p>{line.text}</p>
            </article>
          ))}
        </div>
        {!finished ? (
          <p className="meeting-listening-note">The meeting is moving on its own. If you miss a line, the transcript keeps it.</p>
        ) : (
          <div className="meeting-response">
            <p>They are asking for fresh eyes. Choose a response or write your own.</p>
            {meeting.responseOptions.map((option) => (
              <button className={answerMode === option.id ? 'selected' : ''} onClick={() => setAnswerMode(option.id)} key={option.id}>
                {option.label}
              </button>
            ))}
            <button className={answerMode === 'type' ? 'selected' : ''} onClick={() => setAnswerMode('type')}>
              Type my own answer
            </button>
            {answerMode === 'type' && (
              <textarea autoFocus value={typedAnswer} onChange={(event) => setTypedAnswer(event.target.value)} placeholder="Explain what you would say in the room..." />
            )}
            <button className="primary-button" disabled={!answerMode || (answerMode === 'type' && typedAnswer.trim().length < 20)} onClick={() => finish(answerMode === 'type' ? typedAnswer : answerMode)}>
              Submit response and leave meeting <ChevronRight size={17} />
            </button>
          </div>
        )}
      </aside>
    </main>
  );
}

export default BoardroomMeeting;
