/**
 * Florine speaking-coach proxy (Vercel Edge Function).
 *
 * The browser records the learner, transcodes to WAV, and POSTs the audio here
 * with the target French sentence. We forward it to Gemini for a transcript +
 * pronunciation score + one short tip, and return JSON.
 *
 * SECURITY: the Gemini key lives ONLY in the Vercel env var GEMINI_API_KEY
 * (never in the repo or the browser). This function reads it server-side and is
 * the only place the key is used. On any failure we return a soft { error } so
 * the client can gracefully fall back to "shadow & self-record".
 */
export const config = { runtime: "edge" };

interface SpeakRequest {
  audioBase64?: string;
  mimeType?: string;
  reference?: string;
}

function getEnv(name: string): string | undefined {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return g.process?.env?.[name];
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const key = getEnv("GEMINI_API_KEY");
  if (!key) return json({ error: "no_key" }); // soft: client falls back

  let body: SpeakRequest;
  try {
    body = (await req.json()) as SpeakRequest;
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const { audioBase64, mimeType, reference } = body;
  if (!audioBase64 || !reference) return json({ error: "bad_request" }, 400);

  const model = getEnv("GEMINI_MODEL") || "gemini-3.5-flash";
  const prompt = [
    "You are a warm, encouraging French pronunciation coach for a teenage learner (DELF A2/B1).",
    `The learner was asked to say this French sentence aloud: "${reference}".`,
    "Listen to the attached recording of the learner.",
    "Reply ONLY as JSON with keys:",
    "transcript (what you actually heard them say, in French),",
    "score (an integer 0-100 for how close their pronunciation and wording are to the target),",
    "feedback (ONE short, kind sentence in English with one concrete, specific tip).",
  ].join(" ");

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: mimeType || "audio/wav", data: audioBase64 } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          transcript: { type: "string" },
          score: { type: "integer" },
          feedback: { type: "string" },
        },
        required: ["transcript", "score", "feedback"],
      },
    },
  };

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "x-goog-api-key": key, "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!r.ok) {
      const detail = await r.text();
      return json({ error: "gemini_error", status: r.status, detail: detail.slice(0, 300) });
    }
    const data = (await r.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return json({ error: "empty_response" });
    const parsed = JSON.parse(text) as {
      transcript?: string;
      score?: number;
      feedback?: string;
    };
    return json({
      transcript: parsed.transcript ?? "",
      score: typeof parsed.score === "number" ? parsed.score : null,
      feedback: parsed.feedback ?? "",
    });
  } catch (e) {
    return json({ error: "exception", detail: String(e).slice(0, 200) });
  }
}
