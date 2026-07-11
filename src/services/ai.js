// src/services/ai.js

// You'll need to set these environment variables
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_URL || '/api/gemini';
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

/**
 * Try calling Gemini (or your local /api/gemini) first.
 * If it fails, fallback to DeepSeek-v3.
 * If both fail, return a sensible fallback.
 */
export async function askAI({ message, context, persona = "Priya" }) {
  // Try Gemini first (via your local proxy)
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context, persona })
    });
    const payload = await response.json();
    if (response.ok && payload.reply) {
      return payload.reply;
    }
    // If Gemini returned an error, fall through
  } catch (e) {
    // Gemini failed, try DeepSeek
  }

  // Fallback: DeepSeek-v3
  if (DEEPSEEK_API_KEY && DEEPSEEK_API_URL) {
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: `You are ${persona}, a senior analyst at Solstice Retail. ${context || ""}` },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });
      const payload = await response.json();
      if (response.ok && payload.choices?.[0]?.message?.content) {
        return payload.choices[0].message.content;
      }
    } catch (e) {
      // DeepSeek also failed, use hardcoded fallback
    }
  }

  // Ultimate fallback: return a generic reply
  return getFallbackReply(message, persona);
}

function getFallbackReply(message, persona) {
  const replies = {
    Priya: "That's an interesting point. How would you translate that into a testable hypothesis?",
    Elena: "We should validate that with the most reliable data source we have.",
    Marcus: "Sure, but what does that imply for the pricing strategy?",
    Tom: "Let's look at the grain and table structure before we commit to that."
  };
  return replies[persona] || "That's worth exploring. Let's think about the evidence we need.";
}