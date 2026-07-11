import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight, Check, ArrowLeft, BookOpen, StickyNote, Search, Archive, Library,
  ExternalLink, Send, Mic, Clock3, FileText, UserRound, Building2, MessageCircle
} from 'lucide-react';
import { Avatar } from '../components';
import { characterBible, npcSystem } from '../data';
import { appPath, speakAsCharacter, gradeMeceTree, gradeScqaResponse } from '../utils';
import { askAI } from '../services/ai';

function ProblemDefinitionLesson({ profile, onComplete }) {
  const stages = ["inbox", "brief", "check", "research", "calendar", "observe", "contribute", "solo", "grill", "request"];
  const labels = ["Brief", "Read", "Recall", "Research", "Schedule", "Observe", "Contribute", "Frame", "Defend", "Request"];

  const [stage, setStage] = useState("inbox");
  const [projectType, setProjectType] = useState("open");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("plato-work-notes") || "[]"); } catch { return []; }
  });
  const [noteSearch, setNoteSearch] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [noteTag, setNoteTag] = useState("Loyalty problem");
  const [glossary, setGlossary] = useState([]);
  const [wpm, setWpm] = useState(260);
  const [phraseMode, setPhraseMode] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [checkIndex, setCheckIndex] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);
  const [recallReflection, setRecallReflection] = useState("");
  const [openedResearch, setOpenedResearch] = useState([]);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [meetingTime, setMeetingTime] = useState("");
  const [observeScene, setObserveScene] = useState(0);
  const [meetingNumber, setMeetingNumber] = useState(0);
  const [meetingTranscript, setMeetingTranscript] = useState([]);
  const [boardNodes, setBoardNodes] = useState([]);
  const [meetingGenerating, setMeetingGenerating] = useState(false);
  const [meetingFinished, setMeetingFinished] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [contribution, setContribution] = useState("");
  const [contributionFeedback, setContributionFeedback] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [branches, setBranches] = useState(["", "", "", ""]);
  const [soloScore, setSoloScore] = useState(null);
  const [rubricScores, setRubricScores] = useState({ mece: null, scqa: null });
  const [grillMessages, setGrillMessages] = useState([
    { speaker: "Marcus", text: "You have four branches. Why should I believe pricing is only one possibility rather than the answer?" }
  ]);
  const [grillDraft, setGrillDraft] = useState("");
  const [resolution, setResolution] = useState(18);
  const [grillTime, setGrillTime] = useState(600);
  const [grillLoading, setGrillLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [requestFields, setRequestFields] = useState(["customer_id", "loyalty_status"]);
  const [dateRange, setDateRange] = useState("");
  const [requestStatus, setRequestStatus] = useState("");

  const intake = `Before an analyst opens Power BI, Python, or SQL, someone has to decide what problem the work is meant to solve. "Customers are less loyal" is a concern, not an analysis question. It does not tell us which customers, what loyalty means, when the change began, what comparison matters, or which business decision the answer will support. A useful problem statement names the decision owner, population, metric, comparison, period, and decision.

Think of scope as the fence around a football pitch. The fence does not tell the players who will win. It creates a field where the game can be played properly. In analysis, scope prevents a vague request from becoming an endless search through every available column. It also protects you from making claims the evidence cannot support.

MECE means mutually exclusive and collectively exhaustive. In plain language: put each cause in one sensible drawer, and make sure the important drawers are present. Imagine sorting laundry. If one pile is "dark clothes" and another is "shirts," the same black shirt belongs in both piles, so the groups overlap. If your piles are only "shirts" and "trousers," socks disappear, so the set is incomplete.

For a loyalty decline, pricing and perceived value, loyalty programme mechanics, service experience, and customer mix can be first-level branches. Each branch suggests different evidence. Pricing may require price and promotion history. Programme mechanics may require points earned, expiry, and redemption failures. Service experience may require delivery outcomes and support contacts. Customer mix may require acquisition channel, tenure, and region. The tree tells you what to test. It must not quietly announce the answer before testing begins.

SCQA gives the investigation a narrative. Situation states the stable context. Complication names what changed or created tension. Question defines the decision that now needs an answer. Answer leads with the current recommendation or best-supported finding. During early analysis, that answer remains a hypothesis. Seniority does not turn an assumption into evidence.

Good analysts ask, "Compared with what?" A decline from seventy to sixty percent means little without a metric definition, denominator, period, and comparable group. They also ask, "What would change our mind?" That creates falsifiable branches instead of convenient stories. The goal is not to prove pricing caused loyalty loss. The goal is to distinguish pricing from other plausible causes using evidence strong enough for a real decision.

In the meetings ahead, listen for how the team changes vague language into testable language. People will interrupt, remember related work, disagree about definitions, and update the shared board while speaking. Your first contribution will be small. Trust grows when your questions sharpen the team's thinking, not when you rush to sound certain.`;

  const keyTerms = ["problem statement", "stakeholder", "scope", "hypothesis", "mece", "metric"];
  const chunks = useMemo(() => {
    const words = intake.split(" ");
    if (!phraseMode) return words;
    const grouped = [];
    for (let index = 0; index < words.length; index += 3) grouped.push(words.slice(index, index + 3).join(" "));
    return grouped;
  }, [phraseMode]);

  const currentChunk = chunks[Math.min(wordIndex, chunks.length - 1)] || "";
  const currentTerm = keyTerms.find((term) => currentChunk.toLowerCase().replace(/[.,]/g, "").includes(term));

  const meetingScripts = [
    [
      { key: "priya", text: "Morning, everyone. Marcus, congratulations on surviving yesterday's pricing review. Before we start, Elena, how did the store pilot go?", board: "Context: loyalty concern raised" },
      { key: "elena", text: "Better than expected, although the support queue was rough. Here I need to decide whether we change the loyalty experience before the holiday campaign.", board: "Decision: change experience before holiday?" },
      { key: "marcus", text: "Pricing moved in the same period. I do not want a tidy loyalty report that ignores the commercial change happening beside it.", board: "Possible cause: pricing and value" },
      { key: "priya", text: "Then our first job is defining whose loyalty changed, how we measure it, compared with when, and what decision the result will unlock.", board: "Define: population · metric · comparison · period" }
    ],
    [
      { key: "marcus", text: "Quick detour: the campaign team found that their regions overlapped, so every total disagreed. That is the structure problem we must avoid here.", board: "Rule: one cause has one home" },
      { key: "priya", text: "Think of a wardrobe. If one drawer says shirts and another says black clothes, a black shirt lives in both. Our branches must not overlap like that.", board: "Mutually exclusive = no double counting" },
      { key: "elena", text: "But neat drawers are useless if complaints fall on the floor. We need enough branches to cover the credible story, not every imaginable story.", board: "Collectively exhaustive = credible coverage" },
      { key: "priya", text: "For now: pricing and value, programme mechanics, service experience, and customer mix. Each branch must imply evidence that could support or reject it.", board: "Tree: price · programme · service · mix" }
    ],
    [
      { key: "elena", text: "The migration record says customer identifiers changed and regional totals were restated twice. We cannot treat the old dashboard as unquestioned truth.", board: "Evidence risk: migrated customer IDs" },
      { key: "marcus", text: "Support tickets mention missing points and delayed deliveries. Pricing is possible, not proven. What evidence would separate those explanations?", board: "Test alternatives; do not prove a favourite" },
      { key: "priya", text: "Our answer begins with the decision, then shows the evidence. Until testing survives, call it a hypothesis. A confident voice is not a data source.", board: "SCQA: situation · complication · question · answer" },
      { key: "priya", text: `${profile.name.split(" ")[0]}, give us one additional service-experience cause. Keep it distinct; one point is enough for today.`, board: "Junior contribution invited" }
    ]
  ];

  const observeDialogue = meetingScripts[meetingNumber];
  const researchItems = [
    ["archive", "Q2 loyalty migration incident", "Old report · 8 months ago", "Customer identifiers changed during migration; regional totals were restated twice."],
    ["archive", "Support escalation themes", "Ticket archive · 6 months ago", "Free-text complaints mention missing points, failed redemptions, and delayed deliveries."],
    ["field", "Spotify: experimentation for trustworthy decisions", "External field note", "A valid result must be decision-ready, not merely positive.", "https://engineering.atspotify.com/2025/9/spotifys-experiments-with-learning-framework"],
    ["field", "Spotify: targeting and retention", "External field note", "Holdout evidence was used before a retention-focused messaging change was rolled out.", "https://engineering.atspotify.com/2023/6/experimenting-with-machine-learning-to-target-in-app-messaging"]
  ];

  const checks = [
    ["Which detail makes a vague concern testable?", "A named metric, population, comparison, and period", "A large data export", 0],
    ["What is scope for?", "Protecting a decision-relevant boundary", "Making the answer sound certain", 0],
    ["When does an answer stop being a hypothesis?", "When evidence survives appropriate testing", "When a senior repeats it", 0]
  ];

  useEffect(() => {
    if (stage !== "brief" || !playing) return;
    const timer = setInterval(() => setWordIndex((current) => {
      if (current >= chunks.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), Math.round((60000 / wpm) * (phraseMode ? 3 : 1)));
    return () => clearInterval(timer);
  }, [stage, playing, wpm, phraseMode, chunks.length]);

  useEffect(() => {
    if (stage !== "observe") return;
    const first = observeDialogue[0];
    setObserveScene(0);
    setMeetingTranscript([{ speaker: first.key, text: first.text }]);
    setBoardNodes([first.board]);
    setMeetingFinished(false);
    speakAsCharacter(first.key, first.text);
    return () => window.speechSynthesis?.cancel();
  }, [stage, meetingNumber]);

useEffect(() => {
  if (stage !== "observe" || meetingFinished || meetingGenerating) return;

  const advance = async () => {
    const nextIndex = observeScene + 1;
    if (nextIndex >= observeDialogue.length) {
      const transcript = meetingTranscript.map((item) => `${characterBible[item.speaker].name}: ${item.text}`).join("\n");
      saveNote(transcript, `Meeting ${meetingNumber + 1} transcript`);
      setMeetingFinished(true);
      setTimeout(() => move("contribute"), 1800);
      return;
    }
    const next = observeDialogue[nextIndex];
    setMeetingGenerating(true);
    let spokenText = next.text;
    try {
      // Use the new askAI function (fallback chain)
      const reply = await askAI({
        message: next.text,
        persona: characterBible[next.key].name,
        context: `You are speaking naturally in senior meeting ${meetingNumber + 1} of 3. Preserve the teaching point in the supplied line. Sound like a real colleague, use one to three sentences, and do not ask the junior for a final answer unless the supplied line does. Recent transcript:\n${meetingTranscript.slice(-3).map((item) => `${characterBible[item.speaker].name}: ${item.text}`).join("\n")}`
      });
      if (reply && reply.length < 480) spokenText = reply;
    } catch {
      // fallback to hardcoded text if all AI fails
      spokenText = next.text;
    }
    setObserveScene(nextIndex);
    setMeetingTranscript((current) => [...current, { speaker: next.key, text: spokenText }]);
    setBoardNodes((current) => [...current, next.board]);
    // Wait for speech to finish before allowing next line
    await speakAsCharacter(next.key, spokenText);
    setMeetingGenerating(false);
  };

  // Small delay to let React settle, then start the next line
  const timer = setTimeout(() => {
    if (!meetingFinished && !meetingGenerating) {
      advance();
    }
  }, 800);

  return () => clearTimeout(timer);
}, [stage, observeScene, meetingNumber, meetingFinished, meetingGenerating, meetingTranscript]);

  useEffect(() => {
    if (stage !== "grill" || resolution >= 80 || grillTime <= 0) return;
    const timer = setInterval(() => setGrillTime((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(timer);
  }, [stage, resolution, grillTime]);

  function move(next) { setStage(next); }

  function saveNote(text = noteDraft, tag = noteTag) {
    if (!text.trim()) return;
    const next = [...notes, { id: Date.now(), text: text.trim(), tag, created: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }];
    setNotes(next);
    localStorage.setItem("plato-work-notes", JSON.stringify(next));
    setNoteDraft("");
  }

  function pinTerm(term) {
    if (!term || glossary.includes(term)) return;
    setGlossary((current) => [...current, term]);
    saveNote(`${term}: pinned during the problem-definition intake.`, "Glossary");
  }

  function answerCheck(option) {
    const next = checkIndex + 1;
    if (next >= checks.length) setCheckComplete(true);
    else setCheckIndex(next);
  }

  function assessContribution() {
    const lower = contribution.toLowerCase();
    const strong = ["communication", "awareness", "engagement", "expectation"].some((term) => lower.includes(term));
    setContributionFeedback(strong
      ? "Priya: That fits under customer experience without duplicating pricing or service operations. Add it."
      : "Priya: Useful instinct. Name the distinct cause, then check whether it overlaps an existing branch."
    );
  }

  function finishContribution() {
    const nextContributions = [...contributions, contribution.trim()];
    setContributions(nextContributions);
    saveNote(`My contribution: ${contribution.trim()}`, `Meeting ${meetingNumber + 1}`);
    if (meetingNumber < 2) {
      setMeetingNumber((current) => current + 1);
      setMeetingTime("");
      setContribution("");
      setContributionFeedback("");
      move("calendar");
    } else {
      move("solo");
    }
  }

  function assessSolo() {
    const mece = gradeMeceTree(branches);
    const definitionTerms = ["customer", "retention", "gauteng", "july", "compare", "loyalty"].filter((term) => problemStatement.toLowerCase().includes(term)).length;
    const scopeBonus = Math.min(20, definitionTerms * 4);
    const score = Math.min(100, Math.round((mece.total / mece.maximum) * 80) + scopeBonus);
    setRubricScores((current) => ({ ...current, mece }));
    setSoloScore(score);
    setResolution(12 + mece.total * 8);
  }

  async function sendGrill() {
    if (grillDraft.trim().length < 12 || grillLoading) return;
    const answer = grillDraft.trim();
    const scqa = gradeScqaResponse(answer);
    setRubricScores((current) => ({ ...current, scqa }));
    const meceStrength = rubricScores.mece?.total >= 4 ? 1.45 : 1;
    const gain = Math.max(5, Math.round((scqa.total / scqa.maximum) * 24 * meceStrength));
    const nextResolution = Math.min(100, resolution + gain);
    setGrillMessages((current) => [...current, { speaker: "You", text: answer }]);
    setGrillDraft("");
    setGrillLoading(true);
    setResolution(nextResolution);
    if (nextResolution >= 80) {
      setGrillMessages((current) => [...current, { speaker: "Priya", text: "That holds. The scope is explicit, the alternatives are testable, and you have said what the analysis will not claim." }]);
      setGrillLoading(false);
      return;
    }
    const targetPersona = scqa.criteria.support === 0 ? "Elena" : /price|pricing/.test(answer.toLowerCase()) ? "Marcus" : "Priya";
    const fallbackByPersona = {
      Elena: "How do you know that? Name the source behind the weakest claim.",
      Marcus: "Sure, but isn’t that just pricing wearing a different hat?",
      Priya: scqa.criteria.answerFirst < 2 ? "What is your answer? Start there, then support it." : "Which part of the structure would fail if your main hypothesis is wrong?"
    };
    const fallback = fallbackByPersona[targetPersona];
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: answer,
          persona: targetPersona,
          context: `Ten-minute problem-definition review. Keep this rubric private and never quote scores.
MECE: ${JSON.stringify(rubricScores.mece)}
Latest SCQA: ${JSON.stringify(scqa)}
Board clarity: ${nextResolution}%. Time remaining: ${grillTime} seconds.
Recent exchange: ${grillMessages.slice(-4).map((item) => `${item.speaker}: ${item.text}`).join("\n")}
Ask exactly one concise, character-specific question targeting the weakest unresolved gap.`
        })
      });
      const payload = await response.json();
      setGrillMessages((current) => [...current, { speaker: targetPersona, text: payload.reply || fallback }]);
    } catch {
      setGrillMessages((current) => [...current, { speaker: targetPersona, text: fallback }]);
    } finally { setGrillLoading(false); }
  }

  function startDictation() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setGrillMessages((current) => [...current, { speaker: "System", text: "Live dictation is unavailable in this browser. You can type the same response." }]);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-ZA";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(" ");
      setGrillDraft(transcript);
    };
    recognition.start();
  }

  function submitRequest() {
    if (!dateRange) { setRequestStatus("Tom: This could become a 40 million-row pull. Give me a date range first."); return; }
    if (requestFields.length < 4) { setRequestStatus("Tom: I can send that, but you will need order outcome and support category to test the branches you defended."); return; }
    setRequestStatus("Tom: Scoped and approved. I’ll send the three extracts with the orphaned keys preserved so you can audit them.");
  }

  const stageIndex = stages.indexOf(stage);
  const check = checks[checkIndex];

  return (
    <main className="lesson-job">
      <header>
        <div className="offer-brand"><span>SR</span><strong>SOLSTICE · CUSTOMER INSIGHTS</strong></div>
        <div className="lesson-stage-name"><span>Week one</span><strong>Customer loyalty investigation</strong></div>
        <button className={notesOpen ? "active" : ""} onClick={() => setNotesOpen((value) => !value)}>
          <StickyNote size={18} /> Notes <b>{notes.length}</b>
        </button>
      </header>
      <div className={`lesson-job-shell ${notesOpen ? "notes-visible" : ""}`}>
        <aside className="lesson-progress">
          {labels.map((label, index) => (
            <span className={index < stageIndex ? "done" : index === stageIndex ? "current" : ""} key={label}>
              {index < stageIndex ? <Check size={14} /> : index + 1}
              <b>{label}</b>
            </span>
          ))}
        </aside>
        <section className="lesson-work">
          {stage === "inbox" && (
            <div className="lesson-inbox">
              <div className="lesson-email-head">
                <Avatar text="PS" />
                <div><strong>Priya Shah</strong><span>Senior Analyst · 10:04</span></div>
              </div>
              <h1>Your first week: choose where to contribute</h1>
              <p>Hi {profile.name.split(" ")[0]},</p>
              <p>I’ve put the current Customer Insights work below. The open work needs someone to shape it. The closed work already has a defined output. Pick the kind of responsibility you want to take into the stakeholder meeting.</p>
              <div className="project-choice">
                <button className={projectType === "open" ? "selected" : ""} onClick={() => setProjectType("open")}>
                  <span>Open project</span>
                  <strong>Customers seem less loyal</strong>
                  <p>Choose the angle, definition, evidence, and depth. Bring whatever you think the decision needs.</p>
                </button>
                <button className={projectType === "closed" ? "selected" : ""} onClick={() => setProjectType("closed")}>
                  <span>Closed project</span>
                  <strong>Q1 return rate by region</strong>
                  <p>Deliver a fixed regional table and commentary by Friday. The metric and period are already agreed.</p>
                </button>
              </div>
              <button className="primary-button" onClick={() => move("brief")}>
                Accept {projectType} work <ChevronRight size={17} />
              </button>
            </div>
          )}

          {stage === "brief" && (
            <div className="speed-reader progressive-reader">
              <p className="overline">Preparation note · focused reading</p>
              <h1>Learn to frame the work before touching the data.</h1>
              <div className="progressive-reading">
                {chunks.slice(0, wordIndex + 1).map((chunk, index) => (
                  <span className={index === wordIndex ? "active" : ""} key={`${chunk}-${index}`}>{chunk} </span>
                ))}
              </div>
              <div className="reader-progress"><span style={{ width: `${((wordIndex + 1) / chunks.length) * 100}%` }} /></div>
              <div className="reader-controls">
                <button onClick={() => setWordIndex((value) => Math.max(0, value - (phraseMode ? 4 : 12)))}>
                  <ArrowLeft size={17} /> Back
                </button>
                <button className="play-control" onClick={() => setPlaying((value) => !value)}>
                  {playing ? "Pause" : "Read"}
                </button>
                <label>
                  <span>{wpm} wpm</span>
                  <input type="range" min="150" max="420" step="10" value={wpm} onChange={(event) => setWpm(Number(event.target.value))} />
                </label>
                <label className="chunk-toggle">
                  <input type="checkbox" checked={phraseMode} onChange={(event) => { setPhraseMode(event.target.checked); setWordIndex(0); }} />
                  Phrase chunks
                </label>
              </div>
              {currentTerm && (
                <button className="pin-term" onClick={() => pinTerm(currentTerm)}>
                  <BookOpen size={16} /> Pin “{currentTerm}” to glossary
                </button>
              )}
              <div className="glossary-strip">
                {glossary.map((term) => <span key={term}>{term}</span>)}
              </div>
              <button className="primary-button" disabled={wordIndex < chunks.length - 1} onClick={() => move("check")}>
                Continue to recall
              </button>
            </div>
          )}

          {stage === "check" && (
            <div className="lesson-check">
              {!checkComplete ? (
                <>
                  <p className="overline">Quick recall · {checkIndex + 1} of {checks.length}</p>
                  <h1>{check[0]}</h1>
                  {[check[1], check[2]].map((option, index) => (
                    <button onClick={() => answerCheck(index)} key={option}>
                      <b>{index === 0 ? "A" : "B"}</b>{option}
                    </button>
                  ))}
                </>
              ) : (
                <div className="written-recall">
                  <p className="overline">Written recall · saved to your notes</p>
                  <h1>Explain MECE without using textbook language.</h1>
                  <p>Use a wardrobe, kitchen drawer, or grocery aisle analogy. Then say how the structure changes the data you would request.</p>
                  <textarea value={recallReflection} onChange={(event) => setRecallReflection(event.target.value)} placeholder="MECE is like... In an analysis this means I would..." />
                  <button className="primary-button" disabled={recallReflection.trim().length < 80} onClick={() => { saveNote(recallReflection, "MECE recall"); move("research"); }}>
                    Save reflection and research
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === "research" && (
            <div className="research-desk">
              <div className="vague-ask">
                <Avatar text="EC" />
                <div><strong>Elena Cho · Customer Operations</strong><p>Customers seem unhappy since the loyalty changes. Can you look into it?</p></div>
              </div>
              <h1>Look for context before booking the room.</h1>
              <p>Open at least two records. Past work may reveal definitions, system changes, and assumptions hidden inside the request.</p>
              <div className="research-grid">
                {researchItems.map((item, index) => (
                  <article className={openedResearch.includes(index) ? "opened" : ""} key={item[1]}>
                    <span>{item[0] === "archive" ? <Archive size={18} /> : <Library size={18} />}{item[2]}</span>
                    <h2>{item[1]}</h2>
                    <p>{item[3]}</p>
                    {item[4] ? (
                      <a href={item[4]} target="_blank" rel="noreferrer" onClick={() => setOpenedResearch((current) => current.includes(index) ? current : [...current, index])}>
                        Read original source <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button onClick={() => { setSelectedResearch(index); setOpenedResearch((current) => current.includes(index) ? current : [...current, index]); }}>
                        Open record
                      </button>
                    )}
                  </article>
                ))}
              </div>
              {selectedResearch !== null && (
                <section className="record-detail">
                  <header>
                    <div><span>Solstice records · read only</span><h2>{researchItems[selectedResearch][1]}</h2></div>
                    <button onClick={() => setSelectedResearch(null)}>×</button>
                  </header>
                  {selectedResearch === 0 ? (
                    <>
                      <p>The CRM migration replaced 3.8% of customer identifiers. Two regions briefly counted merged profiles as new customers, and regional totals were restated twice.</p>
                      <strong>Analyst implication</strong>
                      <p>Preserve orphaned keys, reconcile customer counts, and test whether the apparent retention decline survives the identity change.</p>
                    </>
                  ) : (
                    <>
                      <p>A coded sample of 1,240 support tickets found missing points, redemption failures at checkout, and deliveries arriving after campaign promises.</p>
                      <strong>Analyst implication</strong>
                      <p>Complaints are signals rather than prevalence estimates. They justify separate tests for programme mechanics and service experience.</p>
                    </>
                  )}
                </section>
              )}
              <div className="mece-source-strip">
                <strong>MECE field guide</strong>
                <a href="https://strategyu.co/issue-tree/" target="_blank" rel="noreferrer">Issue trees in practice <ExternalLink size={13} /></a>
                <a href="https://www.atlassian.com/work-management/project-management/root-cause-analysis" target="_blank" rel="noreferrer">Root-cause analysis <ExternalLink size={13} /></a>
                <a href="https://www.monash.edu/student-academic-success/excel-at-writing/how-to-write/business-paper-using-the-minto-approach" target="_blank" rel="noreferrer">SCQA and Minto <ExternalLink size={13} /></a>
              </div>
              <button className="primary-button" disabled={openedResearch.length < 2} onClick={() => move("calendar")}>
                Schedule senior meeting 1 of 3
              </button>
            </div>
          )}

          {stage === "calendar" && (
            <div className="lesson-calendar">
              <p className="overline">Solstice calendar · Senior meeting {meetingNumber + 1} of 3</p>
              <h1>{["Clarify the decision", "Build the issue tree", "Challenge the evidence"][meetingNumber]}</h1>
              <p>You are a junior attendee. The meeting runs live; listen now and use the saved transcript afterward.</p>
              <div className="calendar-slots">
                {["09:30", "11:00", "14:30"].map((time) => (
                  <button className={meetingTime === time ? "selected" : ""} onClick={() => setMeetingTime(time === "09:30" ? "11:00" : time)} key={time}>
                    <strong>{time}</strong>
                    <span>{time === "09:30" ? "Priya proposes 11:00" : "Available · 30 min"}</span>
                  </button>
                ))}
              </div>
              {meetingTime && (
                <div className="calendar-confirm">
                  <Check size={20} />
                  <span><strong>Accepted by Priya, Elena and Marcus</strong><small>Boardroom 4 · {meetingTime}</small></span>
                </div>
              )}
              <button className="primary-button" disabled={!meetingTime} onClick={() => move("observe")}>
                Join meeting
              </button>
            </div>
          )}

          {stage === "observe" && (
            <div className="observed-meeting autonomous-meeting">
              <div className="meeting-status"><span className="live-dot" /> Senior meeting {meetingNumber + 1} of 3 · live</div>
              <div className="meeting-live-grid">
                <div className="meeting-visual">
                  <img src={appPath("assets/people/meeting-side-presentation.webp")} alt="Senior team discussing an issue tree at a whiteboard" />
                  <div className="whiteboard-live">
                    <strong>Why is loyalty declining?</strong>
                    {boardNodes.map((node, index) => (
                      <span className={index === boardNodes.length - 1 ? "writing" : ""} key={`${node}-${index}`}>{node}</span>
                    ))}
                  </div>
                </div>
                <div className="live-transcript">
                  <header><strong>Live transcript</strong><span>Saved automatically</span></header>
                  {meetingTranscript.map((item, index) => (
                    <article className={index === meetingTranscript.length - 1 ? "speaking" : ""} key={index}>
                      <img src={appPath(characterBible[item.speaker].portrait)} alt="" />
                      <div><strong>{characterBible[item.speaker].name}</strong><p>{item.text}</p></div>
                    </article>
                  ))}
                  {meetingGenerating && <p className="meeting-thinking">The discussion continues…</p>}
                </div>
              </div>
              <p className="meeting-no-controls">
                {meetingFinished ? "The team is handing the whiteboard to you." : "This is a live meeting. Keep listening; you can revisit the transcript in Notes."}
              </p>
            </div>
          )}

          {stage === "contribute" && (
            <div className="whiteboard-contribution">
              <p className="overline">Meeting {meetingNumber + 1} · your contribution</p>
              <h1>One useful point is enough.</h1>
              <p>As a new analyst, you have a small window to contribute. Add one distinct cause beneath <strong>Service experience</strong>; the team will place it on the shared board.</p>
              <div className="tree-editor">
                <span>Service experience</span>
                {boardNodes.slice(-3).map((node) => <span key={node}>{node}</span>)}
                <label>
                  <input value={contribution} onChange={(event) => setContribution(event.target.value)} placeholder="Your one point…" />
                </label>
                {contributionFeedback && <span className="player-board-point">{contribution}</span>}
              </div>
              <button className="primary-button" disabled={contribution.trim().length < 5 || Boolean(contributionFeedback)} onClick={assessContribution}>
                Add to shared board
              </button>
              {contributionFeedback && <div className="in-fiction-feedback">{contributionFeedback}</div>}
              {contributionFeedback && (
                <button className="text-button" onClick={finishContribution}>
                  {meetingNumber < 2 ? `Return to work and await meeting ${meetingNumber + 2}` : "Open my solo work brief"} <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}

          {stage === "solo" && (
            <div className="solo-framing">
              <p className="overline">Private working document</p>
              <h1>Frame the loyalty investigation.</h1>
              <label>
                Problem statement
                <textarea value={problemStatement} onChange={(event) => setProblemStatement(event.target.value)} placeholder="Among which customers, which metric changed, over what period, compared with what, and for which decision?" />
              </label>
              <div className="branch-editor">
                {branches.map((branch, index) => (
                  <label key={index}>
                    <span>Branch {index + 1}</span>
                    <input value={branch} onChange={(event) => setBranches((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder={["Pricing and perceived value", "Loyalty programme mechanics", "Service experience", "Customer and channel mix"][index]} />
                  </label>
                ))}
              </div>
              <button className="primary-button" onClick={assessSolo}>Check structure</button>
              {soloScore !== null && (
                <div className={`structure-score ${rubricScores.mece?.pass ? "passed" : ""}`}>
                  <strong>{soloScore}%</strong>
                  <span>{rubricScores.mece?.pass ? "The structure is ready to defend." : `The structure still has a ${rubricScores.mece?.weakest || "scope"} problem.`}</span>
                </div>
              )}
              {rubricScores.mece?.pass && (
                <button className="text-button" onClick={() => move("grill")}>
                  Lead the review meeting <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}

          {stage === "grill" && (
            <div className="grill-room">
              <header>
                <div><span className="live-dot" /> Problem definition review</div>
                <time>{String(Math.floor(grillTime / 60)).padStart(2, "0")}:{String(grillTime % 60).padStart(2, "0")}</time>
              </header>
              <div className="grill-layout">
                <div className="grill-people">
                  <img src={appPath("assets/people/meeting-overhead-team.webp")} alt="Senior team around the boardroom table" />
                  <div className="resolution-meter">
                    <span style={{ width: `${resolution}%` }} />
                    <strong>Board clarity · {resolution}%</strong>
                  </div>
                </div>
                <div className="grill-chat">
                  {grillMessages.map((message, index) => (
                    <p className={message.speaker === "You" ? "mine" : ""} key={index}>
                      <strong>{message.speaker}</strong>{message.text}
                    </p>
                  ))}
                  {grillLoading && <p><strong>Boardroom</strong>Someone is considering the structure…</p>}
                  {resolution < 80 && grillTime > 0 && (
                    <div className="grill-compose">
                      <textarea value={grillDraft} onChange={(event) => setGrillDraft(event.target.value)} placeholder="Lead with your answer, then defend it with scope, evidence, and a testable comparison…" />
                      <button className={listening ? "listening" : ""} onClick={startDictation} title="Speak response"><Mic size={17} /></button>
                      <button onClick={sendGrill} disabled={grillDraft.trim().length < 12 || grillLoading}><Send size={17} /></button>
                    </div>
                  )}
                  {grillTime === 0 && resolution < 80 && (
                    <div className="follow-up-notice">The meeting ended inconclusively. Priya scheduled a 20-minute follow-up; your current resolution is preserved.</div>
                  )}
                  {(resolution >= 80 || grillTime === 0) && (
                    <button className="primary-button" onClick={() => move("request")}>
                      Request the scoped data
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {stage === "request" && (
            <div className="data-request data-request-email">
              <div className="email-compose-head"><span>New message</span><button>×</button></div>
              <div className="email-address">
                <span>To</span>
                <img src={appPath(characterBible.tom.portrait)} alt="" />
                <strong>Tom Jacobs</strong>
                <small>tom.jacobs@solsticeretail.co.za</small>
              </div>
              <label>Subject<input readOnly value="Data request: customer loyalty investigation" /></label>
              <div className="email-body">
                <p>Hi Tom,</p>
                <p>I have completed three scoping meetings with Customer Insights. Please grant access to the bounded extracts below so I can test the agreed issue tree rather than assume one cause.</p>
                <div className="request-fields">
                  {["customer_id", "loyalty_status", "region", "order_outcome", "points_variance", "support_category"].map((field) => (
                    <label key={field}>
                      <input type="checkbox" checked={requestFields.includes(field)} onChange={() => setRequestFields((current) => current.includes(field) ? current.filter((item) => item !== field) : [...current, field])} />
                      {field}
                    </label>
                  ))}
                </div>
                <label className="date-request">
                  Date range
                  <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                    <option value="">Select a bounded period</option>
                    <option>1 April – 31 July 2026</option>
                    <option>1 January – 31 July 2026</option>
                    <option>Last 30 days</option>
                  </select>
                </label>
                <p>Thanks,<br />{profile.name}</p>
              </div>
              <button className="primary-button" onClick={submitRequest}><Send size={16} /> Send email</button>
              {requestStatus && (
                <div className="tom-response">
                  <img src={appPath(characterBible.tom.portrait)} alt="" />
                  <div><strong>Tom replied</strong><p>{requestStatus}</p></div>
                </div>
              )}
              {requestStatus.includes("approved") && (
                <button className="text-button" onClick={() => onComplete({
                  lessonScore: soloScore,
                  rubricScores,
                  boardClarity: resolution,
                  glossary,
                  notesCount: notes.length,
                  projectType,
                  meetingsAttended: 3,
                  contributions,
                  dataAccessGranted: true
                })}>
                  Return to the work dashboard <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </section>
        {notesOpen && (
          <aside className="work-notes">
            <header>
              <div><strong>Working notes</strong><span>Saved on this device</span></div>
              <button onClick={() => setNotesOpen(false)}>×</button>
            </header>
            <div className="note-list">
              <label className="notes-search">
                <Search size={15} />
                <input value={noteSearch} onChange={(event) => setNoteSearch(event.target.value)} placeholder="Search notes and tags" />
              </label>
              {notes.length === 0 ? (
                <p>No notes yet. Pin a term or capture what matters.</p>
              ) : (
                notes.slice().reverse().filter((note) => `${note.tag} ${note.text}`.toLowerCase().includes(noteSearch.toLowerCase())).map((note) => (
                  <article key={note.id}>
                    <span>{note.tag} · {note.created}</span>
                    <p>{note.text}</p>
                  </article>
                ))
              )}
            </div>
            <footer>
              <select value={noteTag} onChange={(event) => setNoteTag(event.target.value)}>
                <option>Loyalty problem</option>
                <option>Meeting</option>
                <option>Glossary</option>
                <option>Data request</option>
              </select>
              <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Write a useful note…" />
              <button disabled={!noteDraft.trim()} onClick={() => saveNote()}>
                <StickyNote size={16} /> Save note
              </button>
            </footer>
          </aside>
        )}
      </div>
    </main>
  );
}

export default ProblemDefinitionLesson;