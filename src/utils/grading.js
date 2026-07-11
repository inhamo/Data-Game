import { npcSystem } from '../data';

export function gradeMeceTree(branches) {
  const clean = branches.map((branch) => branch.trim().toLowerCase()).filter(Boolean);
  const stopWords = new Set(["and", "the", "of", "or", "customer", "customers", "issues", "problem"]);
  const tokens = clean.map((branch) => new Set(branch.split(/\W+/).filter((word) => word.length > 3 && !stopWords.has(word))));
  let overlapPairs = 0;
  for (let left = 0; left < tokens.length; left += 1) {
    for (let right = left + 1; right < tokens.length; right += 1) {
      if ([...tokens[left]].some((token) => tokens[right].has(token))) overlapPairs += 1;
    }
  }
  const mutuallyExclusive = new Set(clean).size !== clean.length ? 0 : overlapPairs ? 1 : 2;
  const driverGroups = [
    ["price", "pricing", "value", "cost"],
    ["loyalty", "point", "reward", "redemption"],
    ["service", "support", "delivery", "experience"],
    ["segment", "channel", "mix", "tenure", "region"]
  ];
  const coveredDrivers = driverGroups.filter((terms) => terms.some((term) => clean.some((branch) => branch.includes(term)))).length;
  const collectivelyExhaustive = coveredDrivers >= 4 ? 2 : coveredDrivers === 3 ? 1 : 0;
  const vague = clean.some((branch) => /other|misc|general|various/.test(branch));
  const actionableDepth = clean.length === 4 && clean.every((branch) => branch.length >= 8) && !vague ? 1 : 0;
  const total = mutuallyExclusive + collectivelyExhaustive + actionableDepth;
  return {
    total,
    maximum: npcSystem.rubrics.mece.maximum,
    pass: total >= npcSystem.rubrics.mece.pass,
    criteria: { mutuallyExclusive, collectivelyExhaustive, actionableDepth },
    weakest: mutuallyExclusive < 2 ? "overlap" : collectivelyExhaustive < 2 ? "missing driver" : actionableDepth < 1 ? "vague branch" : null
  };
}

export function gradeScqaResponse(text) {
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
  const first = (sentences[0] || "").toLowerCase();
  const situation = /currently|today|baseline|observed|among|during|data shows/.test(lower) ? 1 : 0;
  const complication = /but|however|declin|changed|failure|risk|since|problem/.test(lower) ? 1 : 0;
  const question = /\?|need to (determine|understand|decide)|whether/.test(lower) ? 1 : 0;
  const answerTerms = /recommend|conclusion|first|should|priority|hypothesis|therefore/;
  const answerFirst = answerTerms.test(first) ? 2 : answerTerms.test(lower) ? 1 : 0;
  const support = /evidence|source|data|compare|validate|metric|identifier|segment|test/.test(lower) ? 1 : 0;
  const total = situation + complication + question + answerFirst + support;
  return {
    total,
    maximum: npcSystem.rubrics.scqa.maximum,
    pass: total >= npcSystem.rubrics.scqa.pass,
    criteria: { situation, complication, question, answerFirst, support },
    weakest: support === 0 ? "unsupported claim" : answerFirst < 2 ? "buried answer" : question === 0 ? "unclear decision question" : complication === 0 ? "missing tension" : situation === 0 ? "biased or missing situation" : null
  };
}