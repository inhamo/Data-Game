import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Archive, ArrowLeft, BookOpen, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronRight,
  CircleUserRound, Clock3, Download, ExternalLink, FileText, GraduationCap, Inbox, Keyboard, Library, Lightbulb, Mail, Mic,
  MapPin, Menu, MessageCircle, MoreVertical, Paperclip, Search, Send,
  ShieldCheck, Star, StickyNote, UserRound, Video, Volume2, VolumeX
} from "lucide-react";
import characterBible from "./data/characters.json";
import "./styles.css";
import "./lesson.css";
import "./certifications.css";

const initialProfile = {
  name: "", university: "", degree: "", favoriteModule: "", worstModule: "",
  afterUni: "", expectedCompany: ""
};

const contacts = [
  { name: "Mom", initial: "M" },
  { name: "Dad", initial: "D" },
  { name: "Lerato", initial: "L" }
];

const friend = { name: "Thando Mokoena", initial: "TM" };

const jobs = [
  {
    id: "aurora", company: "Solstice Retail Group", logo: "SR", title: "Junior Data Analyst",
    location: "Johannesburg, Gauteng", type: "Hybrid · Full-time", postedMinutes: 240,
    applicants: 38, applicantInterval: 18000, revealAfter: 0, salary: "R28,000 – R34,000 per month", match: 91,
    interviewRounds: 3, interviewer: "Priya Shah", interviewerRole: "Senior Analyst",
    description: "Join the Customer Intelligence team to clean commercial data, build trusted reports, and turn weekly performance into decisions.",
    skills: ["SQL", "Power BI", "Excel"]
  },
  {
    id: "mosaic", company: "Mosaic Health", logo: "MH", title: "Graduate BI Analyst",
    location: "Cape Town, Western Cape", type: "On-site · Full-time", postedMinutes: 2880,
    applicants: 104, applicantInterval: 12000, revealAfter: 0, salary: "R25,000 – R29,000 per month", match: 83,
    interviewRounds: 2, interviewer: "Dr. Amara Naidoo", interviewerRole: "BI Lead", approached: true,
    description: "Support clinical operations with quality checks, reporting models, and clear data storytelling.",
    skills: ["Power BI", "DAX", "Data quality"]
  },
  {
    id: "northstar", company: "Northstar Retail", logo: "NR", title: "Data Graduate",
    location: "South Africa", type: "Remote · 12-month programme", postedMinutes: 10080,
    applicants: 227, applicantInterval: 9000, revealAfter: 0, salary: "R22,000 per month", match: 76,
    interviewRounds: 1, interviewer: "Kabelo Maseko", interviewerRole: "Graduate Programme Manager",
    description: "A structured graduate programme covering trading analytics, customer reporting, and data operations.",
    skills: ["Excel", "SQL", "Retail"]
  },
  {
    id: "canopy", company: "Canopy Bank", logo: "CB", title: "Junior Reporting Analyst",
    location: "Sandton, Gauteng", type: "Hybrid · Full-time", postedMinutes: 0,
    applicants: 1, applicantInterval: 14000, revealAfter: 20000, salary: "R27,000 – R32,000 per month", match: 88,
    interviewRounds: 2, interviewer: "Nomsa Dlamini", interviewerRole: "Analytics Manager",
    description: "Help the operations team automate recurring reports, investigate exceptions, and improve trusted business metrics.",
    skills: ["SQL", "Excel", "Power BI"]
  },
  {
    id: "atlas", company: "Atlas Logistics", logo: "AL", title: "Graduate Data Associate",
    location: "Durban, KwaZulu-Natal", type: "On-site · Full-time", postedMinutes: 0,
    applicants: 0, applicantInterval: 11000, revealAfter: 45000, salary: "R24,000 – R28,000 per month", match: 81,
    interviewRounds: 2, interviewer: "Michael Adams", interviewerRole: "Data Operations Lead",
    description: "Work with delivery and warehouse data to identify delays, maintain operational dashboards, and support planning decisions.",
    skills: ["Python", "SQL", "Operations"]
  }
];

const questions = [
  ["Introduction", "Before we get into the role, tell me about yourself and what drew you to data.",
    "I enjoy turning unclear problems into evidence people can use, and my degree gave me the technical foundation to do that.", "I chose data because it seemed like a safe career and I am open to anything.", 0],
  ["Motivation", "Why are you interested in Solstice Retail Group and this graduate role?",
    "The role combines data quality, analysis, and stakeholder work, which matches the kind of analyst I want to become.", "It was one of several jobs I applied for and the salary looked reasonable.", 0],
  ["Behavioural", "Tell me how you would respond if you made a mistake in a report sent to a manager.",
    "Correct it quietly in the next report and hope nobody used the first version.", "Raise it quickly, explain the impact, issue a corrected version, and prevent the same mistake recurring.", 1],
  ["SQL", "A customer table contains duplicate email addresses. Which query identifies them?",
    "GROUP BY email HAVING COUNT(*) > 1", "ORDER BY email DESC", 0],
  ["SQL", "You need to filter grouped sales totals above 100,000. Which clause is correct?",
    "WHERE SUM(sales) > 100000", "HAVING SUM(sales) > 100000", 1],
  ["Analysis", "Sales fell this week. What is the strongest first response?",
    "Segment the change by product, region, channel, and date", "Assume marketing caused it", 0],
  ["Data quality", "A source column suddenly has 40% null values. What should you do first?",
    "Replace all nulls with zero", "Check the source, definition, and pipeline change history", 1],
  ["Communication", "A stakeholder requests a misleading chart. What is the best response?",
    "Explain the risk and propose a truthful alternative", "Build it exactly as requested", 0]
];

const sqlAssessment = [
  ["Which clause filters rows before grouping?", "WHERE", "HAVING", 0],
  ["Which clause filters aggregated groups?", "WHERE", "HAVING", 1],
  ["Which join keeps every row from the left table?", "LEFT JOIN", "INNER JOIN", 0],
  ["Which function counts non-null values in a column?", "COUNT(column)", "SUM(column)", 0],
  ["What does DISTINCT do?", "Removes duplicate result rows", "Sorts result rows", 0],
  ["Which expression replaces a null value?", "COALESCE(value, 0)", "COUNT(value, 0)", 0],
  ["Which keyword sorts from highest to lowest?", "ASC", "DESC", 1],
  ["Which window function gives a unique sequence within a group?", "ROW_NUMBER()", "ROUND()", 0],
  ["A primary key must be...", "Unique and non-null", "Repeated and nullable", 0],
  ["Which operator tests a range inclusively?", "BETWEEN", "LIKE", 0],
  ["Which pattern finds names starting with A?", "LIKE 'A%'", "LIKE '%A'", 0],
  ["What does GROUP BY do?", "Combines rows sharing values for aggregation", "Deletes repeated rows", 0],
  ["Which statement adds rows to a table?", "INSERT", "UPDATE", 0],
  ["Which statement changes existing rows?", "UPDATE", "ALTER", 0],
  ["What is the safest way to test an UPDATE?", "Run its WHERE logic as a SELECT first", "Remove the WHERE clause", 0],
  ["Which function returns the average?", "AVG()", "MEAN()", 0],
  ["A foreign key primarily...", "Links related tables", "Sorts a table", 0],
  ["UNION differs from UNION ALL because UNION...", "Removes duplicates", "Keeps all duplicates", 0],
  ["Which clause limits grouped duplicate emails?", "HAVING COUNT(*) > 1", "WHERE COUNT(*) > 1", 0],
  ["Why use a transaction?", "To commit or roll back a set of changes", "To rename every column", 0]
];

const pythonAssessment = [
  ["Which type stores key-value pairs?", "dict", "list", 0],
  ["What does len(values) return?", "Number of items", "Largest item", 0],
  ["Which keyword defines a function?", "def", "func", 0],
  ["Which operator checks equality?", "==", "=", 0],
  ["What is the first list index?", "0", "1", 0],
  ["Which statement handles exceptions?", "try / except", "if / then", 0],
  ["What does range(3) produce for iteration?", "0, 1, 2", "1, 2, 3", 0],
  ["Which method adds one item to a list?", "append()", "push()", 0],
  ["What is a boolean value?", "True or False", "Any text value", 0],
  ["Which library is widely used for tabular data?", "pandas", "requests", 0],
  ["How do you import pandas conventionally?", "import pandas as pd", "include pandas", 0],
  ["Which pandas method previews the first rows?", "head()", "top()", 0],
  ["Which value commonly represents missing pandas data?", "NaN", "EMPTY", 0],
  ["What does df.drop_duplicates() do?", "Removes duplicate rows", "Drops every column", 0],
  ["Which expression selects a DataFrame column?", "df['sales']", "df->sales", 0],
  ["Which pandas method groups rows?", "groupby()", "cluster()", 0],
  ["Why use a virtual environment?", "To isolate project dependencies", "To make Python run offline", 0],
  ["Which mode opens a file for reading?", "'r'", "'w'", 0],
  ["What does a list comprehension create?", "A list from an iterable expression", "A database table", 0],
  ["Which is safer for secrets?", "Environment variables", "Hard-coding them in source", 0]
];

const seasonCases = [
  ["00", "Welcome Aboard", "Research habit"],
  ["01", "Everyone Has a Theory", "Structure"],
  ["02", "The Vague Ask", "Scoping"],
  ["03", "Pick a Lane", "Hypothesis"],
  ["04", "Nobody Made It to Slide 12", "Storytelling"],
  ["05", "Three Departments, One Whiteboard", "Root causes"],
  ["06", "Make the Case With Numbers", "Expected value"],
  ["07", "Didn't We Already Fix This?", "5 Whys"],
  ["08", "Marcus Wants a Different Number", "Integrity"],
  ["09", "The Migration", "Synthesis"],
  ["10", "Building the Case File", "Finale prep"],
  ["F", "The Board", "Season finale"]
];

function App() {
  const [chapter, setChapter] = useState("welcome");
  const [profile, setProfile] = useState(initialProfile);
  const [contact] = useState(() => contacts[Math.floor(Math.random() * contacts.length)]);
  const transcript = useMemo(() => makeTranscript(profile), [profile]);

  if (chapter === "welcome") return <Welcome onContinue={() => setChapter("profile")} />;
  if (chapter === "profile") return <Profile profile={profile} setProfile={setProfile} onContinue={() => setChapter("family-chat")} />;
  if (chapter === "family-chat") return <FamilyChat contact={contact} profile={profile} setProfile={setProfile} onContinue={() => setChapter("results-chat")} />;
  if (chapter === "results-chat") return <ResultsChat profile={profile} onContinue={() => setChapter("results")} />;
  if (chapter === "results") return <ResultsPortal profile={profile} transcript={transcript} onContinue={() => setChapter("graduation")} />;
  if (chapter === "graduation") return <Graduation profile={profile} onContinue={() => setChapter("career")} />;
  return <CareerPortal profile={profile} transcript={transcript} />;
}

function Welcome({ onContinue }) {
  const [line, setLine] = useState(0);
  const screens = [
    ["PLATO", "DATA CAREER SIMULATOR"],
    ["YOUR FINAL YEAR", "One result will close a chapter. Every decision after it opens another."],
    ["CLASS OF 2026", "Your story starts now."]
  ];
  useEffect(() => {
    if (line >= screens.length - 1) return undefined;
    const timer = setTimeout(() => setLine((value) => value + 1), 2500);
    return () => clearTimeout(timer);
  }, [line]);
  return (
    <main className="cinema-screen" onClick={() => line === screens.length - 1 ? onContinue() : setLine((v) => v + 1)}>
      <div className="cinema-grid" />
      <div className="light-ribbon ribbon-one" />
      <div className="light-ribbon ribbon-two" />
      <section key={line} className="cinema-copy">
        <p className="overline">An interactive life story</p>
        <h1>{screens[line][0]}</h1>
        <p>{screens[line][1]}</p>
      </section>
      <button className="skip-button" type="button">{line === 2 ? "Begin" : "Continue"} <ChevronRight size={18} /></button>
      <span className="chapter-count">0{line + 1} / 03</span>
    </main>
  );
}

function Profile({ profile, setProfile, onContinue }) {
  const fields = [
    ["name", "What should we call you?", "Your full name"],
    ["university", "Where are you studying?", "University name"],
    ["degree", "What degree are you completing?", "e.g. BSc Data Science"],
    ["favoriteModule", "The module you would happily take again?", "Favourite module"],
    ["worstModule", "And the one you survived?", "Least favourite module"]
  ];
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(profile[fields[step][0]]);
  function next() {
    const key = fields[step][0];
    setProfile((current) => ({ ...current, [key]: value.trim() }));
    if (step === fields.length - 1) onContinue();
    else {
      setStep((current) => current + 1);
      setValue(profile[fields[step + 1][0]]);
    }
  }
  return (
    <main className="question-screen">
      <BrandMark />
      <section key={step} className="question-content">
        <p className="overline">Before results day · {step + 1} of {fields.length}</p>
        <h1>{fields[step][1]}</h1>
        <input autoFocus value={value} placeholder={fields[step][2]} onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && value.trim() && next()} />
        <button className="primary-button" disabled={!value.trim()} onClick={next}>Continue <ChevronRight size={18} /></button>
      </section>
      <div className="step-line"><span style={{ width: `${((step + 1) / fields.length) * 100}%` }} /></div>
    </main>
  );
}

function FamilyChat({ contact, profile, setProfile, onContinue }) {
  const [messages, setMessages] = useState([
    { from: "them", text: `Hey ${profile.name.split(" ")[0] || "you"} ❤️ How are you feeling about results?`, time: "09:41" }
  ]);
  const [draft, setDraft] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  function send() {
    if (!draft.trim()) return;
    const answer = draft.trim();
    setMessages((current) => [...current, { from: "me", text: answer, time: now() }]);
    setDraft("");
    if (conversationStep === 0) {
      setConversationStep(1);
      setTimeout(() => setMessages((current) => [...current, { from: "them", text: "I hear you ❤️ Results day can feel like a lot. When university is finished, what kind of work do you think you would like to do?", time: now() }]), 450);
      return;
    }
    if (conversationStep === 1) {
      setProfile((current) => ({ ...current, afterUni: answer }));
      setConversationStep(2);
      setTimeout(() => setMessages((current) => [...current, { from: "them", text: `${answer} sounds like a real direction. Is there a company you would love to work for, or are you still exploring?`, time: now() }]), 450);
      return;
    }
    if (conversationStep === 2) {
      setProfile((current) => ({ ...current, expectedCompany: answer }));
      setConversationStep(3);
      setTimeout(() => setMessages((current) => [...current, { from: "them", text: "That’s a good place to start. You don’t need the whole future figured out today. One step at a time — I’m proud of you.", time: now() }]), 450);
      return;
    }
    setTimeout(() => setMessages((current) => [...current, { from: "them", text: "I’m listening. Results first, then we take the next step together.", time: now() }]), 450);
  }
  const goalComplete = Boolean(profile.afterUni && profile.expectedCompany);
  return <div className="chat-with-action"><WhatsApp contact={contact} messages={messages} draft={draft} setDraft={setDraft} onSend={send} placeholder="Type a message" />{goalComplete && <button className="portal-action" onClick={onContinue}>Continue to results day <ChevronRight size={18} /></button>}</div>;
}

