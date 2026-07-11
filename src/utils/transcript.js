export function makeTranscript(profile) {
  const base = Math.floor(Math.random() * 18) + 62;
  const names = [profile.favoriteModule || "Data Analytics", "Database Systems", "Business Intelligence", "Applied Statistics", profile.worstModule || "Research Methods"];
  const modules = names.map((name, i) => ({ code: `DAT${401 + i}`, name, mark: Math.max(51, Math.min(94, base + [8, 3, 5, -2, -7][i])) }));
  const average = Math.round(modules.reduce((sum, module) => sum + module.mark, 0) / modules.length);
  return { modules, average, distinction: average >= 75 };
}