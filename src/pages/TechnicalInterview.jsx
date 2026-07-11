import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { storyContent } from '../data';

function TechnicalInterview({ application, onSubmit }) {
  const tasks = storyContent.technicalInterviewTasks;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    if (!voiceOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(tasks[index].prompt);
    utterance.rate = 0.93;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [index, tasks, voiceOn]);

  function next() {
    const nextAnswers = [...answers, selected];
    if (index === tasks.length - 1) {
      const correct = nextAnswers.reduce((total, answer, i) => total + (answer === tasks[i].correct ? 1 : 0), 0);
      onSubmit(correct >= 4 ? 8 : correct);
    } else {
      setAnswers(nextAnswers);
      setSelected(null);
      setIndex((value) => value + 1);
    }
  }

  const task = tasks[index];
  return (
    <main className="technical-interview">
      <header>
        <div>
          <p className="overline">{application.job.company} · Technical round</p>
          <h1>SQL work sample</h1>
        </div>
        <button className="voice-button" onClick={() => setVoiceOn((value) => !value)}>
          {voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <span>Task {index + 1} of {tasks.length}</span>
      </header>
      <div className="technical-layout">
        <section className="table-preview">
          <div>
            <h2>customers</h2>
            <table>
              <thead><tr><th>customer_id</th><th>region</th><th>status</th></tr></thead>
              <tbody>
                <tr><td>C101</td><td>Gauteng</td><td>Active</td></tr>
                <tr><td>C102</td><td>Western Cape</td><td>Churned</td></tr>
                <tr><td>C103</td><td>Gauteng</td><td>Active</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2>orders</h2>
            <table>
              <thead><tr><th>order_id</th><th>customer_id</th><th>order_value</th></tr></thead>
              <tbody>
                <tr><td>O501</td><td>C101</td><td>2,400</td></tr>
                <tr><td>O502</td><td>C101</td><td>3,100</td></tr>
                <tr><td>O503</td><td>C102</td><td>800</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="sql-terminal">
          <div className="terminal-top"><span>SQL WORKBENCH</span><b>CONNECTED</b></div>
          <h2>{task.prompt}</h2>
          {task.options.map((query, option) => (
            <button className={selected === option ? 'selected' : ''} onClick={() => setSelected(option)} key={query}>
              <b>{option === 0 ? 'A' : 'B'}</b><code>{query}</code>
            </button>
          ))}
          <footer>
            <span>Think about table grain and join behaviour.</span>
            <button className="primary-button" disabled={selected === null} onClick={next}>
              {index === tasks.length - 1 ? 'Submit technical round' : 'Run and continue'}
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default TechnicalInterview;