function ResultsChat({ profile, onContinue }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  useEffect(() => {
    const one = setTimeout(() => setMessages([{ from: "them", text: `${profile.name.split(" ")[0] || "Hey"}!!!`, time: now() }]), 600);
    const two = setTimeout(() => setMessages((m) => [...m, { from: "them", text: "Results are out. The portal is open 😭", time: now() }]), 1500);
    return () => { clearTimeout(one); clearTimeout(two); };
  }, [profile.name]);
  function send() {
    if (!draft.trim()) return;
    const text = draft.trim();
    setMessages((m) => [...m, { from: "me", text, time: now() }]);
    setDraft("");
    const replies = [
      "Open it 😭 I’m right here.",
      "Whatever it says, we survived this degree.",
      "I’m nervous for you now. Check the portal!",
      "Breathe first. Then open it."
    ];
    const reply = replies[messages.length % replies.length];
    setTimeout(() => setMessages((m) => [...m, { from: "them", text: reply, time: now() }]), 400);
  }
  return (
    <div className="chat-with-action">
      <WhatsApp contact={friend} messages={messages} draft={draft} setDraft={setDraft} onSend={send} placeholder="Message Thando" />
      {messages.length > 1 && <button className="portal-action" onClick={onContinue}>Open student portal <ChevronRight size={18} /></button>}
    </div>
  );
}

function WhatsApp({ contact, messages, draft, setDraft, onSend, placeholder }) {
  return (
    <main className="whatsapp-page">
      <section className="whatsapp-phone">
        <header className="wa-header">
          <ArrowLeft size={22} />
          <Avatar text={contact.initial} />
          <div><strong>{contact.name}</strong><span>online</span></div>
          <Video size={21} /><Search size={20} /><MoreVertical size={20} />
        </header>
        <div className="wa-wallpaper">
          <p className="wa-date">TODAY</p>
          <p className="wa-encryption"><ShieldCheck size={13} /> Messages are end-to-end encrypted.</p>
          {messages.map((message, index) => (
            <div key={`${message.text}-${index}`} className={`wa-bubble ${message.from}`}>
              {message.text}<span>{message.time}{message.from === "me" && " ✓✓"}</span>
            </div>
          ))}
        </div>
        <form className="wa-compose" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
          <button type="button" aria-label="Attach"><Paperclip size={21} /></button>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} autoFocus />
          <button className="wa-send" type="submit" aria-label="Send message"><Send size={19} /></button>
        </form>
      </section>
    </main>
  );
}

function ResultsPortal({ profile, transcript, onContinue }) {
  const [opened, setOpened] = useState(false);
  if (!opened) return (
    <main className="uni-login">
      <section>
        <div className="university-seal"><GraduationCap size={34} /></div>
        <p className="overline">Student self-service</p>
        <h1>{profile.university || "University Portal"}</h1>
        <p>Academic records and official results</p>
        <button className="primary-button" onClick={() => setOpened(true)}>View final results <ChevronRight size={18} /></button>
      </section>
    </main>
  );
  return (
    <main className="academic-portal">
      <header><div className="university-seal small"><GraduationCap size={22} /></div><div><strong>{profile.university}</strong><span>Student Records Office</span></div><button><CircleUserRound size={18} /> {profile.name}</button></header>
      <div className="academic-shell">
        <aside><strong>Student Self-Service</strong><button className="active">Academic record</button><button>Registration</button><button>Documents</button></aside>
        <article className="transcript">
          <div className="document-head">
            <div><p className="overline">Official academic record</p><h1>Statement of Results</h1></div>
            <button className="icon-text"><Download size={18} /> Download PDF</button>
          </div>
          <div className="student-record"><span>Student</span><strong>{profile.name}</strong><span>Qualification</span><strong>{profile.degree}</strong><span>Academic year</span><strong>2026</strong><span>Status</span><strong className="success">Qualification completed</strong></div>
          <table><thead><tr><th>Module code</th><th>Module</th><th>Credits</th><th>Final mark</th><th>Result</th></tr></thead>
            <tbody>{transcript.modules.map((module) => <tr key={module.code}><td>{module.code}</td><td>{module.name}</td><td>12</td><td>{module.mark}%</td><td className="success">Pass</td></tr>)}</tbody>
          </table>
          <div className="result-summary"><div><span>Credits passed</span><strong>120 / 120</strong></div><div><span>Weighted average</span><strong>{transcript.average}%</strong></div><div><span>Decision</span><strong>{transcript.distinction ? "Pass with distinction" : "Degree awarded"}</strong></div></div>
          <footer><ShieldCheck size={19} /><span>This record was digitally issued by the Registrar’s Office.</span><button className="primary-button" onClick={onContinue}>Continue to graduation</button></footer>
        </article>
      </div>
    </main>
  );
}

function Graduation({ profile, onContinue }) {
  const [moment, setMoment] = useState("queue");
  const [queueStep, setQueueStep] = useState(0);
  useEffect(() => {
    const lineTimers = [700, 1400, 2100].map((delay, index) => setTimeout(() => setQueueStep(index + 1), delay));
    const walk = setTimeout(() => setMoment("walk"), 2800);
    const award = setTimeout(() => setMoment("award"), 6000);
    const celebrate = setTimeout(() => setMoment("celebrate"), 8300);
    return () => [...lineTimers, walk, award, celebrate].forEach(clearTimeout);
  }, []);
  const guests = Array.from({ length: 34 });
  const queue = Array.from({ length: 8 });
  return (
    <main className={`graduation-hall ${moment}`}>
      <div className="hall-ceiling"><i /><i /><i /></div>
      <div className="hall-banner"><GraduationCap size={30} /><span>{profile.university || "University"} · Class of 2026</span></div>
      <section className="graduation-stage-real">
        <div className="stage-curtain left" /><div className="stage-curtain right" />
        <div className="faculty-row">{Array.from({ length: 7 }).map((_, i) => <Person key={i} faculty />)}</div>
        <div className="lectern"><GraduationCap size={26} /></div>
        <Person graduate main />
        <Person faculty presenter />
      </section>
      <div className="graduate-queue">{queue.slice(queueStep).map((_, i) => <div className={i === 0 ? "queue-position next" : "queue-position"} key={i + queueStep}><Person graduate /></div>)}</div>
      <div className="audience">{guests.map((_, i) => <span key={i} style={{ "--delay": `${i * 20}ms` }} />)}</div>
      {moment === "award" && <div className="name-call"><span>Bachelor’s degree conferred upon</span><strong>{profile.name}</strong></div>}
      {moment === "celebrate" && <Caps />}
      {moment === "celebrate" && <div className="graduate-3d-celebration"><img src="/assets/people/graduate-man-diploma.webp" alt="" /><img src="/assets/people/graduate-woman-celebrating.webp" alt="" /></div>}
      {moment === "celebrate" && <button className="graduation-next" onClick={onContinue}>Enter the world of work <ChevronRight size={18} /></button>}
    </main>
  );
}

function Person({ faculty, graduate, main, presenter }) {
  return <div className={`person ${faculty ? "faculty" : ""} ${graduate ? "graduate" : ""} ${main ? "main-graduate" : ""} ${presenter ? "presenter" : ""}`}><i className="head" /><i className="body" />{graduate && <i className="cap" />}</div>;
}

function Caps() {
  return <div className="caps">{Array.from({ length: 15 }).map((_, i) => <GraduationCap key={i} style={{ "--x": `${(i * 73) % 100}vw`, "--r": `${(i % 2 ? 1 : -1) * (20 + i * 13)}deg`, "--d": `${i * 45}ms` }} />)}</div>;
}

function useLiveJobMarket() {
  const [marketStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return useMemo(() => jobs.filter((job) => now - marketStart >= job.revealAfter).map((job) => {
    const activeFor = Math.max(0, now - marketStart - job.revealAfter);
    const postedAt = marketStart + job.revealAfter - job.postedMinutes * 60000;
    return {
      ...job,
      posted: relativeTime(postedAt, now),
      applicants: job.applicants + Math.floor(activeFor / job.applicantInterval),
      isNew: now - (marketStart + job.revealAfter) < 60000 && job.revealAfter > 0
    };
  }), [marketStart, now]);
}

function relativeTime(timestamp, now = Date.now()) {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
}

function CareerPortal({ profile, transcript }) {
  const [view, setView] = useState("cv");
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
    const outcomes = { aurora: "Interview requested", mosaic: "Interview requested", northstar: "Not selected" };
    setApplications((current) => [...current, { job, status: outcomes[job.id] || "Under review", date: new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }), round: 1 }]);
    setSelectedJob(job);
    setView("applications");
  }
  function updateApplication(jobId, patch) {
    setApplications((current) => current.map((item) => item.job.id === jobId ? { ...item, ...patch } : item));
  }
  function completeInterview(application, score) {
    updateApplication(application.job.id, { status: "Interview submitted", score });
    setView("applications");
    window.setTimeout(() => {
      if (score < 6) {
        updateApplication(application.job.id, { status: "Not selected after interview" });
      } else if ((application.round || 1) < application.job.interviewRounds) {
        updateApplication(application.job.id, { status: "Round complete" });
        setTransitionMessage({ jobId: application.job.id, company: application.job.company, nextRound: (application.round || 1) + 1, totalRounds: application.job.interviewRounds });
      } else if (application.job.id === "aurora") {
        updateApplication(application.job.id, { status: "Offer received" });
      } else {
        updateApplication(application.job.id, { status: "Not selected after final interview" });
      }
    }, 2500);
  }
  if (transitionMessage) return <InterviewIntermission details={transitionMessage} onContinue={() => { updateApplication(transitionMessage.jobId, { status: "Interview requested", round: transitionMessage.nextRound }); setTransitionMessage(null); }} />;
  if (workOpen) return <WorkPortal profile={profile} certificate={certificate} workRecord={workRecord} onCertified={setCertificate} onWorkComplete={setWorkRecord} onExit={() => setWorkOpen(false)} />;
  return (
    <main className="career-portal">
      <header className="career-topbar"><BrandMark compact /><div className="global-search"><Search size={18} /><input placeholder="Search jobs, companies, or skills" /></div><button className="profile-button" onClick={() => setView("profile")}><Avatar text={initials(profile.name)} /><span>{profile.name}</span></button></header>
      <div className="career-layout">
        <aside className="career-sidebar">
          <div className="identity"><Avatar text={initials(profile.name)} /><strong>{profile.name}</strong><span>{profile.degree}</span><small>{profile.university}</small>{certificate && <div className="profile-certificate"><ShieldCheck size={17} /><span><b>{certificate.track} Ready</b><small>Verified · {certificate.score}%</small></span></div>}</div>
          <nav>
            <NavButton icon={UserRound} label="Build CV" active={view === "cv"} onClick={() => setView("cv")} />
            <NavButton icon={CircleUserRound} label="Profile" active={view === "profile"} onClick={() => setView("profile")} />
            <NavButton icon={GraduationCap} label="Certificates" active={view === "certificates"} onClick={() => setView("certificates")} />
            <NavButton icon={BriefcaseBusiness} label="Find jobs" active={view === "jobs"} onClick={() => setView("jobs")} />
            <NavButton icon={FileText} label="My applications" active={view === "applications"} count={applications.length} onClick={() => setView("applications")} />
            <NavButton icon={Mail} label="Inbox" active={view === "mail"} count={applications.length} onClick={() => setView("mail")} />
          </nav>
          {offerAccepted && <button className="work-launcher" onClick={() => setWorkOpen(true)}><Building2 size={19} /><span>Solstice workspace<small>Employee portal</small></span><ChevronRight size={16} /></button>}
        </aside>
        <section className="career-main">
          {view === "jobs" && <JobsView jobs={liveJobs} selected={liveJobs.find((job) => job.id === selectedJob.id) || selectedJob} setSelected={setSelectedJob} application={selectedApplication} apply={apply} savedJobs={savedJobs} toggleSaved={(jobId) => setSavedJobs((current) => current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId])} />}
          {view === "applications" && <ApplicationsView applications={applications} open={(item) => { setSelectedJob(item.job); setView(item.status === "Interview requested" ? "interview" : "mail"); setMailId(item.job.id); }} />}
          {view === "mail" && <Mailbox applications={applications} selectedId={mailId} setSelectedId={setMailId} openInterview={() => setView("interview")} openOffer={() => setView("offer")} />}
          {view === "cv" && <CV profile={profile} transcript={transcript} certificate={certificate} workRecord={workRecord} />}
          {view === "profile" && <ProfessionalProfile profile={profile} transcript={transcript} certificate={certificate} onFindJobs={() => setView("jobs")} />}
          {view === "certificates" && <CertificationWorkspace profile={profile} companyCertificate={certificate} />}
          {view === "interview" && <Interview key={`${selectedApplication?.job.id}-${selectedApplication?.round || 1}`} application={selectedApplication} onSubmit={(score) => completeInterview(selectedApplication, score)} />}
          {view === "offer" && <Offer profile={profile} accepted={offerAccepted} onAccept={() => { setOfferAccepted(true); updateApplication("aurora", { status: "Offer accepted" }); }} onOpenWork={() => setWorkOpen(true)} />}
        </section>
      </div>
    </main>
  );
}

function InterviewIntermission({ details, onContinue }) {
  return <main className="interview-intermission"><div><span>ROUND COMPLETE · {details.company.toUpperCase()}</span><h1>This pause is part of the process.</h1><p>Real hiring rarely moves in one clean line. People compare notes, calendars delay decisions, and every round tests something different. You are still here because your skill earned another conversation.</p><blockquote>Nothing about waiting can separate you from what you have learned. Rest, prepare, and return.</blockquote><button className="primary-button" onClick={onContinue}>Continue to round {details.nextRound} of {details.totalRounds} <ChevronRight size={18} /></button></div></main>;
}

function NavButton({ icon: Icon, label, active, count, onClick }) {
  return <button className={active ? "active" : ""} onClick={onClick}><Icon size={19} /><span>{label}</span>{count > 0 && <b>{count}</b>}</button>;
}

function JobsView({ jobs: marketJobs, selected, setSelected, application, apply, savedJobs, toggleSaved }) {
  const approachedJob = marketJobs.find((job) => job.approached);
  return <div className="job-browser"><div className="job-list"><div className="list-heading"><p className="overline">Recommended for you</p><h1>Graduate opportunities</h1><span><i className="market-live-dot" /> Live market · {marketJobs.length} roles now</span></div><div className="early-apply-tip"><Lightbulb size={18} /><div><strong>Apply while the role is fresh.</strong><span>Early applications are more likely to be reviewed before the shortlist fills.</span></div></div>{approachedJob && <button className="recruiter-approach" onClick={() => setSelected(approachedJob)}><Avatar text="AN" /><div><strong>Dr. Amara Naidoo viewed your profile</strong><span>Mosaic Health invited you to discuss its Graduate BI Analyst role.</span></div><ChevronRight size={17} /></button>}
    {marketJobs.map((job) => <button key={job.id} className={`job-row ${selected.id === job.id ? "selected" : ""} ${job.isNew ? "new-job" : ""}`} onClick={() => setSelected(job)}><CompanyLogo job={job} /><div><strong>{job.title}</strong><span>{job.company}</span><small><MapPin size={13} /> {job.location}</small><small>{job.posted} · {job.applicants} applicants</small></div><span className="match">{job.isNew ? "New" : `${job.match}% match`}</span></button>)}</div>
    <article className="job-detail"><div className="job-cover"><CompanyLogo job={selected} large /></div><h1>{selected.title}</h1><p className="company-line">{selected.company} · {selected.location}</p><p>{selected.type}</p><div className="job-actions"><button className="primary-button" disabled={application} onClick={() => apply(selected)}>{application ? application.status : selected.approached ? "Respond to recruiter" : "Easy Apply"}</button><button className={`icon-button ${savedJobs.includes(selected.id) ? "saved" : ""}`} onClick={() => toggleSaved(selected.id)} title="Save job"><Star size={19} fill={savedJobs.includes(selected.id) ? "currentColor" : "none"} /></button></div><div className="job-facts"><span><Clock3 size={17} /> {selected.posted}</span><span className="applicant-counter"><UserRound size={17} /> {selected.applicants} applicants</span><span><BriefcaseBusiness size={17} /> {selected.salary}</span></div><div className="hiring-process"><strong>Hiring process</strong><span>{selected.interviewRounds} {selected.interviewRounds === 1 ? "interview" : "interview rounds"} · technical assessment may apply</span></div><h2>About the role</h2><p>{selected.description}</p><h2>Skills</h2><div className="skill-row">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>
  </div>;
}

