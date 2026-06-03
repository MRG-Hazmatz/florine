// Tier 2 (Phase 2+): AI-graded writing feedback via Google Gemini.
//
// Public-code / private-secrets pattern (spec section 4.1.1):
//   - The Gemini API key lives ONLY in Vercel's environment variables
//     (GEMINI_API_KEY) — never committed to the repo, never sent to the client.
//   - This serverless function reads process.env.GEMINI_API_KEY and calls
//     Gemini SERVER-SIDE, then returns already-graded results.
//   - The frontend POSTs to /api/grade and never sees the key.
//   - Forkers set their own GEMINI_API_KEY in their own Vercel deployment.
//
// Not implemented in Phase 1 — this stub documents the contract and returns 501.

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Phase 2 will:
  //   const key = process.env.GEMINI_API_KEY;
  //   if (!key) return res.status(503).json({ error: "AI grading not configured." });
  //   const { prompt, response, level } = req.body;
  //   ...call Gemini with `key`, return { corrections, rephrasings, cefrEstimate }.

  return res.status(501).json({
    error: "AI grading is not implemented yet (planned for Phase 2).",
  });
}
