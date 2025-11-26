import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  FileDown,
  LayoutTemplate,
  Maximize2,
  Minimize2,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePdf from "../pdf/Resumepdf";

import TemplateClassic from "../templates/TemplateClassic";
import TemplateModern from "../templates/TemplateModern";
import TemplateMinimal from "../templates/TemplateMinimal";

const templates = [
  { id: "classic", label: "Classic Professional (A)" },
  { id: "modern", label: "Modern Two-Column (B)" },
  { id: "minimal", label: "Minimal ATS (C)" },
];

const templateMap = {
  classic: TemplateClassic,
  modern: TemplateModern,
  minimal: TemplateMinimal,
};

export default function ResumeBuilder() {
  const resumeRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(45);
  const isDragging = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("classic");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    leetcode: "",
    portfolio: "",
    summary: "",
    technicalSkills: "",
    experience: "",
    projects: "",
    achievements: "",
    education: "",
  });

  const [sections, setSections] = useState({
    summary: true,
    technicalSkills: true,
    experience: true,
    projects: true,
    achievements: true,
    education: true,
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleSection = (name) =>
    setSections((prev) => ({ ...prev, [name]: !prev[name] }));

  const startDragging = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    // Prevent text selection during drag
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };
  
  const stopDragging = () => {
    isDragging.current = false;
    // Re-enable text selection
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };
  
  const handleDragging = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setLeftWidth(Math.min(Math.max(newWidth, 25), 75));
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("mouseup", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleDragging);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      filename: `${(form.fullName || "resume").replace(/\s+/g, "_")}.pdf`,
      margin: 0,
      pagebreak: { mode: "avoid-all" },
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  const ActiveTemplate = templateMap[activeTemplate] || TemplateClassic;

  return (
    <div className="max-w-full mx-auto py-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
            <Sparkles className="w-7 h-7 text-blue-600" />
            AI Resume Builder
          </h1>
          <p className="text-gray-600 text-sm">
            Drag panel, switch templates, full-screen preview & download PDF.
          </p>
        </div>

        <div className="flex gap-2">
          {/* ATS PDF BUTTON */}
          <PDFDownloadLink
            document={<ResumePdf data={form} sections={sections} />}
            fileName={`${(form.fullName || "resume").replace(/\s+/g, "_")}_ATS.pdf`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow flex gap-2 items-center"
          >
            {({ loading }) => (loading ? "Building ATS PDF..." : "Download ATS PDF")}
          </PDFDownloadLink>

          {/* VISUAL TEMPLATE PDF */}
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <FileDown className="w-4 h-4" />
            Download Visual PDF
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
          </button>
        </div>
      </div>

      {/* TEMPLATE SELECTOR */}
      {!isFullscreen && (
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                activeTemplate === t.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <LayoutTemplate className="w-3 h-3 inline-block mr-1" />
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* FULLSCREEN PREVIEW */}
      {isFullscreen ? (
        <div className="flex justify-center bg-gray-800 p-4 rounded">
          <div
            ref={resumeRef}
            style={{
              background: "#ffffff",
              width: "794px",
              minHeight: "1123px",
              border: "none",
            }}
          >
            <ActiveTemplate data={form} sections={sections} />
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[calc(100vh-160px)]">
          {/* LEFT SIDE FORM */}
          <div
            className="bg-white rounded-xl shadow p-4 overflow-y-auto"
            style={{ width: `${leftWidth}%`, minWidth: "25%", maxWidth: "75%" }}
          >
            <h2 className="text-lg font-semibold mb-3">Content</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "fullName",
                "phone",
                "email",
                "linkedin",
                "github",
                "leetcode",
                "portfolio",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={form[field] || ""}
                  onChange={handleChange}
                  placeholder={field}
                  className="border rounded-md px-3 py-2 text-sm"
                />
              ))}
            </div>

            <div className="space-y-3 mt-4">
              {[
                ["Profile Summary", "summary"],
                ["Technical Skills", "technicalSkills"],
                ["Experience (use • bullets)", "experience"],
                ["Projects", "projects"],
                ["Achievements & Leadership", "achievements"],
                ["Education", "education"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {label}
                  </label>
                  <textarea
                    name={key}
                    rows={3}
                    value={form[key] || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                Show / Hide Sections
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.keys(sections).map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sections[key]}
                      onChange={() => toggleSection(key)}
                    />
                    <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* DRAG DIVIDER */}
          <div
            className="w-2 cursor-col-resize bg-gray-300 hover:bg-blue-400 transition select-none"
            onMouseDown={startDragging}
            style={{ userSelect: "none" }}
          />

          {/* RESUME PREVIEW */}
          <div className="bg-gray-100 flex-1 overflow-auto flex justify-center">
            <div
              ref={resumeRef}
              style={{
                background: "#ffffff",
                width: "794px",
                minHeight: "1123px",
                border: "none",
                margin: "1rem 0",
              }}
            >
              <ActiveTemplate data={form} sections={sections} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