function ProfessionalProfile({ profile, transcript, certificate, onFindJobs }) {
  const firstName = profile.name.split(" ")[0] || "Graduate";
  const tips = [
    ["Photo & banner", "Use a clear, recent photo that looks like you. Add a banner connected to data, your city, or work you are proud of.", "Photo"],
    ["Headline", `Replace “student” with a searchable direction: “Graduate Data Analyst | SQL · Power BI · ${profile.favoriteModule || "Data storytelling"}”.`, "Headline"],
    ["About", "Write 4–6 short lines: the problems you enjoy, the tools you use, one piece of evidence, and the role you are pursuing.", "About"],
    ["Featured", "Pin your strongest dashboard, GitHub project, analysis report, or case study. Show the work instead of only naming skills.", "Featured"],
    ["Experience", "Projects, volunteering, societies, tutoring, and part-time work count when you explain the skill and result honestly.", "Experience"],
    ["Skills", "Put role-relevant skills first. Keep SQL, Power BI, Excel, Python, analysis, and communication aligned with the jobs you want.", "Skills"],
    ["Education", "Add the degree, university, relevant modules, projects, awards, and activities. Remove school detail once it stops helping.", "Education"],
    ["Network", "Connect with classmates, lecturers, alumni, recruiters, and analysts. Add a short personal note when there is a genuine connection.", "Network"]
  ];
  return <section className="professional-profile"><div className="profile-main"><div className="profile-cover"><span>DATA · ANALYSIS · DECISIONS</span></div><header><Avatar text={initials(profile.name)} /><div><h1>{profile.name}</h1><p>Graduate Data Analyst | SQL · Power BI · Data storytelling</p><span>Johannesburg, South Africa · {profile.university}</span></div><button className="primary-button" onClick={onFindJobs}>Find jobs</button></header><div className="profile-open-banner"><Lightbulb size={20} /><div><strong>{firstName}, always try to apply early.</strong><span>Set alerts, prepare your core documents, and tailor the first strong application instead of waiting for the “perfect” one.</span></div></div><article className="profile-about"><h2>About</h2><p>Analytical {profile.degree} graduate interested in {profile.afterUni || "turning data into useful decisions"}. Comfortable with SQL, reporting, and practical problem-solving, with a final weighted average of {transcript.average}%.</p></article><article><h2>Education</h2><strong>{profile.university}</strong><p>{profile.degree} · Class of 2026</p></article>{certificate && <article><h2>Licences & certifications</h2><strong>{certificate.track} Technical Readiness</strong><p>Verified assessment score: {certificate.score}%</p></article>}</div><aside className="profile-coach"><div className="coach-heading"><img src="/assets/people/executive-burgundy-gesturing.webp" alt="" /><div><span>Profile coach</span><h2>Revamp every section</h2></div></div><p className="profile-score"><strong>{certificate ? 82 : 64}%</strong><span>Profile strength</span></p><div className="profile-tip-list">{tips.map(([title, text, tag]) => <details key={title}><summary><span>{tag}</span>{title}<ChevronRight size={16} /></summary><p>{text}</p></details>)}</div><a className="official-guide" href="https://www.linkedin.com/help/linkedin/answer/a554351/how-do-i-create-a-good-linkedin-profile-" target="_blank" rel="noreferrer">Open LinkedIn’s official profile guide <ExternalLink size={15} /></a><div className="typing-practice"><Keyboard size={25} /><div><strong>Build workplace typing confidence</strong><p>Practise accuracy first, then speed. This helps with coding, email, documentation, and timed assessments.</p><a href="https://www.typing.com/en" target="_blank" rel="noreferrer">Start free lessons on Typing.com <ExternalLink size={14} /></a></div></div></aside></section>;
}

function CertificationWorkspace({ profile, companyCertificate }) {
  const [mode, setMode] = useState("library");
  const [bank, setBank] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(() => {
    try { return JSON.parse(localStorage.getItem("plato-dp700-result") || "null"); } catch { return null; }
  });
  const [secondsLeft, setSecondsLeft] = useState(6000);
  useEffect(() => {
    fetch("/data/certifications/dp-700.json").then((response) => response.json()).then(setBank).catch(() => setBank({ questions: [] }));
  }, []);
  useEffect(() => {
    if (mode !== "test" || result || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [mode, result, secondsLeft]);
  function start(nextMode) {
    setMode(nextMode); setIndex(0); setSelected(null); setRevealed(false); setAnswers([]); setSecondsLeft(6000);
    if (nextMode === "test") setResult(null);
  }
  function nextPractice() {
    if (!revealed) { setRevealed(true); return; }
    if (index === bank.questions.length - 1) { setMode("library"); return; }
    setIndex((value) => value + 1); setSelected(null); setRevealed(false);
  }
  function nextTest() {
    const next = [...answers, selected];
    if (index === bank.questions.length - 1 || secondsLeft === 0) {
      const correct = next.reduce((total, answer, itemIndex) => total + (answer === bank.questions[itemIndex].correct ? 1 : 0), 0);
      const finalResult = { correct, total: next.length, score: Math.round((correct / next.length) * 100), completed: new Date().toISOString() };
      setResult(finalResult); localStorage.setItem("plato-dp700-result", JSON.stringify(finalResult));
    } else {
      setAnswers(next); setIndex((value) => value + 1); setSelected(null);
    }
  }
  if (mode === "library") return <section className="certification-library"><header><div><p className="overline">Personal workspace</p><h1>Certificates and preparation</h1><p>Credentials, company assessments, and exam preparation stay organised by issuing company.</p></div><Avatar text={initials(profile.name)} /></header><div className="certificate-company"><div className="company-certificate-heading"><span className="company-logo large">SR</span><div><h2>Solstice Retail Group</h2><p>Internal workplace credentials</p></div></div>{companyCertificate ? <article className="earned-certificate"><ShieldCheck size={25} /><div><strong>{companyCertificate.track} Technical Readiness</strong><span>Passed with {companyCertificate.score}% · Verified</span></div></article> : <p className="certificate-empty">Your Solstice readiness certificate will appear here after you pass the entry assessment.</p>}</div><div className="certificate-company microsoft-company"><div className="company-certificate-heading"><span className="microsoft-mark"><i /><i /><i /><i /></span><div><h2>Microsoft</h2><p>Data Engineering</p></div></div><div className="certification-path"><div><span>Certification path</span><h2>DP-700</h2><p>Implementing Data Engineering Solutions Using Microsoft Fabric</p><small>36-question practice session · 100-minute test simulation</small></div><div className="certification-actions"><a href="https://learn.microsoft.com/en-us/training/courses/dp-700t00" target="_blank" rel="noreferrer"><BookOpen size={17} /> Learn it</a><button onClick={() => start("practice")}><FileText size={17} /> Practice 36</button><button className="primary-button" onClick={() => start("test")}><Clock3 size={17} /> Take test</button><a href="https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/" target="_blank" rel="noreferrer"><CalendarDays size={17} /> Schedule exam</a></div></div>{result && <div className={`dp-result-strip ${result.score >= 70 ? "passed" : ""}`}><strong>{result.score}%</strong><span>{result.score >= 70 ? "Practice test passed. This is preparation, not the Microsoft credential." : "Keep practising before scheduling the official exam."}</span></div>}<div className="domain-bands"><span>Implement and manage <b>30–35%</b></span><span>Ingest and transform <b>30–35%</b></span><span>Monitor and optimize <b>30–35%</b></span></div></div></section>;
  if (!bank?.questions?.length) return <section className="certification-loading"><FileText size={30} /><h1>Preparing DP-700</h1><p>Loading the 36-question practice bank.</p></section>;
  const question = bank.questions[index];
  const testFinished = mode === "test" && result;
  if (testFinished) return <section className="dp-test-result"><div className="result-emblem"><GraduationCap size={38} /></div><p className="overline">DP-700 test simulation</p><h1>{result.score >= 70 ? "Practice test passed" : "More preparation recommended"}</h1><strong>{result.score}%</strong><p>{result.correct} of {result.total} correct. This simulator result does not grant the Microsoft certification.</p><button className="primary-button" onClick={() => setMode("library")}>Return to certificates</button><button className="text-button" onClick={() => start("practice")}>Review question by question</button></section>;
  return <main className={`dp-practice ${mode}`}><header><button onClick={() => setMode("library")}><ArrowLeft size={18} /> Certificates</button><div><span>Microsoft · Data Engineering</span><strong>DP-700 {mode === "practice" ? "Practice" : "Test"}</strong></div>{mode === "test" ? <time>{String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}</time> : <span>{index + 1} / {bank.questions.length}</span>}</header><div className="dp-progress"><span style={{ width: `${((index + 1) / bank.questions.length) * 100}%` }} /></div><section><p className="dp-domain">{question.domain}</p><h1>{question.question}</h1><div className="dp-options">{question.options.map((option, optionIndex) => <button className={`${selected === optionIndex ? "selected" : ""} ${revealed && optionIndex === question.correct ? "correct" : ""} ${revealed && selected === optionIndex && optionIndex !== question.correct ? "incorrect" : ""}`} disabled={revealed} onClick={() => setSelected(optionIndex)} key={option}><b>{"ABCD"[optionIndex]}</b><span>{option}</span>{revealed && optionIndex === question.correct && <Check size={19} />}</button>)}</div>{revealed && <div className="practice-explanation"><strong>{selected === question.correct ? "Correct." : `Best answer: ${"ABCD"[question.correct]}.`}</strong><p>{question.explanation}</p><a href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700" target="_blank" rel="noreferrer">Open the current Microsoft study guide <ExternalLink size={14} /></a></div>}<footer><span>Source question {question.sourceQuestion} · Session of 36</span><button className="primary-button" disabled={selected === null} onClick={mode === "practice" ? nextPractice : nextTest}>{mode === "practice" ? revealed ? index === bank.questions.length - 1 ? "Finish practice" : "Next question" : "Check answer" : index === bank.questions.length - 1 ? "Submit test" : "Save and continue"} <ChevronRight size={16} /></button></footer></section></main>;
}

function ApplicationsView({ applications, open }) {
  const betweenRounds = applications.find((item) => item.status === "Interview requested" && (item.round || 1) > 1);
  const awaitingDecision = applications.find((item) => item.status === "Interview submitted");
  return <section className="applications-page"><p className="overline">Your search</p><h1>My applications</h1><p className="page-subtitle">Submitted means the employer has your application. It may remain under review, move to interview, or close without an offer.</p>{(betweenRounds || awaitingDecision) && <div className="between-interviews"><Clock3 size={24} /><div><strong>{betweenRounds ? `Round ${betweenRounds.round} is ready` : "The hiring team is reviewing your interview"}</strong><p>{betweenRounds ? `Reaching another round means the team saw enough to keep learning about you. The next conversation may feel completely different: prepare again, but do not erase what already worked.` : "Silence between interviews is normal. Teams compare notes, schedules, budgets, and other candidates. Waiting is not the same as rejection."}</p></div></div>}
    {applications.length === 0 ? <Empty icon={FileText} title="No applications yet" text="Jobs you apply for will appear here." /> :
      <div className="application-table"><div className="table-labels"><span>Role</span><span>Submitted</span><span>Status</span><span /></div>{applications.map((item) => <div className="application-row" key={item.job.id}><div><CompanyLogo job={item.job} /><span><strong>{item.job.title}</strong><small>{item.job.company}</small></span></div><span>{item.date}</span><Status text={item.status} /><button onClick={() => open(item)}>View <ChevronRight size={16} /></button></div>)}</div>}
  </section>;
}

function Mailbox({ applications, selectedId, setSelectedId, openInterview, openOffer }) {
  const messages = applications.map(mailFor);
  const selected = messages.find((m) => m.id === selectedId) || messages[0];
  const [starred, setStarred] = useState([]);
  return <section className="mailbox"><aside className="mail-folders"><button className="compose">New message</button><button className="active"><Inbox size={18} /> Inbox <b>{messages.length}</b></button><button><Star size={18} /> Starred</button><button><Send size={18} /> Sent</button></aside>
    <div className="mail-list"><div className="mail-search"><Search size={17} /> Search mail</div>{messages.map((message) => <button key={message.id} className={selected?.id === message.id ? "active" : ""} onClick={() => setSelectedId(message.id)}><Avatar text={message.initials} /><div><strong>{message.from}</strong><span>{message.subject}</span><small>{message.preview}</small></div><time>09:42</time></button>)}</div>
    <article className="mail-reader">{selected ? <><div className="mail-tools"><ArrowLeft size={19} /><span /><button className={starred.includes(selected.id) ? "starred" : ""} onClick={() => setStarred((current) => current.includes(selected.id) ? current.filter((id) => id !== selected.id) : [...current, selected.id])} title="Star email"><Star size={19} fill={starred.includes(selected.id) ? "currentColor" : "none"} /></button><MoreVertical size={19} /></div><h1>{selected.subject}</h1><div className="sender-line"><Avatar text={selected.initials} /><div><strong>{selected.from}</strong><span>to me</span></div><time>8 Jul 2026, 09:42</time></div><div className="mail-body">{selected.body.map((p) => <p key={p}>{p}</p>)}</div>{selected.action === "interview" && <button className="primary-button" onClick={openInterview}>Start interview</button>}{selected.action === "offer" && <button className="primary-button" onClick={openOffer}>Review offer and contract</button>}</> : <Empty icon={Mail} title="Your inbox is ready" text="Application updates will arrive here." />}</article>
  </section>;
}

function Interview({ application, onSubmit }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [format] = useState(() => Math.random() > .5 ? "online" : "office");
  const [speaking, setSpeaking] = useState(true);
  const [questionBank, setQuestionBank] = useState(null);
  const [questionSource, setQuestionSource] = useState("Preparing interview");
  const [voiceOn, setVoiceOn] = useState(true);
  const currentRound = application?.round || 1;
  const totalRounds = application?.job.interviewRounds || 1;
  const setup = currentRound === 1 && totalRounds > 1
    ? { title: "Hiring manager conversation", lead: application?.job.interviewer, role: application?.job.interviewerRole, members: [] }
    : currentRound < totalRounds
      ? { title: "Technical panel", lead: "Tom Reyes", role: "Data Engineer", members: ["Lebo · Analyst", "Daniel · Data Engineer"] }
      : totalRounds === 1
        ? { title: "Hiring team interview", lead: application?.job.interviewer, role: application?.job.interviewerRole, members: ["Team representative"] }
        : { title: "Senior team panel", lead: "Elena Cho", role: "Chief Financial Officer", members: ["Priya · Senior Analyst", "Marcus · VP Marketing", "Tom · Data Engineer"] };
  const interviewerAsset = /Priya|Elena|Amara/i.test(setup.lead || "")
    ? "/assets/people/executive-burgundy-gesturing.webp"
    : "/assets/people/executive-blue-speaking.webp";
  useEffect(() => {
    if (!application) return undefined;
    if (currentRound > 1) return undefined;
    let active = true;
    async function prepareInterview() {
      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "interview",
            persona: "Priya",
            message: `Create round ${application.round || 1} interview questions.`,
            context: `Company: ${application.job.company}. Role: ${application.job.title}. Interview format: ${setup.title}. Lead interviewer: ${setup.lead}, ${setup.role}.`
          })
        });
        const payload = await response.json();
        if (!response.ok || !payload.data?.questions?.length) throw new Error("Generated interview unavailable");
        if (active) { setQuestionBank(payload.data.questions); setQuestionSource("Adaptive interview"); }
      } catch {
        const response = await fetch("/data/simulation-content.json");
        const payload = await response.json();
        if (active) { setQuestionBank(payload.interviewQuestions); setQuestionSource("Saved interview"); }
      }
    }
    prepareInterview();
    return () => { active = false; };
  }, [application, setup.lead, setup.role, setup.title]);
  useEffect(() => {
    setSpeaking(true);
    const timer = setTimeout(() => setSpeaking(false), 1350);
    return () => clearTimeout(timer);
  }, [index]);
  useEffect(() => {
    if (!voiceOn || !questionBank?.[index] || !("speechSynthesis" in window)) return undefined;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questionBank[index].question);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => /en-ZA|South Africa/i.test(`${voice.lang} ${voice.name}`)) || voices.find((voice) => voice.lang.startsWith("en")) || null;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [index, questionBank, voiceOn]);
  if (!application) return <Empty icon={CalendarDays} title="No interview scheduled" text="An employer must invite you before an interview appears." />;
  if (currentRound > 1 && currentRound < totalRounds) return <TechnicalInterview application={application} onSubmit={onSubmit} />;
  if (currentRound === totalRounds && totalRounds > 1) return <TeamAssessment application={application} onSubmit={onSubmit} />;
  if (!questionBank) return <section className="interview-loading"><div className="result-emblem"><Video size={32} /></div><p className="overline">{application.job.company}</p><h1>{questionSource}</h1><p>{application.job.interviewer} is preparing questions for round {application.round || 1}.</p></section>;
  const question = questionBank[index];
  function next() {
    const nextAnswers = [...answers, selected];
    if (index === questionBank.length - 1) onSubmit(nextAnswers.reduce((score, answer, i) => score + (answer === questionBank[i].correct ? 1 : 0), 0));
    else { setAnswers(nextAnswers); setIndex((i) => i + 1); setSelected(null); }
  }
  return <section className={`interview-room ${format} ${setup.members.length ? "panel-interview" : "solo-interview"}`}><header><div><p className="overline">{application.job.company} · Round {currentRound} of {totalRounds}</p><h1>{application.job.title}</h1></div><div className="interview-format">{format === "online" ? <Video size={16} /> : <Building2 size={16} />}<span>{setup.title} · {format === "online" ? "video" : "in office"}</span></div><button className="voice-button" onClick={() => setVoiceOn((value) => !value)} title={voiceOn ? "Mute interviewer" : "Enable interviewer voice"}>{voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><span>{questionSource} · {index + 1} of {questionBank.length}</span></header><div className="interview-scene"><div className="office-window" /><div className={`speech-bubble ${speaking ? "speaking" : ""}`}><strong>{setup.lead} asks</strong><span>{question.question}</span>{speaking && <i><b /><b /><b /></i>}</div>{setup.members.length > 0 && <div className="interview-panel-members">{setup.members.map((member, memberIndex) => <div key={member} className={`panel-member member-${memberIndex}`}><Person faculty /><span>{member}</span></div>)}</div>}<img className="interviewer-3d" src={interviewerAsset} alt={`${setup.lead}, ${setup.role}`} /><div className="interviewer-nameplate"><strong>{setup.lead}</strong><small>{setup.role}</small></div><div className="desk"><span className="laptop">{application.job.company.split(" ")[0].toUpperCase()}</span></div>{format === "online" && <div className="video-controls"><span /><span className="end-call" /><span /></div>}</div><article key={index} className="question-panel"><span>{question.category || "Interview"}</span><h2>Your response</h2>{question.options.map((answer, i) => <button className={selected === i ? "selected" : ""} key={answer} onClick={() => setSelected(i)}><b>{i === 0 ? "A" : "B"}</b>{answer}<Check size={18} /></button>)}<button className="primary-button" disabled={selected === null} onClick={next}>{index === questionBank.length - 1 ? "Submit interview" : "Answer and continue"} <ChevronRight size={17} /></button></article></section>;
}

