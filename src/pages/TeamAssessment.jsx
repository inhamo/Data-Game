import React, { useState, useEffect } from 'react';
import { storyContent } from '../data';
import { appPath } from '../utils';

function TeamAssessment({ application, onSubmit }) {
  const games = storyContent.teamAssessmentGames;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const game = games[index];

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(game.prompt);
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [game.prompt]);

  function next() {
    const nextAnswers = [...answers, selected];
    if (index === games.length - 1) {
      const correct = nextAnswers.reduce((total, answer, i) => total + (answer === games[i].correct ? 1 : 0), 0);
      onSubmit(correct >= 4 ? 8 : correct);
    } else {
      setAnswers(nextAnswers);
      setSelected(null);
      setIndex((value) => value + 1);
    }
  }

  return (
    <main className="team-assessment">
      <header>
        <div>
          <p className="overline">{application.job.company} - Final team stage</p>
          <h1>Collaborative assessment</h1>
        </div>
        <span>Exercise {index + 1} of {games.length}</span>
      </header>
      <section className="assessment-room">
        <img className="final-panel-asset" src={appPath('assets/people/celebrating-team-table.webp')} alt="Several members of the hiring team seated around a table" />
        <div className="game-board"><span>{game.title}</span><strong>{String(index + 1).padStart(2, '0')}</strong></div>
      </section>
      <article className="game-question">
        <p className="overline">Team exercise</p>
        <h2>{game.prompt}</h2>
        {game.options.map((option, optionIndex) => (
          <button className={selected === optionIndex ? 'selected' : ''} onClick={() => setSelected(optionIndex)} key={option}>
            <b>{optionIndex === 0 ? 'A' : 'B'}</b>{option}
          </button>
        ))}
        <button className="primary-button" disabled={selected === null} onClick={next}>
          {index === games.length - 1 ? 'Finish team assessment' : 'Lock decision'}
        </button>
      </article>
    </main>
  );
}

export default TeamAssessment;
