import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

function ResearchBoard() {
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('plato-research-board') || '[]'); } catch { return []; }
  });
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const fieldNotes = [
    ['Lead with the answer', 'Monash University', 'SCQA creates shared context, tension, a decision question, and an answer-first recommendation.', 'https://www.monash.edu/student-academic-success/excel-at-writing/how-to-write/business-paper-using-the-minto-approach'],
    ['Issue trees turn problems into work', 'StrategyU', 'A useful branch becomes a hypothesis and workstream, not merely a heading.', 'https://strategyu.co/issue-tree/'],
    ['Separate symptoms from causes', 'Atlassian', 'A complaint is evidence of a symptom; root-cause work tests the conditions producing it.', 'https://www.atlassian.com/work-management/project-management/root-cause-analysis']
  ];

  function save() {
    if (!title.trim() || !note.trim()) return;
    const next = [{ title: title.trim(), note: note.trim(), created: new Date().toLocaleDateString() }, ...saved];
    setSaved(next);
    localStorage.setItem('plato-research-board', JSON.stringify(next));
    setTitle('');
    setNote('');
  }

  return (
    <div className="research-board">
      <div className="employee-heading">
        <p className="overline">Shared research</p>
        <h1>Research board</h1>
        <p>Read the team’s field notes, keep the original source attached, and save your own conclusions.</p>
      </div>
      <div className="research-columns">
        <section>
          <h2>Team field notes</h2>
          {fieldNotes.map(([itemTitle, source, summary, url]) => (
            <article key={itemTitle}>
              <span>{source}</span>
              <h3>{itemTitle}</h3>
              <p>{summary}</p>
              <a href={url} target="_blank" rel="noreferrer">Read source <ExternalLink size={14} /></a>
            </article>
          ))}
        </section>
        <section>
          <h2>My research</h2>
          <div className="research-composer">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Finding or useful idea" />
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Explain it in your own words and say when it is useful." />
            <button onClick={save} disabled={!title.trim() || !note.trim()}>Save to board</button>
          </div>
          {saved.length === 0 ? (
            <p className="empty-research">Your saved research will remain here.</p>
          ) : (
            saved.map((item) => (
              <article key={item.created + item.title}>
                <span>{item.created} · Personal note</span>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default ResearchBoard;