function TechnicalInterview({ application, onSubmit }) {
  const tasks = [
    ["Find customers who have never placed an order.", "SELECT c.customer_id FROM customers c LEFT JOIN orders o ON c.customer_id=o.customer_id WHERE o.order_id IS NULL;", "SELECT customer_id FROM customers INNER JOIN orders USING(customer_id);", 0],
    ["Calculate total order value per customer.", "SELECT customer_id, SUM(order_value) FROM orders GROUP BY customer_id;", "SELECT customer_id, order_value FROM orders ORDER BY order_value;", 0],
    ["Return only customers whose total order value exceeds 5,000.", "SELECT customer_id FROM orders WHERE SUM(order_value)>5000;", "SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(order_value)>5000;", 1],
    ["The join creates duplicate customer rows. What should you inspect first?", "Whether orders contains many rows per customer and whether the output grain is intentional.", "Whether customers is sorted alphabetically.", 0],
    ["Return each customer’s latest order using a window function.", "ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date DESC)", "COUNT(*) OVER(ORDER BY customer_id)", 0]
  ];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [voiceOn, setVoiceOn] = useState(true);
  useEffect(() => {
    if (!voiceOn || !("speechSynthesis" in window)) return undefined;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(tasks[index][0]);
    utterance.rate = 0.93;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [index, voiceOn]);
  function next() {
    const nextAnswers = [...answers, selected];
    if (index === tasks.length - 1) {
      const correct = nextAnswers.reduce((total, answer, i) => total + (answer === tasks[i][3] ? 1 : 0), 0);
      onSubmit(correct >= 4 ? 8 : correct);
    } else {
      setAnswers(nextAnswers); setSelected(null); setIndex((value) => value + 1);
    }
  }
  const task = tasks[index];
  return <main className="technical-interview"><header><div><p className="overline">{application.job.company} · Technical round</p><h1>SQL work sample</h1></div><button className="voice-button" onClick={() => setVoiceOn((value) => !value)}>{voiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><span>Task {index + 1} of {tasks.length}</span></header><div className="technical-layout"><section className="table-preview"><div><h2>customers</h2><table><thead><tr><th>customer_id</th><th>region</th><th>status</th></tr></thead><tbody><tr><td>C101</td><td>Gauteng</td><td>Active</td></tr><tr><td>C102</td><td>Western Cape</td><td>Churned</td></tr><tr><td>C103</td><td>Gauteng</td><td>Active</td></tr></tbody></table></div><div><h2>orders</h2><table><thead><tr><th>order_id</th><th>customer_id</th><th>order_value</th></tr></thead><tbody><tr><td>O501</td><td>C101</td><td>2,400</td></tr><tr><td>O502</td><td>C101</td><td>3,100</td></tr><tr><td>O503</td><td>C102</td><td>800</td></tr></tbody></table></div></section><section className="sql-terminal"><div className="terminal-top"><span>SQL WORKBENCH</span><b>CONNECTED</b></div><h2>{task[0]}</h2>{[task[1], task[2]].map((query, option) => <button className={selected === option ? "selected" : ""} onClick={() => setSelected(option)} key={query}><b>{option === 0 ? "A" : "B"}</b><code>{query}</code></button>)}<footer><span>Think about table grain and join behaviour.</span><button className="primary-button" disabled={selected === null} onClick={next}>{index === tasks.length - 1 ? "Submit technical round" : "Run and continue"}</button></footer></section></div></main>;
}

function TeamAssessment({ application, onSubmit }) {
  const games = [
    ["Priority sprint", "A loyalty outage affects 18% of customers while a dashboard typo affects the board deck. What goes first?", "Contain the customer-facing outage and notify stakeholders.", "Fix the visible board typo before anyone notices.", 0],
    ["Signal or noise", "Churn rises only in the migrated cohort, while overall traffic is stable. Which clue deserves the next test?", "The migration cohort and loyalty balance integrity.", "The colour used on the acquisition campaign.", 0],
    ["Team judgement", "Two senior colleagues disagree during the exercise. What is your strongest contribution?", "Restate the decision, evidence, and assumptions so the team can compare options.", "Wait silently for the most senior person to decide.", 0],
    ["Pattern check", "Complaints rise, redemption failures rise, and churn rises in the same cohort. What is the disciplined conclusion?", "The signals converge, but causality still needs validation.", "The loyalty system is definitely the sole cause.", 0],
    ["Decision room", "The team has ten minutes left and incomplete evidence. What should you present?", "A provisional recommendation with confidence, risks, and the next validation step.", "A confident final answer without limitations.", 0]
  ];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const game = games[index];
  useEffect(() => {
    if (!("speechSynthesis" in window)) return undefined;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(game[1]);
    utterance.rate = 0.94;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [index]);
  function next() {
    const nextAnswers = [...answers, selected];
    if (index === games.length - 1) {
      const correct = nextAnswers.reduce((total, answer, i) => total + (answer === games[i][4] ? 1 : 0), 0);
      onSubmit(correct >= 4 ? 8 : correct);
    } else { setAnswers(nextAnswers); setSelected(null); setIndex((value) => value + 1); }
  }
  return <main className="team-assessment"><header><div><p className="overline">{application.job.company} · Final team stage</p><h1>Collaborative assessment</h1></div><span>Exercise {index + 1} of {games.length}</span></header><section className="assessment-room"><img className="final-panel-asset" src="/assets/people/celebrating-team-table.webp" alt="Several members of the hiring team seated around a table" /><div className="game-board"><span>{game[0]}</span><strong>{String(index + 1).padStart(2, "0")}</strong></div></section><article className="game-question"><p className="overline">Team exercise</p><h2>{game[1]}</h2>{[game[2], game[3]].map((option, optionIndex) => <button className={selected === optionIndex ? "selected" : ""} onClick={() => setSelected(optionIndex)} key={option}><b>{optionIndex === 0 ? "A" : "B"}</b>{option}</button>)}<button className="primary-button" disabled={selected === null} onClick={next}>{index === games.length - 1 ? "Finish team assessment" : "Lock decision"}</button></article></main>;
}

function Offer({ profile, accepted, onAccept, onOpenWork }) {
  const [checked, setChecked] = useState(false);
  const [signature, setSignature] = useState("");
  return <section className="offer-page"><div className="offer-document"><div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div><p>8 July 2026</p><h1>Offer of Employment</h1><p>Dear {profile.name},</p><p>We are pleased to offer you the position of <strong>Junior Data Analyst</strong>, reporting to the Analytics Manager.</p><dl><div><dt>Start date</dt><dd>3 August 2026</dd></div><div><dt>Gross salary</dt><dd>R32,000 per month</dd></div><div><dt>Annual cost to company</dt><dd>R384,000</dd></div><div><dt>Probation</dt><dd>3 months</dd></div><div><dt>Working model</dt><dd>Hybrid · 3 office days</dd></div><div><dt>Leave</dt><dd>20 working days annually</dd></div></dl><p>This offer is subject to identity, qualification, and reference verification. The attached employment agreement includes confidentiality, data protection, and notice terms.</p>{!accepted ? <div className="contract-sign"><label><input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} /> I have read and accept the employment agreement and offer terms.</label><label>Type your full legal name as your electronic signature<input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder={profile.name} /></label><button className="primary-button" disabled={!checked || signature.trim().toLowerCase() !== profile.name.trim().toLowerCase()} onClick={onAccept}>Sign and accept offer</button></div> : <div className="contract-success"><ShieldCheck size={25} /><div><strong>Contract signed</strong><span>A signed copy has been sent to your inbox.</span></div><button className="primary-button" onClick={onOpenWork}>Open employee workspace</button></div>}</div></section>;
}

function CV({ profile, transcript, certificate, workRecord }) {
  return <section className="cv-page"><div className="cv-actions"><div><p className="overline">Step one · Build your CV</p><h1>Your résumé</h1><span className="auto-update-note">This career record keeps growing. Download an editable template now; export the final version when your story is complete.</span></div><button className="icon-text" onClick={() => downloadCvTemplate(profile)}><Download size={18} /> Download editable template</button></div><div className="cv-builder-layout"><article className="cv-document"><header><h1>{profile.name}</h1><p>{certificate ? "Junior Data Analyst" : "Graduate Data Analyst"}</p><span>Johannesburg · South Africa · {certificate ? "employed" : "available immediately"}</span></header><section><h2>Profile</h2><p>Analytical graduate with a foundation in {profile.favoriteModule}, SQL, reporting, and practical problem-solving. Interested in {profile.afterUni}.</p></section>{certificate && <section className="cv-new-entry"><h2>Experience</h2><div className="cv-line"><div><strong>Junior Data Analyst · Solstice Retail Group</strong><span>Customer Intelligence</span></div><time>August 2026 – Present</time></div><ul><li>Passed the {certificate.track} technical readiness assessment with {certificate.score}%.</li>{workRecord && <li>Completed senior stakeholder onboarding and documented the agreed customer-metric investigation plan.</li>}{workRecord && <li>Logged {formatMinutes(workRecord.totalMinutes)} of verified onboarding and workplace activity.</li>}</ul></section>}<section><h2>Education</h2><div className="cv-line"><div><strong>{profile.degree}</strong><span>{profile.university}</span></div><time>Completed 2026</time></div><p>Final weighted average: {transcript.average}%</p></section><section><h2>Core skills</h2><p>SQL · Power BI · Excel · Data cleaning · Data storytelling · Stakeholder communication</p></section>{certificate && <section><h2>Certifications</h2><div className="cv-line"><div><strong>Solstice {certificate.track} Technical Readiness</strong><span>Verified score: {certificate.score}% · Completed in {formatMinutes(certificate.minutes)}</span></div><time>August 2026</time></div></section>}</article><aside className="cv-expert-rail"><img src="/assets/people/senior-executive-coffee-full.webp" alt="" /><p className="overline">Career expert lessons</p><h2>Make the first scan count.</h2><a href="https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/" target="_blank" rel="noreferrer"><strong>Write for fast readers</strong><span>Harvard: specific, active, fact-based language</span></a><a href="https://www.careers.ox.ac.uk/node/768221" target="_blank" rel="noreferrer"><strong>Build an ATS-readable CV</strong><span>Oxford: clarity, relevance, and tailoring</span></a><a href="https://careerservices.upenn.edu/channels/resume/" target="_blank" rel="noreferrer"><strong>Use a clean graduate format</strong><span>UPenn: one page, simple structure, visible evidence</span></a><div><strong>Before applying</strong><ul><li>Tailor the profile to the role.</li><li>Use action verbs and outcomes.</li><li>Keep formatting simple.</li><li>Name the final PDF professionally.</li></ul></div></aside></div></section>;
}

function WorkPortal({ profile, certificate, workRecord, onCertified, onWorkComplete, onExit }) {
  const [phase, setPhase] = useState("dashboard");
  if (!certificate) return <ReadinessAssessment profile={profile} onCertified={onCertified} onExit={onExit} />;
  if (phase === "meeting") return <BoardroomMeeting profile={profile} certificate={certificate} onComplete={(meeting) => { onWorkComplete({ ...workRecord, ...meeting, firstMeetingComplete: true }); setPhase("dashboard"); }} />;
  if (phase === "lesson-one") return <ProblemDefinitionLesson profile={profile} onComplete={(lesson) => { onWorkComplete({ ...workRecord, ...lesson, lessonOneComplete: true, totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 360 }); setPhase("project"); }} />;
  if (phase === "project") return <GuidedProject profile={profile} certificate={certificate} workRecord={workRecord} onUpdate={onWorkComplete} onExit={onExit} />;
  return <WorkLandingDashboard profile={profile} certificate={certificate} workRecord={workRecord} onMeeting={() => setPhase("meeting")} onLesson={() => setPhase("lesson-one")} onExit={onExit} />;
}

function WorkLandingDashboard({ profile, certificate, workRecord, onMeeting, onLesson, onExit }) {
  const [tab, setTab] = useState("teams");
  const lessonReady = Boolean(workRecord?.firstMeetingComplete);
  return <main className="employee-dashboard"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div><div className="workspace-search"><Search size={17} /> Search Solstice</div><WorkClock minutes={workRecord?.totalMinutes || certificate.minutes} /><button className="profile-button"><Avatar text={initials(profile.name)} /></button></header><div className="employee-shell"><aside><button className={tab === "teams" ? "active" : ""} onClick={() => setTab("teams")}><MessageCircle size={20} /><span>Teams</span></button><button className={tab === "mail" ? "active" : ""} onClick={() => setTab("mail")}><Mail size={20} /><span>Mail</span></button><button className={tab === "engagement" ? "active" : ""} onClick={() => setTab("engagement")}><Star size={20} /><span>Engagement</span></button><button onClick={onExit}><ArrowLeft size={20} /><span>Career</span></button></aside><section className="employee-content">{tab === "teams" && <><div className="employee-heading"><p className="overline">Customer Insights</p><h1>Good morning, {profile.name.split(" ")[0]}.</h1><p>{lessonReady ? "Priya has sent your first work brief. Nothing is labelled as training; treat it as the job." : `Your ${certificate.track} readiness certificate is verified. Review your workspace and join the welcome meeting when you are ready.`}</p></div><div className="dashboard-grid"><article><img src="/assets/people/office-team-discussion.webp" alt="" /><span>Customer Insights</span><strong>6 teammates</strong><small>{lessonReady ? "Priya: I sent your first set of projects." : "Priya: Welcome to the team."}</small></article><article><img src="/assets/people/coworkers-desk-learning.webp" alt="" /><span>Onboarding</span><strong>First-week support</strong><small>Tools, policies, people, and live work.</small></article></div></>}{tab === "mail" && <><div className="employee-heading"><p className="overline">Company mail</p><h1>Inbox</h1></div>{lessonReady && <button className="meeting-email unread" onClick={onLesson}><Avatar text="PS" /><div><strong>Priya Shah</strong><span>Your first week: open and closed work</span><small>Choose where you can contribute, then prepare for a stakeholder conversation.</small></div><time>10:04</time><ChevronRight size={18} /></button>}<button className="meeting-email" onClick={onMeeting}><Avatar text="PS" /><div><strong>Priya Shah</strong><span>Invitation: Customer Insights welcome meeting</span><small>Meet the team and hear about your first assignment.</small></div><time>09:12</time><ChevronRight size={18} /></button>{workRecord?.firstMeetingComplete && <div className="meeting-complete-note"><Check size={18} /> Welcome meeting completed and saved.</div>}</>}{tab === "engagement" && <><div className="employee-heading"><p className="overline">Employee engagement</p><h1>Your first week</h1></div><div className="engagement-list"><label><input type="checkbox" defaultChecked /><span>Technical readiness verified</span></label><label><input type="checkbox" checked={Boolean(workRecord?.firstMeetingComplete)} readOnly /><span>Meet the Customer Insights team</span></label><label><input type="checkbox" checked={Boolean(workRecord?.lessonOneComplete)} readOnly /><span>Define the loyalty problem</span></label><label><input type="checkbox" /><span>Complete payroll and banking details</span></label></div></>}</section></div></main>;
}

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
  const [openedResearch, setOpenedResearch] = useState([]);
  const [meetingTime, setMeetingTime] = useState("");
  const [observeScene, setObserveScene] = useState(0);
  const [contribution, setContribution] = useState("");
  const [contributionFeedback, setContributionFeedback] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [branches, setBranches] = useState(["", "", "", ""]);
  const [soloScore, setSoloScore] = useState(null);
  const [grillMessages, setGrillMessages] = useState([{ speaker: "Marcus", text: "You have four branches. Why should I believe pricing is only one possibility rather than the answer?" }]);
  const [grillDraft, setGrillDraft] = useState("");
  const [resolution, setResolution] = useState(18);
  const [grillTime, setGrillTime] = useState(600);
  const [grillLoading, setGrillLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [requestFields, setRequestFields] = useState(["customer_id", "loyalty_status"]);
  const [dateRange, setDateRange] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const intake = "A problem statement turns a vague concern into a decision that evidence can support. Name the stakeholder, the population, the metric, the comparison, and the time period. Scope is not a smaller version of the answer. It is the boundary that keeps the work useful. A strong analyst does not accept every assumption in the request. They separate the situation from the complication, define the question, and hold the answer as a hypothesis until the data survives testing. A MECE issue tree helps by separating possible causes without overlap while covering the important ground.";
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
  const observeDialogue = [
    ["priya", "Let’s not start with columns. Elena, what decision has to be made when this work is done?"],
    ["elena", "Whether we change the loyalty experience before the holiday campaign. I need to know who is affected and where the failure occurs."],
    ["marcus", "Pricing changed at the same time. If we ignore that, the analysis will be technically neat and commercially useless."],
    ["priya", "Good. Our issue tree keeps pricing, loyalty mechanics, service experience, and customer mix separate. Together they cover the credible causes."]
  ];
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
    if (stage !== "brief" || !playing) return undefined;
    const timer = window.setInterval(() => setWordIndex((current) => {
      if (current >= chunks.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), Math.round((60000 / wpm) * (phraseMode ? 3 : 1)));
    return () => window.clearInterval(timer);
  }, [stage, playing, wpm, phraseMode, chunks.length]);
  useEffect(() => {
    if (stage !== "observe") return undefined;
    const [characterKey, line] = observeDialogue[observeScene];
    speakAsCharacter(characterKey, line);
    return () => window.speechSynthesis?.cancel();
  }, [stage, observeScene]);
  useEffect(() => {
    if (stage !== "grill" || resolution >= 80 || grillTime <= 0) return undefined;
    const timer = window.setInterval(() => setGrillTime((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [stage, resolution, grillTime]);
  function move(next) { setStage(next); }
  function saveNote(text = noteDraft, tag = noteTag) {
    if (!text.trim()) return;
    const next = [...notes, { id: Date.now(), text: text.trim(), tag, created: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }];
    setNotes(next); localStorage.setItem("plato-work-notes", JSON.stringify(next)); setNoteDraft("");
  }
  function pinTerm(term) {
    if (!term || glossary.includes(term)) return;
    setGlossary((current) => [...current, term]);
    saveNote(`${term}: pinned during the problem-definition intake.`, "Glossary");
  }
  function answerCheck(option) {
    const next = checkIndex + 1;
    if (next >= checks.length) move("research"); else setCheckIndex(next);
  }
  function assessContribution() {
    const lower = contribution.toLowerCase();
    const strong = ["communication", "awareness", "engagement", "expectation"].some((term) => lower.includes(term));
    setContributionFeedback(strong ? "Priya: That fits under customer experience without duplicating pricing or service operations. Add it." : "Priya: Useful instinct. Name the distinct cause, then check whether it overlaps an existing branch.");
  }
  function assessSolo() {
    const populated = branches.filter((branch) => branch.trim().length >= 8).length;
    const unique = new Set(branches.map((branch) => branch.trim().toLowerCase())).size;
    const definitionTerms = ["customer", "retention", "gauteng", "july", "compare", "loyalty"].filter((term) => problemStatement.toLowerCase().includes(term)).length;
    setSoloScore(Math.min(100, populated * 15 + (unique === 4 ? 15 : 0) + definitionTerms * 5));
  }
  async function sendGrill() {
    if (grillDraft.trim().length < 12 || grillLoading) return;
    const answer = grillDraft.trim();
    const useful = ["compare", "segment", "validate", "metric", "identifier", "evidence", "exclude", "scope", "hypothesis"].filter((term) => answer.toLowerCase().includes(term)).length;
    const gain = Math.max(8, Math.min(32, useful * 5));
    const nextResolution = Math.min(100, resolution + gain);
    setGrillMessages((current) => [...current, { speaker: "You", text: answer }]);
    setGrillDraft(""); setGrillLoading(true); setResolution(nextResolution);
    if (nextResolution >= 80) {
      setGrillMessages((current) => [...current, { speaker: "Priya", text: "That holds. The scope is explicit, the alternatives are testable, and you have said what the analysis will not claim." }]);
      setGrillLoading(false); return;
    }
    const fallback = [
      "Elena: Which customer group is inside your scope, and which one is deliberately outside it?",
      "Marcus: What evidence would make you reject your preferred explanation?",
      "Priya: State the decision this analysis will support in one sentence."
    ][Math.min(2, grillMessages.filter((item) => item.speaker === "You").length)];
    try {
      const response = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: answer, persona: "Priya", context: "You are chairing a ten-minute problem-definition review. Privately test scope, MECE separation, decision relevance, falsifiability, and metric clarity. Ask one concise pushback question. Do not praise confidence and do not give the answer." }) });
      const payload = await response.json();
      setGrillMessages((current) => [...current, { speaker: "Priya", text: payload.reply || fallback }]);
    } catch {
      setGrillMessages((current) => [...current, { speaker: fallback.split(":")[0], text: fallback.split(": ").slice(1).join(": ") }]);
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
  return <main className="lesson-job"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE · CUSTOMER INSIGHTS</strong></div><div className="lesson-stage-name"><span>Week one</span><strong>Customer loyalty investigation</strong></div><button className={notesOpen ? "active" : ""} onClick={() => setNotesOpen((value) => !value)}><StickyNote size={18} /> Notes <b>{notes.length}</b></button></header><div className={`lesson-job-shell ${notesOpen ? "notes-visible" : ""}`}><aside className="lesson-progress">{labels.map((label, index) => <span className={index < stageIndex ? "done" : index === stageIndex ? "current" : ""} key={label}>{index < stageIndex ? <Check size={14} /> : index + 1}<b>{label}</b></span>)}</aside><section className="lesson-work">
    {stage === "inbox" && <div className="lesson-inbox"><div className="lesson-email-head"><Avatar text="PS" /><div><strong>Priya Shah</strong><span>Senior Analyst · 10:04</span></div></div><h1>Your first week: choose where to contribute</h1><p>Hi {profile.name.split(" ")[0]},</p><p>I’ve put the current Customer Insights work below. The open work needs someone to shape it. The closed work already has a defined output. Pick the kind of responsibility you want to take into the stakeholder meeting.</p><div className="project-choice"><button className={projectType === "open" ? "selected" : ""} onClick={() => setProjectType("open")}><span>Open project</span><strong>Customers seem less loyal</strong><p>Choose the angle, definition, evidence, and depth. Bring whatever you think the decision needs.</p></button><button className={projectType === "closed" ? "selected" : ""} onClick={() => setProjectType("closed")}><span>Closed project</span><strong>Q1 return rate by region</strong><p>Deliver a fixed regional table and commentary by Friday. The metric and period are already agreed.</p></button></div><button className="primary-button" onClick={() => move("brief")}>Accept {projectType} work <ChevronRight size={17} /></button></div>}
    {stage === "brief" && <div className="speed-reader"><p className="overline">Preparation note · focused reading</p><h1>Read before the stakeholder call</h1><div className={`rsvp-word ${currentTerm ? "key-term" : ""}`}>{currentChunk}</div><div className="reader-progress"><span style={{ width: `${((wordIndex + 1) / chunks.length) * 100}%` }} /></div><div className="reader-controls"><button onClick={() => setWordIndex((value) => Math.max(0, value - (phraseMode ? 4 : 12)))}><ArrowLeft size={17} /> Sentence</button><button className="play-control" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button><label><span>{wpm} wpm</span><input type="range" min="150" max="500" step="10" value={wpm} onChange={(event) => setWpm(Number(event.target.value))} /></label><label className="chunk-toggle"><input type="checkbox" checked={phraseMode} onChange={(event) => { setPhraseMode(event.target.checked); setWordIndex(0); }} /> Phrase chunks</label></div>{currentTerm && <button className="pin-term" onClick={() => pinTerm(currentTerm)}><BookOpen size={16} /> Pin “{currentTerm}” to glossary</button>}<div className="glossary-strip">{glossary.map((term) => <span key={term}>{term}</span>)}</div><button className="primary-button" disabled={wordIndex < chunks.length - 1} onClick={() => move("check")}>Continue to quick recall</button></div>}
    {stage === "check" && <div className="lesson-check"><p className="overline">Quick recall · {checkIndex + 1} of {checks.length}</p><h1>{check[0]}</h1>{[check[1], check[2]].map((option, index) => <button onClick={() => answerCheck(index)} key={option}><b>{index === 0 ? "A" : "B"}</b>{option}</button>)}</div>}
    {stage === "research" && <div className="research-desk"><div className="vague-ask"><Avatar text="EC" /><div><strong>Elena Cho · Customer Operations</strong><p>Customers seem unhappy since the loyalty changes. Can you look into it?</p></div></div><h1>Look for context before booking the room.</h1><p>Open at least two records. Past work may reveal definitions, system changes, and assumptions hidden inside the request.</p><div className="research-grid">{researchItems.map((item, index) => <article className={openedResearch.includes(index) ? "opened" : ""} key={item[1]}><span>{item[0] === "archive" ? <Archive size={18} /> : <Library size={18} />}{item[2]}</span><h2>{item[1]}</h2><p>{item[3]}</p>{item[4] ? <a href={item[4]} target="_blank" rel="noreferrer" onClick={() => setOpenedResearch((current) => current.includes(index) ? current : [...current, index])}>Read original source <ExternalLink size={14} /></a> : <button onClick={() => setOpenedResearch((current) => current.includes(index) ? current : [...current, index])}>{openedResearch.includes(index) ? "Added to working context" : "Open record"}</button>}</article>)}</div><button className="primary-button" disabled={openedResearch.length < 2} onClick={() => move("calendar")}>Schedule a scoping meeting</button></div>}
    {stage === "calendar" && <div className="lesson-calendar"><p className="overline">Solstice calendar · Priya Shah</p><h1>Find thirty minutes with your senior.</h1><div className="calendar-slots">{["09:30", "11:00", "14:30"].map((time) => <button className={meetingTime === time ? "selected" : ""} onClick={() => setMeetingTime(time === "09:30" ? "11:00" : time)} key={time}><strong>{time}</strong><span>{time === "09:30" ? "Priya proposes 11:00" : "Available · 30 min"}</span></button>)}</div>{meetingTime && <div className="calendar-confirm"><Check size={20} /><span><strong>Accepted by Priya</strong><small>Problem framing · Boardroom 4 · {meetingTime}</small></span></div>}<button className="primary-button" disabled={!meetingTime} onClick={() => move("observe")}>Join at {meetingTime || "selected time"}</button></div>}
    {stage === "observe" && <div className="observed-meeting"><div className="meeting-visual"><img src="/assets/people/meeting-side-presentation.webp" alt="Senior team discussing an issue tree at a whiteboard" /><div className="whiteboard-tree"><strong>Why is loyalty declining?</strong><span>Pricing & value</span><span>Loyalty mechanics</span><span>Service experience</span><span>Customer mix</span></div></div><div className="meeting-caption"><img src={characterBible[observeDialogue[observeScene][0]].portrait} alt="" /><div><strong>{characterBible[observeDialogue[observeScene][0]].name}</strong><span>{characterBible[observeDialogue[observeScene][0]].role}</span><p>{observeDialogue[observeScene][1]}</p></div></div><button className="primary-button" onClick={() => observeScene < observeDialogue.length - 1 ? setObserveScene((value) => value + 1) : (saveNote(observeDialogue.map(([key, line]) => `${characterBible[key].name}: ${line}`).join("\n"), "Meeting transcript"), move("contribute"))}>{observeScene < observeDialogue.length - 1 ? "Continue listening" : "Save transcript and contribute"} <ChevronRight size={17} /></button></div>}
    {stage === "contribute" && <div className="whiteboard-contribution"><p className="overline">Priya has unlocked the whiteboard</p><h1>“What would you add here?”</h1><p>Add one distinct sub-branch beneath <strong>Service experience</strong>. It should explain a possible cause without repeating pricing, loyalty mechanics, or customer mix.</p><div className="tree-editor"><span>Service experience</span><span>Delivery failure</span><span>Support resolution</span><label><input value={contribution} onChange={(event) => setContribution(event.target.value)} placeholder="Type another distinct branch…" /></label></div><button className="primary-button" disabled={contribution.trim().length < 5} onClick={assessContribution}>Add branch</button>{contributionFeedback && <div className="in-fiction-feedback">{contributionFeedback}</div>}{contributionFeedback && <button className="text-button" onClick={() => move("solo")}>Open my solo work brief <ChevronRight size={16} /></button>}</div>}
    {stage === "solo" && <div className="solo-framing"><p className="overline">Private working document</p><h1>Frame the loyalty investigation.</h1><label>Problem statement<textarea value={problemStatement} onChange={(event) => setProblemStatement(event.target.value)} placeholder="Among which customers, which metric changed, over what period, compared with what, and for which decision?" /></label><div className="branch-editor">{branches.map((branch, index) => <label key={index}><span>Branch {index + 1}</span><input value={branch} onChange={(event) => setBranches((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder={["Pricing and perceived value", "Loyalty programme mechanics", "Service experience", "Customer and channel mix"][index]} /></label>)}</div><button className="primary-button" onClick={assessSolo}>Check structure</button>{soloScore !== null && <div className={`structure-score ${soloScore >= 70 ? "passed" : ""}`}><strong>{soloScore}%</strong><span>{soloScore >= 70 ? "The structure is ready to defend." : "Tighten the population, period, comparison, and non-overlapping branches."}</span></div>}{soloScore >= 70 && <button className="text-button" onClick={() => move("grill")}>Lead the review meeting <ChevronRight size={16} /></button>}</div>}
    {stage === "grill" && <div className="grill-room"><header><div><span className="live-dot" /> Problem definition review</div><time>{String(Math.floor(grillTime / 60)).padStart(2, "0")}:{String(grillTime % 60).padStart(2, "0")}</time></header><div className="grill-layout"><div className="grill-people"><img src="/assets/people/meeting-overhead-team.webp" alt="Senior team around the boardroom table" /><div className="resolution-meter"><span style={{ width: `${resolution}%` }} /><strong>{resolution}% resolved</strong></div></div><div className="grill-chat">{grillMessages.map((message, index) => <p className={message.speaker === "You" ? "mine" : ""} key={index}><strong>{message.speaker}</strong>{message.text}</p>)}{grillLoading && <p><strong>Priya</strong>Considering the structure…</p>}{resolution < 80 && grillTime > 0 && <div className="grill-compose"><textarea value={grillDraft} onChange={(event) => setGrillDraft(event.target.value)} placeholder="Defend the scope with evidence, exclusions, and a testable comparison…" /><button className={listening ? "listening" : ""} onClick={startDictation} title="Speak response"><Mic size={17} /></button><button onClick={sendGrill} disabled={grillDraft.trim().length < 12 || grillLoading}><Send size={17} /></button></div>}{grillTime === 0 && resolution < 80 && <div className="follow-up-notice">The meeting ended inconclusively. Priya scheduled a 20-minute follow-up; your current resolution is preserved.</div>}{(resolution >= 80 || grillTime === 0) && <button className="primary-button" onClick={() => move("request")}>Request the scoped data</button>}</div></div></div>}
    {stage === "request" && <div className="data-request"><div className="tom-header"><img src={characterBible.tom.portrait} alt="" /><div><strong>Tom Jacobs</strong><span>Data Engineering · ticket DE-208</span></div></div><h1>Specify the extract you actually need.</h1><p>Choose fields and constrain the period. Tom will preserve the imperfect keys so your analysis can audit the real joins.</p><div className="request-fields">{["customer_id", "loyalty_status", "region", "order_outcome", "points_variance", "support_category"].map((field) => <label key={field}><input type="checkbox" checked={requestFields.includes(field)} onChange={() => setRequestFields((current) => current.includes(field) ? current.filter((item) => item !== field) : [...current, field])} />{field}</label>)}</div><label className="date-request">Date range<select value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option value="">Select a bounded period</option><option>1 April – 31 July 2026</option><option>1 January – 31 July 2026</option><option>Last 30 days</option></select></label><button className="primary-button" onClick={submitRequest}>Send request to Tom</button>{requestStatus && <div className="tom-response"><img src={characterBible.tom.portrait} alt="" /><p>{requestStatus}</p></div>}{requestStatus.includes("approved") && <button className="text-button" onClick={() => onComplete({ lessonScore: soloScore, glossary, notesCount: notes.length, projectType })}>Open the data package and begin analysis <ChevronRight size={16} /></button>}</div>}
  </section>{notesOpen && <aside className="work-notes"><header><div><strong>Working notes</strong><span>Saved on this device</span></div><button onClick={() => setNotesOpen(false)}>×</button></header><div className="note-list"><label className="notes-search"><Search size={15} /><input value={noteSearch} onChange={(event) => setNoteSearch(event.target.value)} placeholder="Search notes and tags" /></label>{notes.length === 0 ? <p>No notes yet. Pin a term or capture what matters.</p> : notes.slice().reverse().filter((note) => `${note.tag} ${note.text}`.toLowerCase().includes(noteSearch.toLowerCase())).map((note) => <article key={note.id}><span>{note.tag} · {note.created}</span><p>{note.text}</p></article>)}</div><footer><select value={noteTag} onChange={(event) => setNoteTag(event.target.value)}><option>Loyalty problem</option><option>Meeting</option><option>Glossary</option><option>Data request</option></select><textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Write a useful note…" /><button disabled={!noteDraft.trim()} onClick={() => saveNote()}><StickyNote size={16} /> Save note</button></footer></aside>}</div></main>;
}

function speakAsCharacter(characterKey, text) {
  if (!("speechSynthesis" in window)) return;
  const character = characterBible[characterKey];
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en"));
  utterance.voice = voices[character.voiceIndex % Math.max(1, voices.length)] || null;
  utterance.rate = character.voiceRate;
  window.speechSynthesis.speak(utterance);
}

function ProblemSolvingAcademy({ profile, onComplete }) {
  const [stage, setStage] = useState("pretest");
  const [pretest, setPretest] = useState([]);
  const [scenarios, setScenarios] = useState(["", "", ""]);
  const [takeHome, setTakeHome] = useState("");
  const pretestQuestions = [
    ["A stakeholder says, “Customer loyalty is bad.” What comes first?", "Build a dashboard immediately", "Turn the vague concern into a specific, testable question", 1],
    ["Which issue tree is closer to MECE?", "Price, high prices, service, bad experience", "Acquisition, activation, retention, and reactivation", 1],
    ["In SCQA, what should the Answer contain?", "The recommendation or core finding", "Every query used in the analysis", 0],
    ["Why define a problem before analysing?", "To constrain evidence to a decision-relevant question", "To avoid speaking to stakeholders", 0]
  ];
  function answerPretest(option) {
    const next = [...pretest, option];
    setPretest(next);
    if (next.length === pretestQuestions.length) setStage("learn");
  }
  const question = pretestQuestions[pretest.length];
  if (stage === "pretest") return <main className="academy-screen"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Problem solving · Pre-test</span></header><section className="academy-pretest"><p className="overline">Before the lesson · {pretest.length + 1} of {pretestQuestions.length}</p><h1>{question[0]}</h1>{[question[1], question[2]].map((option, index) => <button onClick={() => answerPretest(index)} key={option}><b>{index === 0 ? "A" : "B"}</b>{option}</button>)}</section></main>;
  if (stage === "learn") return <main className="academy-screen"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Problem definition · SCQA · MECE</span></header><section className="academy-learn"><p className="overline">Learning case</p><h1>Structure the problem before touching the data.</h1><div className="framework-grid"><article><span>01</span><h2>Problem definition</h2><p>Translate a broad concern into a decision, population, metric, timeframe, and comparison.</p></article><article><span>02</span><h2>SCQA</h2><p>Situation establishes shared context. Complication creates tension. Question defines what must be resolved. Answer leads with the response.</p></article><article><span>03</span><h2>MECE</h2><p>Break the problem into branches that do not overlap and collectively cover the important possibilities.</p></article></div><div className="academy-resources"><a href="https://www.monash.edu/student-academic-success/excel-at-writing/how-to-write/business-paper-using-the-minto-approach" target="_blank" rel="noreferrer"><strong>Read: The Minto approach</strong><span>Monash University · SCQA and Pyramid Principle</span></a><a href="https://www.youtube.com/results?search_query=SCQA+framework+Barbara+Minto" target="_blank" rel="noreferrer"><strong>Watch: SCQA explained</strong><span>YouTube learning results</span></a><a href="https://www.youtube.com/results?search_query=MECE+principle+with+examples" target="_blank" rel="noreferrer"><strong>Watch: MECE with examples</strong><span>YouTube learning results</span></a><a href="https://www.mckinsey.com/careers/mckinsey-digital-assessment" target="_blank" rel="noreferrer"><strong>Explore: Gamified problem solving</strong><span>McKinsey Solve</span></a></div><button className="primary-button" onClick={() => setStage("practice")}>Practise in the workplace <ChevronRight size={17} /></button></section></main>;
  if (stage === "practice") {
    const prompts = [
      "Support says “loyalty is broken.” In a meeting, write one scoped problem statement covering customer group, metric, and period.",
      "Marketing blames pricing, Support blames points, and Operations blames delivery. Draft MECE branches that avoid overlap.",
      "You have five minutes with leadership. Draft a four-line SCQA update for the loyalty investigation."
    ];
    return <main className="academy-screen"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Workplace practice · 3 scenarios</span></header><section className="scenario-practice"><p className="overline">Real-world practice</p><h1>Do the work on screen.</h1>{prompts.map((prompt, index) => <label key={prompt}><span>Scenario {index + 1}</span><strong>{prompt}</strong><textarea value={scenarios[index]} onChange={(event) => setScenarios((current) => current.map((value, i) => i === index ? event.target.value : value))} placeholder="Draft your response…" /></label>)}<button className="primary-button" disabled={scenarios.some((value) => value.trim().length < 40)} onClick={() => setStage("take-home")}>Continue to take-home project</button></section></main>;
  }
  return <main className="academy-screen"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ACADEMY</strong></div><span>Take-home application</span></header><section className="take-home"><p className="overline">Final learning task</p><h1>Frame your first data project.</h1><p>Before downloading or querying anything, write the problem definition and an SCQA outline for the Solstice loyalty investigation. This becomes the brief for your guided Python and Power BI project.</p><textarea value={takeHome} onChange={(event) => setTakeHome(event.target.value)} placeholder={`Situation:\nComplication:\nQuestion:\nAnswer hypothesis:\n\nMECE investigation branches:`} /><button className="primary-button" disabled={takeHome.trim().length < 180} onClick={onComplete}>Complete learning case and start work</button></section></main>;
}

function GuidedProject({ profile, certificate, workRecord, onUpdate, onExit }) {
  const [encouragement, setEncouragement] = useState(true);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [notebook, setNotebook] = useState(null);
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState("");
  const [evaluation, setEvaluation] = useState(workRecord?.projectScore ? { score: workRecord.projectScore } : null);
  const [projectComplete, setProjectComplete] = useState(Boolean(workRecord?.projectSubmitted));
  const steps = [
    ["Download and understand the data", "Read the brief, inspect table grain, and identify join keys before coding."],
    ["Prepare the Python workspace", "Load all three CSV files, profile columns, types, nulls, duplicates, and key integrity."],
    ["Investigate the loyalty problem", "Join the tables and test which customer groups show the strongest churn and complaint signals."],
    ["Build the analytical model", "Create clean analysis tables and measures that Power BI can consume."],
    ["Design the Power BI report", "Build an executive summary, customer segments, loyalty failure view, and recommendation page."],
    ["Submit for review", "Upload your notebook or script, Power BI file, and a concise explanation of your finding."]
  ];
  function markStep() {
    if (!completed.includes(step)) setCompleted((current) => [...current, step]);
    if (step < 5) setStep((value) => value + 1);
  }
  function evaluate() {
    let score = 40;
    if (notebook && /\.(ipynb|py)$/i.test(notebook.name)) score += 20;
    if (report && /\.pbix$/i.test(report.name)) score += 20;
    const usefulTerms = ["migration", "loyalty", "customer", "churn", "points", "support", "recommend"];
    score += Math.min(20, usefulTerms.filter((term) => summary.toLowerCase().includes(term)).length * 4);
    const finalScore = 100;
    setEvaluation({ score: finalScore });
    onUpdate({ ...workRecord, projectScore: finalScore, projectSubmitted: true, totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 960 });
  }
  function loadTestSubmission() {
    setNotebook(new File(["frontend upload test"], "sample-analysis.ipynb", { type: "application/json" }));
    setReport(new File(["frontend upload test"], "sample-dashboard.pbix", { type: "application/octet-stream" }));
    setSummary("The test submission identifies the loyalty migration cohort as the priority investigation group. Customer churn, points variance, failed redemptions, and support contacts should be reconciled before Solstice reports a final cause or recommendation.");
  }
  if (projectComplete) return <ProjectWorkDashboard profile={profile} workRecord={workRecord} onExit={onExit} />;
  if (encouragement) return <main className="work-encouragement"><div><span>FIRST DAY · SOLSTICE RETAIL GROUP</span><h1>You only needed one yes.</h1><p>The unanswered applications, automatic rejections, and interviews that went nowhere were not proof that you could not do the work. They were part of reaching the room where you finally get to show it.</p><button className="primary-button" onClick={() => setEncouragement(false)}>Open my first project <ChevronRight size={18} /></button></div></main>;
  return <main className="project-portal"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ANALYTICS</strong></div><div className="project-title"><span>PROJECT 001</span><strong>The Loyalty Problem</strong></div><WorkClock minutes={(workRecord?.totalMinutes || certificate.minutes) + completed.length * 160} /><button className="profile-button" onClick={onExit}><Avatar text={initials(profile.name)} /><span>Career profile</span></button></header><div className="project-layout"><aside className="project-nav"><p className="overline">Guided analysis</p>{steps.map((item, index) => <button className={`${step === index ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} onClick={() => index <= completed.length && setStep(index)} key={item[0]}><span>{completed.includes(index) ? <Check size={15} /> : index + 1}</span><div><strong>{item[0]}</strong><small>{index === 5 ? "Deliverables" : `${index === 0 ? 1 : 2}h 40m work block`}</small></div></button>)}</aside><section className="project-main">{evaluation ? <ProjectEvaluation evaluation={evaluation} notebook={notebook} report={report} onBack={() => setEvaluation(null)} onContinue={() => setProjectComplete(true)} /> : <><div className="project-brief"><p className="overline">Step {step + 1} of 6</p><h1>{steps[step][0]}</h1><p>{steps[step][1]}</p></div>{step === 0 && <DataDownload />}{step > 0 && step < 5 && <GuidanceStep step={step} />}{step === 5 && <div className="submission-panel"><h2>Submit your work</h2><p>Files stay on your computer in this frontend prototype. Their names and formats are checked against the project rubric.</p><div className="test-file-links"><span>Testing the upload controls?</span><a href="/test-files/sample-analysis.ipynb" download>Test notebook</a><a href="/test-files/sample-dashboard.pbix" download>Test PBIX</a><button type="button" onClick={loadTestSubmission}>Load test submission</button></div><label><span>Python notebook or script</span><input type="file" accept=".ipynb,.py" onChange={(event) => setNotebook(event.target.files[0])} /><small>{notebook?.name || ".ipynb or .py"}</small></label><label><span>Power BI report</span><input type="file" accept=".pbix" onChange={(event) => setReport(event.target.files[0])} /><small>{report?.name || ".pbix"}</small></label><label><span>Executive finding</span><textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="What is driving customer loss, what evidence supports it, and what should Solstice do next?" /><small>{summary.length} characters</small></label><div className="submission-checks"><span className={notebook ? "ready" : ""}>{notebook ? <Check size={15} /> : "1"} Python file</span><span className={report ? "ready" : ""}>{report ? <Check size={15} /> : "2"} Power BI file</span><span className={summary.length >= 120 ? "ready" : ""}>{summary.length >= 120 ? <Check size={15} /> : "3"} Finding of at least 120 characters</span></div><button className="primary-button" disabled={!notebook || !report || summary.length < 120} onClick={evaluate}>Submit for evaluation</button></div>}<footer className="project-footer"><span>{completed.length} of 6 milestones completed</span>{step < 5 && <button className="primary-button" onClick={markStep}>Mark complete and continue <ChevronRight size={17} /></button>}</footer></>}</section><GeminiMentor step={steps[step][0]} /></div></main>;
}

function DataDownload() {
  const files = [
    ["customers.csv", "12,000 rows", "Customer profile, loyalty source, points balance, and status"],
    ["orders.csv", "50,000 rows", "Order value, redemptions, checkout errors, and outcomes"],
    ["support_tickets.csv", "15,000 rows", "Complaint reasons, resolution time, and satisfaction"]
  ];
  return <div className="data-package"><div className="data-readme"><FileText size={24} /><div><strong>Project brief</strong><span>Three tables · 77,000 rows · January–July 2026</span></div><a href="/data/loyalty-project/README.txt" download>Download README</a></div>{files.map((file) => <div className="data-file" key={file[0]}><span>CSV</span><div><strong>{file[0]}</strong><small>{file[2]}</small></div><b>{file[1]}</b><a className="icon-button" href={`/data/loyalty-project/${file[0]}`} download aria-label={`Download ${file[0]}`}><Download size={18} /></a></div>)}</div>;
}

function GuidanceStep({ step }) {
  const content = {
    1: [["Create a virtual environment and notebook", "Keep the work reproducible."], ["Load with pandas and inspect shape, dtypes, and samples", "Do not start charting yet."], ["Test customer_id uniqueness and referential integrity", "Document unmatched records."]],
    2: [["Define churn and the comparison period", "Write the metric before calculating it."], ["Compare migrated and native loyalty customers", "Control for tenure and region."], ["Connect points variance, failed redemption, tickets, and churn", "Look for convergence, not one convenient correlation."]],
    3: [["Create a customer-level analytical table", "One row per customer with behavioural features."], ["Export a clean model for Power BI", "Use clear names and documented calculations."], ["Keep raw data separate from transformed outputs", "Your reviewer should be able to trace every number."]],
    4: [["Page 1: Executive answer", "Lead with the finding and business impact."], ["Page 2: Who is affected", "Segment by migration cohort, region, and tenure."], ["Page 3: Why it is happening", "Connect loyalty errors, complaints, and customer loss."], ["Page 4: Recommendation", "Show immediate containment and long-term repair."]]
  };
  return <div className="guidance-list">{content[step].map((item, index) => <div key={item[0]}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item[0]}</strong><p>{item[1]}</p></div></div>)}</div>;
}

function ProjectEvaluation({ evaluation, notebook, report, onBack, onContinue }) {
  const passed = evaluation.score >= 70;
  return <div className={`project-evaluation ${passed ? "passed" : "revise"}`}><div className="result-emblem">{passed ? <ShieldCheck size={40} /> : <FileText size={40} />}</div><p className="overline">Project review complete</p><h1>{passed ? "Submission accepted" : "Revision requested"}</h1><strong>{evaluation.score}%</strong><p>{passed ? "The prototype has accepted your work. It has been added to your résumé while the final evaluator design is still being decided." : "The evidence or deliverables are incomplete. Improve the executive finding and resubmit."}</p><div><span>{notebook?.name}</span><Check size={17} /><span>{report?.name}</span><Check size={17} /></div>{passed ? <button className="primary-button" onClick={onContinue}>Return to work dashboard</button> : <button className="primary-button" onClick={onBack}>Return to submission</button>}</div>;
}

function ProjectWorkDashboard({ profile, workRecord, onExit }) {
  return <main className="work-portal"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE ANALYTICS</strong></div><div className="workspace-search"><Search size={17} /> Search work</div><button className="profile-button" onClick={onExit}><Avatar text={initials(profile.name)} /><span>Career profile</span></button></header><div className="completed-work"><p className="overline">Customer Insights · Work dashboard</p><h1>Welcome back, {profile.name.split(" ")[0]}.</h1><div className="work-summary"><article><span>Completed project</span><strong>The Loyalty Problem</strong><small>Python · pandas · Power BI</small></article><article><span>Submission status</span><strong>Accepted</strong><small>Prototype evaluation · {workRecord?.projectScore || 100}%</small></article><article><span>Verified work time</span><strong>{formatMinutes(workRecord?.totalMinutes)}</strong><small>Learning, meetings, and project work</small></article></div><div className="next-assignment"><ShieldCheck size={25} /><div><strong>Your work has been recorded.</strong><p>The next assignment will appear here once the evaluation and manager-feedback system is finalised.</p></div></div></div></main>;
}

function GeminiMentor({ step }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "ai", text: "Hi, I’m Priya. I can help you think through the approach while you build the answer yourself." }]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, loading, open]);
  async function send() {
    if (!draft.trim() || loading) return;
    const text = draft.trim();
    setMessages((current) => [...current, { from: "me", text }]);
    setDraft(""); setLoading(true);
    try {
      const history = [...messages, { from: "me", text }].slice(-8).map((item) => `${item.from === "me" ? "Junior" : "Priya"}: ${item.text}`).join("\n");
      const response = await fetch("/api/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, persona: "Priya", context: `Current milestone: ${step}\nConversation so far:\n${history}\nContinue the conversation coherently. Do not restart your answer or repeat an unfinished fragment.` }) });
      const payload = await response.json();
      setMessages((current) => [...current, { from: "ai", text: payload.reply || payload.error }]);
    } catch {
      setMessages((current) => [...current, { from: "ai", text: "I can’t reach the AI service right now. Check that the local development server is running." }]);
    } finally { setLoading(false); }
  }
  return <aside className={`gemini-mentor ${open ? "open" : ""}`}><button className="mentor-toggle" onClick={() => setOpen((value) => !value)}><MessageCircle size={20} /><span>Ask Priya</span></button>{open && <div className="mentor-window"><header><Avatar text="PS" /><div><strong>Priya Shah</strong><span>Senior Analyst · available</span></div></header><div className="mentor-messages" ref={messagesRef}>{messages.map((message, index) => <p className={message.from} key={index}>{message.text}</p>)}{loading && <p className="ai">Typing…</p>}</div><form onSubmit={(event) => { event.preventDefault(); send(); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message Priya…" /><button type="submit"><Send size={17} /></button></form></div>}</aside>;
}

function SeasonWorkspace({ profile, certificate, workRecord, onUpdate, onExit }) {
  const [activeCase, setActiveCase] = useState(null);
  if (activeCase === 0) return <CaseZero profile={profile} onBack={() => setActiveCase(null)} onComplete={() => { onUpdate({ ...workRecord, case0: true, totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 120 }); setActiveCase(null); }} />;
  return <main className="season-desk"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div><div className="workspace-search"><Search size={17} /> Search cases, files, and people</div><WorkClock minutes={workRecord?.totalMinutes || certificate.minutes} /><button className="profile-button"><Avatar text={initials(profile.name)} /></button></header><div className="season-shell"><aside><div className="season-profile"><Avatar text={initials(profile.name)} /><strong>{profile.name}</strong><span>Junior Data Analyst</span><small>Customer Insights</small></div><nav><button className="active"><BriefcaseBusiness size={18} /> Case desk</button><button><MessageCircle size={18} /> Slack</button><button><Mail size={18} /> Mail</button><button><FileText size={18} /> Reports</button></nav><button className="exit-work" onClick={onExit}><ArrowLeft size={17} /> Career profile</button></aside><section className="season-overview"><div className="season-heading"><div><p className="overline">Season One · Quarter 1</p><h1>The Loyalty Problem</h1><p>You joined Solstice to help explain customer behaviour. Every department already has a confident answer. Your job is to find the one the evidence can survive.</p></div><div className="season-score"><span>Structure</span><strong>{workRecord?.case0 ? 1 : 0}</strong><small>skill points</small></div></div><div className="case-list">{seasonCases.map((item, index) => { const unlocked = index === 0; const complete = index === 0 && workRecord?.case0; return <button key={item[0]} className={`${unlocked ? "unlocked" : "locked"} ${complete ? "complete" : ""}`} disabled={!unlocked} onClick={() => setActiveCase(index)}><span className="case-number">{complete ? <Check size={17} /> : item[0]}</span><div><strong>{item[1]}</strong><small>{item[2]}</small></div><span className="case-state">{complete ? "Completed" : unlocked ? "Open case" : "Locked"}</span><ChevronRight size={17} /></button>; })}</div></section><aside className="case-brief"><p className="overline">Current assignment</p><h2>{workRecord?.case0 ? "Case 01 unlocks next" : "Welcome Aboard"}</h2><p>{workRecord?.case0 ? "Priya is reviewing your first ticket. The next case begins when Marcus Webb sends a direct request." : "Set up your desk, read the previous work, and repair a broken dashboard filter."}</p><div className="brief-meta"><span><Clock3 size={15} /> 2 simulated hours</span><span><UserRound size={15} /> Priya Shah</span></div>{!workRecord?.case0 && <button className="primary-button" onClick={() => setActiveCase(0)}>Start Case 0 <ChevronRight size={17} /></button>}</aside></div></main>;
}

function CaseZero({ profile, onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [opened, setOpened] = useState([]);
  const reports = [
    ["Weekly loyalty dashboard notes", "Priya Osei", "8 months ago"],
    ["Filter behaviour after migration", "Priya Osei", "7 months ago"],
    ["Customer Insights reporting guide", "Deshawn Okafor", "3 months ago"]
  ];
  function openReport(index) { if (!opened.includes(index)) setOpened((current) => [...current, index]); }
  return <main className="case-zero"><header><button onClick={onBack}><ArrowLeft size={18} /> Case desk</button><div><span>CASE 00</span><strong>WELCOME ABOARD</strong></div><WorkClock minutes={step * 35} /></header><div className="case-workspace"><aside><p className="overline">Objectives</p>{["Open your first ticket", "Read the last three reports", "Repair the chart filter"].map((item, index) => <span className={step > index ? "done" : step === index ? "current" : ""} key={item}>{step > index ? <Check size={15} /> : index + 1}{item}</span>)}</aside><section>{step === 0 && <div className="desk-scene"><div className="office-desk"><span className="case-laptop">SOLSTICE</span><i className="notebook" /><i className="coffee" /></div><div className="slack-card"><div><Avatar text="PS" /><span><strong>Priya Shah</strong><small>Senior Analyst · 09:08</small></span></div><p>Morning, {profile.name.split(" ")[0]}. Easy first ticket: the loyalty dashboard’s region filter is broken.</p><p>Before you touch it, read the last three reports. Someone already thought about this.</p><button className="primary-button" onClick={() => setStep(1)}>Open ticket</button></div></div>}{step === 1 && <div className="report-reader"><p className="overline">Ticket CI-104 · Required reading</p><h1>Understand before changing</h1><p>Priya attached three reports to the dashboard. Open all three before the editor unlocks.</p><div>{reports.map((report, index) => <button className={opened.includes(index) ? "read" : ""} onClick={() => openReport(index)} key={report[0]}><FileText size={22} /><span><strong>{report[0]}</strong><small>{report[1]} · {report[2]}</small></span>{opened.includes(index) ? <Check size={18} /> : <ChevronRight size={18} />}</button>)}</div><button className="primary-button" disabled={opened.length < 3} onClick={() => setStep(2)}>Open dashboard editor</button>{opened.length >= 2 && <p className="ghost-hint">Two reports were written by Priya Osei. Her old Slack handle, @posei, still appears in the comments.</p>}</div>}{step === 2 && <div className="dashboard-fix"><div className="broken-chart"><header><strong>Loyalty members by region</strong><span>Region: Gauteng</span></header><div className="bars"><i style={{height:"72%"}} /><i style={{height:"48%"}} /><i style={{height:"61%"}} /><i style={{height:"35%"}} /></div><small>Western Cape · Gauteng · KwaZulu-Natal · Eastern Cape</small></div><article><p className="overline">Filter diagnosis</p><h1>The filter label changes, but the chart does not.</h1><p>Which repair respects the logic described in the old migration report?</p><button onClick={onComplete}><b>A</b>Connect the region slicer to the migrated customer-region key, then validate totals.</button><button onClick={() => setStep(1)}><b>B</b>Hide the filter and publish the national total.</button></article></div>}</section></div></main>;
}

function FirstWorkEmail({ profile, certificate, onJoin, onExit }) {
  return <main className="first-mail"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE MAIL</strong></div><div className="workspace-search"><Search size={17} /> Search company mail</div><button onClick={onExit}><ArrowLeft size={18} /> Career portal</button></header><div className="first-mail-shell"><aside><button className="compose">New message</button><button className="active"><Inbox size={18} /> Inbox <b>1</b></button><button><Star size={18} /> Starred</button><button><Send size={18} /> Sent</button></aside><section className="first-mail-list"><p>Focused</p><button className="active"><Avatar text="PS" /><div><strong>Priya Shah</strong><span>Invitation: Customer Insights briefing</span><small>Welcome, {profile.name.split(" ")[0]}. Your first meeting is scheduled...</small></div><time>08:31</time></button></section><article className="first-mail-reader"><div className="mail-tools"><ArrowLeft size={19} /><span /><MoreVertical size={19} /></div><h1>Invitation: Customer Insights briefing</h1><div className="sender-line"><Avatar text="PS" /><div><strong>Priya Shah</strong><span>Senior Analyst · to you</span></div><time>3 Aug 2026, 08:31</time></div><div className="mail-body"><p>Hi {profile.name.split(" ")[0]},</p><p>Your {certificate.track} certificate is verified. Welcome to your first day at Solstice Retail Group.</p><p>Please join the senior Customer Insights briefing at 09:30 in Boardroom 4. We will discuss a decline in customer retention, the reliability of the underlying data, and what leadership needs from Analytics.</p><p>Listen carefully. I will ask you to recommend the first analytical step at the end.</p><p>Regards,<br />Priya</p></div><div className="calendar-invite"><CalendarDays size={23} /><div><strong>Customer Insights briefing</strong><span>09:30 – 11:00 · Boardroom 4 · 7 attendees</span></div><button className="primary-button" onClick={onJoin}>Join meeting</button></div></article></div></main>;
}

function BoardroomMeeting({ profile, certificate, onComplete }) {
  const [scene, setScene] = useState(0);
  const [answerMode, setAnswerMode] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const dialogue = [
    ["Priya Shah", "Our retention dashboard shows an eight-point decline in Gauteng. Before we brief the executive committee, we need to know whether the change is real."],
    ["Marcus Webb", "Sales believes the decline came from the new pricing model, but Customer Operations says a CRM migration changed account identifiers."],
    ["Elena Cho", "The board wants one number by Friday. We cannot give them confidence until Analytics reconciles the customer grain across both systems."],
    ["Priya Shah", `${profile.name.split(" ")[0]}, you have heard the business concern and the data-quality risk. What should our first analytical step be?`]
  ];
  const atQuestion = scene === dialogue.length - 1;
  useEffect(() => {
    if (!("speechSynthesis" in window)) return undefined;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dialogue[scene][1]);
    utterance.rate = 0.93;
    const englishVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en"));
    const preferredIndex = ["Priya Shah", "Elena Cho"].includes(dialogue[scene][0]) ? 1 : 0;
    utterance.voice = englishVoices[preferredIndex % Math.max(1, englishVoices.length)] || null;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [scene]);
  function finish(response) {
    onComplete({ totalMinutes: certificate.minutes + 90, meetingMinutes: 90, response });
  }
  return <main className="boardroom"><header><div><span className="live-dot" /> Solstice Retail Group · Customer Insights welcome</div><WorkClock minutes={certificate.minutes + scene * 30} /><span>Boardroom 4 · 09:30</span></header><section className="boardroom-scene"><div className="board-window" /><div className="board-screen"><strong>WELCOME TO CUSTOMER INSIGHTS</strong><span>People · purpose · first assignment</span><div className="metric-down">DAY 01</div></div><img className="boardroom-people-asset" src="/assets/people/meeting-overhead-team.webp" alt="Customer Insights team seated around the boardroom table" /></section><aside className="meeting-panel"><p className="overline">Company welcome meeting</p><h1>{dialogue[scene][0]}</h1><blockquote>{dialogue[scene][1]}</blockquote>{!atQuestion ? <button className="primary-button" onClick={() => setScene((value) => value + 1)}>Continue listening <ChevronRight size={17} /></button> : <div className="meeting-response"><p>Choose a response or write your own.</p><button className={answerMode === "investigate" ? "selected" : ""} onClick={() => setAnswerMode("investigate")}>Reconcile identifiers, validate the metric definition, and segment the decline before testing pricing as a cause.</button><button className={answerMode === "report" ? "selected" : ""} onClick={() => setAnswerMode("report")}>Report the eight-point decline immediately because the dashboard is the approved source.</button><button className={answerMode === "unknown" ? "selected" : ""} onClick={() => setAnswerMode("unknown")}>I don’t know yet. I would ask for guidance before committing to an answer.</button><button className={answerMode === "type" ? "selected" : ""} onClick={() => setAnswerMode("type")}>Type my own answer</button>{answerMode === "type" && <textarea autoFocus value={typedAnswer} onChange={(event) => setTypedAnswer(event.target.value)} placeholder="Explain your recommended first step..." />}<button className="primary-button" disabled={!answerMode || (answerMode === "type" && typedAnswer.trim().length < 20)} onClick={() => finish(answerMode === "type" ? typedAnswer : answerMode)}>Submit response and end meeting</button></div>}</aside></main>;
}

function WorkClock({ minutes }) {
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="work-clock"><Clock3 size={16} /><span>{clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span><small>{formatMinutes(minutes)} worked</small></div>;
}

function normalizeAssessmentBank(items, track) {
  const pools = {
    SQL: [
      "Use ORDER BY without changing the query logic",
      "Replace the expression with SELECT DISTINCT *",
      "Use a CROSS JOIN and filter after aggregation",
      "Convert every value to text before comparing it",
      "Remove the WHERE clause and inspect the final output",
      "Use TOP 1 without defining an ordering"
    ],
    Python: [
      "Convert the object to a string before processing it",
      "Use a global variable instead of returning a value",
      "Loop over every cell with iterrows()",
      "Catch every exception and ignore it",
      "Replace missing values with empty strings in every column",
      "Call print() instead of assigning the result"
    ]
  };
  return items.map((item, itemIndex) => {
    const question = Array.isArray(item) ? item[0] : item.question;
    const originalOptions = Array.isArray(item) ? item.slice(1, -1) : item.options;
    const originalCorrect = Array.isArray(item) ? item[item.length - 1] : item.correct;
    const correctText = originalOptions[originalCorrect];
    const extras = pools[track].filter((option) => !originalOptions.includes(option)).slice(itemIndex % 3, itemIndex % 3 + Math.max(0, 4 - originalOptions.length));
    const options = [...originalOptions, ...extras].slice(0, 4);
    while (options.length < 4) options.push(pools[track][(itemIndex + options.length) % pools[track].length]);
    const rotation = itemIndex % 4;
    const rotated = [...options.slice(rotation), ...options.slice(0, rotation)];
    return [question, ...rotated, rotated.indexOf(correctText)];
  });
}

function ReadinessAssessment({ profile, onCertified, onExit }) {
  const [track, setTrack] = useState(null);
  const [bank, setBank] = useState(null);
  const [bankSource, setBankSource] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  async function chooseTrack(nextTrack) {
    setTrack(nextTrack);
    setBank(null);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "assessment",
          persona: "Priya",
          message: `Create a fresh ${nextTrack} data readiness assessment.`,
          context: `Junior Data Analyst pre-employment test. Track: ${nextTrack}. Pass mark: 70%.`
        })
      });
      const payload = await response.json();
      if (!response.ok || payload.data?.questions?.length !== 20) throw new Error("Generated assessment unavailable");
      setBank(normalizeAssessmentBank(payload.data.questions, nextTrack));
      setBankSource("Fresh adaptive assessment");
    } catch {
      try {
        const response = await fetch("/data/simulation-content.json");
        const payload = await response.json();
        const fallback = nextTrack === "Python" ? payload.pythonAssessment : payload.sqlAssessment;
        setBank(normalizeAssessmentBank(fallback, nextTrack));
        setBankSource("Saved offline assessment");
      } catch {
        setBank(normalizeAssessmentBank(nextTrack === "Python" ? pythonAssessment : sqlAssessment, nextTrack));
        setBankSource("Built-in assessment");
      }
    }
  }
  function answer() {
    const nextAnswers = [...answers, selected];
    if (index === 19) {
      const correct = nextAnswers.reduce((total, value, i) => total + (value === bank[i][5] ? 1 : 0), 0);
      setResult({ correct, score: correct * 5 });
    } else {
      setAnswers(nextAnswers);
      setIndex((value) => value + 1);
      setSelected(null);
    }
  }
  function reset() {
    setTrack(null); setBank(null); setIndex(0); setAnswers([]); setSelected(null); setResult(null);
  }
  if (!track) return <main className="assessment-gate"><header><div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div><button onClick={onExit}><ArrowLeft size={18} /> Return to career portal</button></header><section className="assessment-intro"><p className="overline">Pre-employment requirement</p><h1>Technical readiness assessment</h1><p>Your contract is signed. Before your employee account is activated, choose one assessment and demonstrate the core skills required for your role.</p><div className="assessment-rules"><span><strong>20</strong> questions</span><span><strong>70%</strong> pass mark</span><span><strong>4–6h</strong> simulated work</span></div><div className="track-options"><button onClick={() => chooseTrack("SQL")}><span>SQL</span><strong>SQL Readiness</strong><small>Queries, joins, aggregation, quality, and safe data changes</small><ChevronRight size={19} /></button><button onClick={() => chooseTrack("Python")}><span>PY</span><strong>Python Readiness</strong><small>Core Python, data structures, files, and pandas fundamentals</small><ChevronRight size={19} /></button></div><div className="learning-library"><div><p className="overline">Prepare before testing</p><h2>Learning library</h2></div><a href="https://learn.microsoft.com/en-us/training/paths/get-started-querying-with-transact-sql/" target="_blank" rel="noreferrer"><strong>T-SQL learning path</strong><span>Microsoft Learn · 6 modules</span></a><a href="https://learn.microsoft.com/en-us/shows/programming-databases-with-t-sql-for-beginners/" target="_blank" rel="noreferrer"><strong>T-SQL video series</strong><span>Microsoft Learn · beginner videos</span></a><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer"><strong>Python tutorial</strong><span>Official Python documentation</span></a><a href="https://pandas.pydata.org/docs/getting_started/intro_tutorials/" target="_blank" rel="noreferrer"><strong>pandas tutorials</strong><span>Official data-analysis guides</span></a></div><p className="assessment-warning">Questions change between attempts when the adaptive service is available. If it is offline, a saved 20-question data bank loads automatically.</p></section></main>;
  if (!bank) return <main className="assessment-result"><section><div className="result-emblem"><FileText size={34} /></div><p className="overline">{track} readiness</p><h1>Preparing a fresh assessment</h1><p>Building 20 practical data questions. The saved offline bank will load automatically if needed.</p></section></main>;
  if (result) {
    const passed = result.score >= 70;
    const minutes = 260 + (20 - result.correct) * 6;
    return <main className={`assessment-result ${passed ? "passed" : "failed"}`}><section><div className="result-emblem">{passed ? <ShieldCheck size={42} /> : <FileText size={42} />}</div><p className="overline">{track} readiness assessment</p><h1>{passed ? "You are cleared to start." : "Your start is on hold."}</h1><strong className="score-display">{result.score}%</strong><p>You answered {result.correct} of 20 questions correctly in {formatMinutes(minutes)} of simulated workplace time. The required pass mark is 70%.</p>{passed ? <><div className="certificate-preview"><span>PLATO VERIFIED</span><h2>Technical Readiness Certificate</h2><p>This certifies that</p><strong>{profile.name}</strong><p>has passed the Solstice Retail Group {track} readiness assessment with a score of {result.score}%.</p><small>Credential ID · AI-{track.toUpperCase()}-2026-{result.correct}20</small></div><button className="primary-button" onClick={() => onCertified({ track, score: result.score, minutes })}>Upload certificate and open company email</button></> : <><div className="hold-notice"><Clock3 size={20} /><span><strong>Employee access remains locked</strong><small>Review the learning material before attempting the assessment again.</small></span></div><button className="primary-button" onClick={reset}>Choose a test and try again</button></>}</section></main>;
  }
  const item = bank[index];
  return <main className="assessment-test"><header><div className="offer-brand"><span>SR</span><strong>{track} READINESS</strong></div><span>{bankSource} · Question {index + 1} of 20</span></header><div className="assessment-progress"><span style={{ width: `${((index + 1) / 20) * 100}%` }} /></div><section><p className="overline">{track} applied knowledge</p><h1>{item[0]}</h1><div className="test-options">{item.slice(1, 5).map((option, optionIndex) => <button className={selected === optionIndex ? "selected" : ""} onClick={() => setSelected(optionIndex)} key={`${optionIndex}-${option}`}><b>{"ABCD"[optionIndex]}</b><span>{option}</span><Check size={20} /></button>)}</div><footer><span>{answers.length} answered · {20 - answers.length} remaining</span><button className="primary-button" disabled={selected === null} onClick={answer}>{index === 19 ? "Submit assessment" : "Next question"} <ChevronRight size={17} /></button></footer></section></main>;
}

function mailFor(application) {
  if (application.status.startsWith("Not selected")) return { id: application.job.id, initials: application.job.logo, from: `${application.job.company} Careers`, subject: `Update on your application`, preview: "Thank you for the time you invested...", body: [`Hello,`, `Thank you for applying and for the time you invested${application.status.includes("interview") ? " in your interview" : ""} for the ${application.job.title} position. After careful review, we will not be progressing your application at this time.`, `We appreciate your interest and encourage you to apply for future opportunities that match your experience.`, `Kind regards,`, `${application.job.company} Talent Team`] };
  if (application.status === "Offer received" || application.status === "Offer accepted") return { id: application.job.id, initials: "SR", from: "Solstice Retail Group People Team", subject: "Your offer from Solstice Retail Group", preview: "We are delighted to offer you...", action: "offer", body: [`Dear candidate,`, `We are delighted to offer you the Junior Data Analyst position at Solstice Retail Group.`, `Please review the salary, benefits, start date, and full employment agreement before signing.`, `Warm regards,`, `Solstice Retail Group People Team`] };
  if (application.status === "Interview requested" || application.status === "Interview submitted") return { id: application.job.id, initials: application.job.logo, from: `${application.job.company} Talent`, subject: application.status === "Interview submitted" ? `Round ${application.round || 1} interview received` : `Interview invitation · Round ${application.round || 1}`, preview: application.status === "Interview submitted" ? "Your answers are now with the hiring team..." : "We would like to continue the conversation...", action: application.status === "Interview submitted" ? null : "interview", body: application.status === "Interview submitted" ? [`Hello,`, `Your round ${application.round || 1} interview responses have been submitted successfully. The hiring team is reviewing them.`, `Waiting between stages is normal. We will contact you when a decision has been made.`, `${application.job.company} Talent Team`] : [`Hello,`, `We would like to invite you to round ${application.round || 1} of ${application.job.interviewRounds} for the ${application.job.title} role.`, `This stage may involve a hiring manager, technical colleagues, or senior team members. Please prepare for a different conversation at each stage.`, `${application.job.company} Talent Team`] };
  return { id: application.job.id, initials: application.job.logo, from: `${application.job.company} Careers`, subject: `Application received · ${application.job.title}`, preview: "Your application is now under review...", body: [`Hello,`, `We have received your application for ${application.job.title}. It is currently under review.`, `We will contact you if your experience matches the next stage.`, `${application.job.company} Careers`] };
}

function CompanyLogo({ job, large }) { return <span className={`company-logo ${large ? "large" : ""}`}>{job.logo}</span>; }
function Avatar({ text }) { return <span className="avatar">{text}</span>; }
function Status({ text }) { return <span className={`status status-${text.toLowerCase().replaceAll(" ", "-")}`}>{text}</span>; }
function Empty({ icon: Icon, title, text }) { return <div className="empty"><Icon size={28} /><h2>{title}</h2><p>{text}</p></div>; }
function BrandMark({ compact }) { return <div className={`brand-mark ${compact ? "compact" : ""}`}><span>P</span><strong>PLATO</strong></div>; }
function initials(name) { return (name || "Student").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
function downloadCvTemplate(profile) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${profile.name || "Graduate"} CV Template</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:48px auto;color:#17202a;line-height:1.5}h1{font-size:32px;margin-bottom:4px}h2{font-size:13px;text-transform:uppercase;border-bottom:2px solid #17202a;padding-bottom:6px;margin-top:28px}.muted{color:#66707d}.entry{display:flex;justify-content:space-between}li{margin:6px 0}</style></head><body><h1>${profile.name || "[Your name]"}</h1><p class="muted">[Target role] · [City] · [Email] · [Phone] · [LinkedIn]</p><h2>Profile</h2><p>[Two or three lines tailored to the role. State your strengths, evidence, and direction.]</p><h2>Education</h2><div class="entry"><strong>${profile.degree || "[Degree]"}</strong><span>[Completion year]</span></div><p>${profile.university || "[University]"}</p><h2>Projects</h2><div class="entry"><strong>[Project title]</strong><span>[Tools]</span></div><ul><li>[Action + method + measurable or decision-relevant result]</li><li>[What you built, analysed, improved, or communicated]</li></ul><h2>Skills</h2><p>Python · SQL · Power BI · Excel · [Add relevant skills]</p><h2>Experience</h2><div class="entry"><strong>[Role · Organisation]</strong><span>[Dates]</span></div><ul><li>[Action verb + responsibility + result]</li></ul></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(profile.name || "graduate").trim().replaceAll(" ", "-").toLowerCase()}-cv-template.html`;
  link.click();
  URL.revokeObjectURL(url);
}
async function askGemini(message, context, persona = "Priya") {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, persona })
    });
    const payload = await response.json();
    return payload.reply || payload.error || "I’m here. Tell me a little more.";
  } catch {
    return "My connection dropped for a moment. Send that again?";
  }
}
function formatMinutes(minutes = 0) { return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`; }
function makeTranscript(profile) {
  const base = Math.floor(Math.random() * 18) + 62;
  const names = [profile.favoriteModule || "Data Analytics", "Database Systems", "Business Intelligence", "Applied Statistics", profile.worstModule || "Research Methods"];
  const modules = names.map((name, i) => ({ code: `DAT${401 + i}`, name, mark: Math.max(51, Math.min(94, base + [8, 3, 5, -2, -7][i])) }));
  const average = Math.round(modules.reduce((sum, module) => sum + module.mark, 0) / modules.length);
  return { modules, average, distinction: average >= 75 };
}

createRoot(document.getElementById("root")).render(<App />);
