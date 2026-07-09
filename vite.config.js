import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";

const npcPrompts = JSON.parse(fs.readFileSync(new URL("./src/data/npc-system-prompts.json", import.meta.url), "utf8"));

function geminiBridge() {
  return {
    name: "gemini-local-mentor",
    configureServer(server) {
      server.middlewares.use("/api/gemini", async (request, response) => {
        if (request.method !== "POST") {
          response.statusCode = 405;
          return response.end("Method not allowed");
        }
        let raw = "";
        request.on("data", (chunk) => { raw += chunk; });
        request.on("end", async () => {
          response.setHeader("Content-Type", "application/json");
          try {
            const { message, context = "", persona = "Priya", mode = "chat" } = JSON.parse(raw || "{}");
            const meetingRoles = Object.fromEntries(Object.entries(npcPrompts.characters).map(([key, character]) => [
              key[0].toUpperCase() + key.slice(1),
              `${npcPrompts.humanTexture}\n${character.system}\nRequired probe: ${character.requiredProbe}`
            ]));
            const roles = {
              ...meetingRoles,
              Recruiter: "a professional Talent Acquisition partner conducting a first-round screening interview. You are warm, observant, concise, and realistic. Assess motivation, communication, eligibility, availability, work preferences, salary expectations, and evidence from the candidate's background. Do not conduct the technical interview and never impersonate the hiring manager or Priya.",
              Family: "a supportive close family member messaging a final-year student on WhatsApp. Sound natural, warm, brief, and conversational. Never mention being an AI. This is a free conversation, but your quiet goal is to learn what the student wants to do after university and whether they have a company in mind. Respond to what they actually say. If their after-university plan is still unknown, gently ask what they are thinking of doing after university. Once that is known but the company is unknown, ask whether there is a company they hope to work for. Never treat a greeting or unrelated message as a career answer.",
              Thando: "Thando Mokoena, the student's close university friend messaging on WhatsApp. Sound casual, friendly, brief, and natural. Never mention being an AI."
            };
            const prompt = `You are ${roles[persona] || roles.Priya}
Project context: ${context}
Message: ${String(message || "").slice(0, 3000)}`;
            const provider = (process.env.AI_PROVIDER || (process.env.DEEPSEEK_API_KEY ? "deepseek" : "gemini")).toLowerCase();
            const apiKey = provider === "deepseek" ? process.env.DEEPSEEK_API_KEY : process.env.GEMINI_API_KEY;
            if (!apiKey) throw new Error(`Auth method: ${provider === "deepseek" ? "DEEPSEEK_API_KEY" : "GEMINI_API_KEY"} is missing`);
            const familyMode = persona === "Family";
            const interviewMode = mode === "interview";
            const assessmentMode = mode === "assessment";
            const structuredMode = familyMode || interviewMode || assessmentMode;
            const finalPrompt = familyMode ? `${prompt}
Return only JSON with this shape:
{"reply":"your WhatsApp reply","afterUni":"","expectedCompany":""}
Only populate afterUni or expectedCompany when the student's latest message clearly supplies that information. Otherwise use an empty string.`
              : interviewMode ? `${prompt}
Create 8 realistic questions for this exact interview format, company, and role. For a Talent Acquisition conversation, focus on motivation, communication, eligibility, availability, working preferences, salary expectations, and behavioural evidence; do not ask SQL, Python, Power BI, or technical assessment questions. Each question has two plausible responses and a correct response index. Return JSON only.`
              : assessmentMode ? `${prompt}
Create 20 challenging, practical questions for the selected track. If the track is Python, keep the test purely about Python and pandas: syntax, data structures, functions, exceptions, environments, DataFrame selection, merge, groupby, nulls, duplicates, dtypes, dates, vectorisation, validation, and exporting. Do not turn the Python test into generic business-analysis questions. If the track is SQL, focus on real querying, joins, grain, aggregation, windows, null behaviour, validation, transactions, and debugging. Test working knowledge rather than vocabulary trivia. Each question must have four plausible options and a correct response index from 0 to 3. Return JSON only.`
              : prompt;
            const questionSchema = {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" }, minItems: assessmentMode ? 4 : 2, maxItems: assessmentMode ? 4 : 2 },
                      correct: { type: "integer", minimum: 0, maximum: assessmentMode ? 3 : 1 }
                    },
                    required: ["category", "question", "options", "correct"]
                  }
                }
              },
              required: ["questions"]
            };
            let reply = "";
            if (provider === "deepseek") {
              const deepseekResponse = await fetch("https://api.deepseek.com/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                  model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
                  messages: [
                    { role: "system", content: "Stay in the assigned character and follow the requested output format exactly." },
                    { role: "user", content: finalPrompt }
                  ],
                  thinking: { type: assessmentMode || interviewMode ? "enabled" : "disabled" },
                  reasoning_effort: assessmentMode || interviewMode ? "high" : undefined,
                  temperature: 0.7,
                  max_tokens: assessmentMode ? 10000 : interviewMode ? 4000 : 500,
                  ...(structuredMode ? { response_format: { type: "json_object" } } : {})
                })
              });
              const payload = await deepseekResponse.json();
              if (!deepseekResponse.ok) throw new Error(payload?.error?.message || "DeepSeek request failed");
              reply = payload.choices?.[0]?.message?.content?.trim() || "";
            } else {
              const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
                  generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: assessmentMode ? 10000 : interviewMode ? 4000 : 300,
                    ...(structuredMode ? {
                      responseMimeType: "application/json",
                      responseSchema: familyMode ? {
                        type: "object",
                        properties: {
                          reply: { type: "string" },
                          afterUni: { type: "string" },
                          expectedCompany: { type: "string" }
                        },
                        required: ["reply", "afterUni", "expectedCompany"]
                      } : questionSchema
                    } : {})
                  }
                })
              });
              const payload = await geminiResponse.json();
              if (!geminiResponse.ok) throw new Error(payload?.error?.message || "Gemini request failed");
              reply = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
            }
            const parseStructuredReply = (text) => {
              const start = text.indexOf("{");
              const end = text.lastIndexOf("}");
              return JSON.parse(start >= 0 && end > start ? text.slice(start, end + 1) : text || "{}");
            };
            if (familyMode) {
              const structured = parseStructuredReply(reply);
              response.end(JSON.stringify({
                reply: structured.reply || "Tell me what’s on your mind.",
                afterUni: structured.afterUni || null,
                expectedCompany: structured.expectedCompany || null
              }));
            } else if (interviewMode || assessmentMode) {
              response.end(JSON.stringify({ data: parseStructuredReply(reply) }));
            } else {
              response.end(JSON.stringify({ reply: reply || "I’m thinking. Try asking that another way." }));
            }
          } catch (error) {
            const details = String(error.stderr || error.message);
            console.error("[gemini-local-mentor]", details);
            const unsupportedAccount = details.includes("UNSUPPORTED_CLIENT") || details.includes("IneligibleTierError");
            const authMissing = details.includes("Auth method");
            response.statusCode = unsupportedAccount || authMissing ? 503 : 500;
            response.end(JSON.stringify({
              error: unsupportedAccount
                ? "Google sign-in is not supported for this Gemini CLI account. Add a GEMINI_API_KEY and restart the local server."
                : authMissing
                ? "The selected AI provider needs an API key before this character can reply."
                : "This character is temporarily unavailable."
            }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ command }) => ({
  plugins: [react(), geminiBridge()],
  base: command === "build" ? "/Data-Game/" : "/"
}));
