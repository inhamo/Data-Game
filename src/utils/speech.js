import { characterBible } from '../data';

const voiceCache = new Map();
let currentAudio = null;
const fishAudioCache = new Map();

function getAvailableVoices() {
  if (!("speechSynthesis" in window)) return Promise.resolve([]);
  const currentVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en"));
  if (currentVoices.length) return Promise.resolve(currentVoices);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en")));
    }, 700);

    window.speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timeout);
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en")));
    };
  });
}

export function selectCharacterVoice(character) {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.startsWith("en"));
  if (!character || voices.length === 0) return voices[0] || null;
  const cacheKey = character.name || character.role;
  const cachedUri = voiceCache.get(cacheKey);
  const cached = voices.find((voice) => voice.voiceURI === cachedUri);
  if (cached) return cached;
  const hinted = (character.voiceHints || []).map((hint) => voices.find((voice) => voice.name.toLowerCase().includes(hint.toLowerCase()))).find(Boolean);
  const selected = hinted || voices[character.voiceIndex % voices.length] || voices[0] || null;
  if (selected) voiceCache.set(cacheKey, selected.voiceURI);
  return selected;
}

function conversationalSpeechText(text) {
  return String(text).replace(/\s{2,}/g, " ").trim();
}

function speechDelayFor(text) {
  const commaBreaths = (String(text).match(/[,;:]/g) || []).length;
  const sentenceBreaths = (String(text).match(/[.!?]/g) || []).length;
  return Math.min(950, 160 + commaBreaths * 55 + sentenceBreaths * 115);
}

function stopFishAudio() {
  if (!currentAudio) return;
  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}

function characterSpeechSpeed(character, rateMultiplier = 1) {
  const rate = (character?.voiceRate || 0.94) * rateMultiplier;
  return Math.max(0.8, Math.min(1.18, rate));
}

function emotionVoiceAdjustments(emotion = "neutral") {
  const settings = {
    rushed: { speed: 1.06, volume: 0.02 },
    frustrated: { speed: 1.04, volume: 0.03 },
    tired: { speed: 0.96, volume: -0.03 },
    laughing: { speed: 1.08, volume: 0.02 },
    amused: { speed: 1.04, volume: 0.01 },
    dry: { speed: 0.98, volume: -0.01 },
    soft: { speed: 0.94, volume: -0.06 },
    story: { speed: 0.96, volume: -0.02 },
    teaching: { speed: 0.97, volume: 0 },
    testing: { speed: 0.95, volume: -0.02 },
  };
  return settings[emotion] || { speed: 1, volume: 0 };
}

async function speakWithFishAudio(characterKey, text, options = {}) {
  const character = characterBible[characterKey];
  const spokenText = options.conversational ? conversationalSpeechText(text) : text;
  const emotion = emotionVoiceAdjustments(options.emotion);
  const speed = characterSpeechSpeed(character, options.rateMultiplier || 1) * emotion.speed;
  const cacheKey = JSON.stringify({
    characterKey,
    text: spokenText,
    speed,
  });
  let audioUrl = fishAudioCache.get(cacheKey);

  if (!audioUrl) {
    const response = await fetch("/api/fish-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterKey,
        text: spokenText,
        speed,
        volume: emotion.volume,
      }),
    });
    if (!response.ok) throw new Error("Fish Audio unavailable");
    const blob = await response.blob();
    audioUrl = URL.createObjectURL(blob);
    fishAudioCache.set(cacheKey, audioUrl);
  }

  if (options.cancel !== false) {
    window.speechSynthesis?.cancel();
    stopFishAudio();
  }

  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    audio.volume = Math.max(0.2, Math.min(1, (options.volume ?? 0.86) + emotion.volume));
    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.play().catch(resolve);
  });
}

export function speakAsCharacter(characterKey, text, options = {}) {
  return new Promise(async (resolve) => {
    if (options.useFish !== false) {
      try {
        await speakWithFishAudio(characterKey, text, options);
        resolve();
        return;
      } catch {
        // Fall back to browser speech so the scene never blocks on voice setup.
      }
    }

    if (!("speechSynthesis" in window)) {
      resolve();
      return;
    }
    const character = characterBible[characterKey];
    await getAvailableVoices();
    if (options.cancel !== false) {
      stopFishAudio();
      window.speechSynthesis.cancel();
    }
    const spokenText = options.conversational ? conversationalSpeechText(text) : text;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.voice = selectCharacterVoice(character);
    const emotion = emotionVoiceAdjustments(options.emotion);
    utterance.rate = characterSpeechSpeed(character, options.rateMultiplier || 1) * emotion.speed;
    utterance.pitch = character?.voicePitch || 1;
    utterance.volume = Math.max(0.2, Math.min(1, (options.volume ?? 0.86) + emotion.volume));
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function cancelSpeech() {
  stopFishAudio();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export { speechDelayFor };
