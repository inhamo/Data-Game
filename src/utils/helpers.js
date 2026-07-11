export function appPath(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
}

export function initials(name) {
  return (name || "Student").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function renderTemplate(template = "", values = {}) {
  return String(template).replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");
}

export function profileTemplateValues(profile = {}, extra = {}) {
  return {
    firstName: profile.name?.split(" ")[0] || "you",
    favoriteModule: profile.favoriteModule || "Data storytelling",
    ...profile,
    ...extra,
  };
}

export function formatMinutes(minutes = 0) {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export function relativeTime(timestamp, now = Date.now()) {
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

export function downloadCvTemplate(profile) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${profile.name || "Graduate"} CV Template</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:48px auto;color:#17202a;line-height:1.5}h1{font-size:32px;margin-bottom:4px}h2{font-size:13px;text-transform:uppercase;border-bottom:2px solid #17202a;padding-bottom:6px;margin-top:28px}.muted{color:#66707d}.entry{display:flex;justify-content:space-between}li{margin:6px 0}</style></head><body><h1>${profile.name || "[Your name]"}</h1><p class="muted">[Target role] · [City] · [Email] · [Phone] · [LinkedIn]</p><h2>Profile</h2><p>[Two or three lines tailored to the role. State your strengths, evidence, and direction.]</p><h2>Education</h2><div class="entry"><strong>${profile.degree || "[Degree]"}</strong><span>[Completion year]</span></div><p>${profile.university || "[University]"}</p><h2>Projects</h2><div class="entry"><strong>[Project title]</strong><span>[Tools]</span></div><ul><li>[Action + method + measurable or decision-relevant result]</li><li>[What you built, analysed, improved, or communicated]</li></ul><h2>Skills</h2><p>Python · SQL · Power BI · Excel · [Add relevant skills]</p><h2>Experience</h2><div class="entry"><strong>[Role · Organisation]</strong><span>[Dates]</span></div><ul><li>[Action verb + responsibility + result]</li></ul></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(profile.name || "graduate").trim().replaceAll(" ", "-").toLowerCase()}-cv-template.html`;
  link.click();
  URL.revokeObjectURL(url);
}
