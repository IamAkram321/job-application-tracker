import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createRequire } from "module";

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✔ Correct for CommonJS module

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/match", upload.single("resume"), async (req, res) => {
  try {
    console.log("🔹 /api/ai/match HIT");

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Job Description is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Resume PDF is required" });
    }

    console.log("📄 File received:", req.file.originalname);
    console.log("📄 File size:", req.file.size);

    // ---- PDF PARSING ----
    console.log("📄 Parsing PDF...");
    const parsed = await pdfParse(req.file.buffer); // ✔ FIXED
    const resumeText = parsed.text;

    console.log("📄 Resume text length:", resumeText.length);

    // ---- PROMPT ----
    const prompt = `
Compare the job description and resume. Extract:
1. Matched skills (exact words)
2. Missing skills
3. Match score (0–100)
4. A short summary (2–3 sentences)

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Return JSON ONLY:
{
  "matchScore": number,
  "matchedSkills": string[],
  "missingSkills": string[],
  "summary": string
}
`;

    console.log("🤖 Sending to OpenAI...");

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const rawText =
      aiResponse.output_text ||
      aiResponse.output?.[0]?.content?.[0]?.text ||
      "";

    console.log("🤖 RAW OUTPUT:", rawText);

    // ---- Extract JSON ----
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(500).json({
        error: "AI returned invalid JSON.",
        raw: rawText,
      });
    }

    const finalJson = JSON.parse(jsonMatch[0]);

    console.log("✅ Final Parsed JSON:", finalJson);

    res.json(finalJson);
  } catch (error) {
    console.error("❌ AI MATCH ERROR:", error);
    res.status(500).json({ error: "AI analysis failed. Check backend logs." });
  }
});

export default router;
