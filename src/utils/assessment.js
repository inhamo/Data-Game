import assessmentDistractors from '../data/assessmentDistractors.json';

export function normalizeAssessmentBank(items, track) {
  const distractors = assessmentDistractors[track] || assessmentDistractors.SQL;

  return items.map((item, itemIndex) => {
    const question = Array.isArray(item) ? item[0] : item.question;
    const originalOptions = Array.isArray(item) ? item.slice(1, -1) : item.options;
    const originalCorrect = Array.isArray(item) ? item[item.length - 1] : item.correct;
    const correctText = originalOptions[originalCorrect];
    const extras = distractors
      .filter((option) => !originalOptions.includes(option))
      .slice(itemIndex % 3, itemIndex % 3 + Math.max(0, 4 - originalOptions.length));
    const options = [...originalOptions, ...extras].slice(0, 4);

    while (options.length < 4) options.push(distractors[(itemIndex + options.length) % distractors.length]);

    const rotation = itemIndex % 4;
    const rotated = [...options.slice(rotation), ...options.slice(0, rotation)];
    return [question, ...rotated, rotated.indexOf(correctText)];
  });
}
