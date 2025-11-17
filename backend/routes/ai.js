import express from "express";
import multer from "multer";
import { createRequire } from "module";
import ollama from "ollama";

// Fix for pdf-parse (CommonJS)
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST: /api/ai/match
router.post("/match", upload.single("resume"), async (req, res) => {
  try {
    console.log("🔹 OLLAMA API HIT");

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume PDF is required" });
    }

    // Extract PDF text
    console.log("📄 Parsing PDF...");
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    console.log("📄 Resume length:", resumeText.length);

    // CREATE PROMPT
    const prompt = `
Compare the job description and resume. Extract:
1. Matched skills (exact words)
2. Missing skills
3. Match score (0–100)
4. A short summary (2–3 lines)

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return ONLY valid JSON:
{
  "matchScore": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "summary": string
}
`;

    //  CALL OLLAMA
    const response = await ollama.chat({
      model: "mistral",
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.message.content;
    console.log("🤖 Raw Ollama output:", rawText);

    // extract JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({
        error: "AI returned invalid JSON.",
        raw: rawText,
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.json(parsed);

  } catch (err) {
    console.error("❌ OLLAMA MATCH ERROR:", err);
    res.status(500).json({ error: "Ollama failed", details: err.message });
  }
});

export default router;
