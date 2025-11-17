import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

const KeywordMatch = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Extract text using pdf.js (frontend only for preview)
  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ");
    }
    return text;
  };

  // Resume upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file!");
      return;
    }

    setResumeFile(file);
    setExtracting(true);

    const extracted = await extractTextFromPDF(file);
    console.log("Extracted text preview:", extracted.slice(0, 500));

    setExtracting(false);
  };

  // Send form-data to backend
  const analyzeMatch = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Upload a resume and enter job description!");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("http://localhost:5000/api/ai/match", {
        method: "POST",
        body: formData, // IMPORTANT!!
      });

      const data = await response.json();
      console.log("AI RESULT:", data);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to AI backend.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Job Match Score</h1>
        <p className="text-gray-500 mb-6">Upload your resume and add job description.</p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold">Job Description</label>
            <textarea
              className="w-full mt-2 p-3 h-40 border rounded-lg"
              placeholder="Paste JD..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full mt-2 p-3 border rounded-lg bg-gray-50"
              onChange={handleFileUpload}
            />

            {extracting && (
              <p className="text-blue-600 mt-2 text-sm">Extracting PDF...</p>
            )}
          </div>

        </div>

        {/* Button */}
        <button
          onClick={analyzeMatch}
          disabled={loading}
          className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze with AI"}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 p-6 bg-gray-50 border rounded-xl">
            <h2 className="text-xl font-bold mb-4">Results</h2>

            <p className="text-lg font-semibold">
              Match Score: <span className="text-blue-600">{result.matchScore}%</span>
            </p>

            {/* Progress */}
            <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${result.matchScore}%` }}
              ></div>
            </div>

            {/* Matched Skills */}
            <div className="mt-4">
              <p className="font-semibold">Matched Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(result.matchedSkills || []).map((skill, i) => (
                  <span key={i} className="bg-green-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mt-4">
              <p className="font-semibold">Missing Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(result.missingSkills || []).map((skill, i) => (
                  <span key={i} className="bg-red-200 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold">AI Summary:</p>
              <p className="text-gray-700 mt-2">{result.summary}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default KeywordMatch;
