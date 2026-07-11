export async function askGemini(message, context, persona = "Priya") {
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