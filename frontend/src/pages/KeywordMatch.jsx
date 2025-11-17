import React, { useState } from "react";

const KeywordMatch = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setResumeFile(file);
  };

  // Send data to backend
  const analyzeMatch = async () => {
    if (!jobDescription) {
      alert("Please paste job description!");
      return;
    }
    if (!resumeFile) {
      alert("Please upload a resume PDF!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("resume", resumeFile);

      const response = await fetch("http://localhost:5000/api/ai/match", {
        method: "POST",
        body: formData, // important
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("AI service failed. Check backend logs.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-6">
        
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Job Match Score</h1>
        <p className="text-gray-500 mb-6">
          Upload your resume (PDF) and paste any job description to get AI-powered match insights.
        </p>

        {/* INPUTS SECTION */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* JOB DESCRIPTION */}
          <div>
            <label className="font-semibold text-gray-700">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full mt-2 p-3 h-40 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste the Job Description here..."
            ></textarea>
          </div>

          {/* RESUME UPLOAD */}
          <div>
            <label className="font-semibold text-gray-700">Upload Your Resume (PDF)</label>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            />

            {resumeFile && (
              <p className="mt-3 text-green-700 text-sm font-medium">
                ✓ {resumeFile.name} uploaded successfully.
              </p>
            )}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={analyzeMatch}
          disabled={loading}
          className="w-full mt-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze with AI"}
        </button>

        {/* RESULT SECTION */}
        {result && (
          <div className="mt-10 bg-gray-50 p-6 rounded-xl border">
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Match Results</h2>

            {/* SCORE */}
            <div className="mb-6">
              <p className="font-semibold text-lg text-gray-700">
                Match Score: <span className="text-blue-600">{result.matchScore}%</span>
              </p>

              <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${result.matchScore}%` }}
                ></div>
              </div>
            </div>

            {/* MATCHED SKILLS */}
            <div className="mb-4">
              <p className="font-semibold">Matched Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.matchedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING SKILLS */}
            <div className="mb-4">
              <p className="font-semibold">Missing Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.missingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="mt-4">
              <p className="font-semibold">AI Summary:</p>
              <p className="mt-2 text-gray-700">{result.summary}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default KeywordMatch;
