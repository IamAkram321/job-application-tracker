import React from "react";
import TitleLine from "../components/TitleLine";

function splitLines(text = "") {
  if (!text || typeof text !== "string") return [];
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function Bullets({ text }) {
  if (!text || typeof text !== "string") return null;
  const lines = splitLines(text);
  if (lines.length === 0) return null;
  return (
    <ul className="list-disc pl-5 space-y-1 text-[11px] leading-snug break-words">
      {lines.map((line, i) => (
        <li key={i} style={{ textAlign: "left", whiteSpace: "normal", wordBreak: "break-word" }}>
          {line.replace(/^[-•]\s*/, "")}
        </li>
      ))}
    </ul>
  );
}

export default function TemplateModern({ data, sections }) {
  const { fullName, phone, email, linkedin, github, leetcode, portfolio,
          summary, technicalSkills, experience, projects, achievements, education } = data;

  return (
    <div className="font-sans text-[11px]" style={{ color: "#1f2937" }}>
      {/* HEADER */}
      <div style={{ background: "#0f172a", color: "#ffffff", padding: "24px 32px" }}>
        <h1 className="text-2xl font-bold">{fullName || "Your Name"}</h1>
        <p className="text-[10px] mt-1 opacity-90">
          {phone && <span>{phone}</span>}
          {email && <> • {email}</>}
          {linkedin && <> • {linkedin}</>}
          {github && <> • {github}</>}
        </p>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-[1fr_2fr] gap-6 px-8 py-6">
        {/* LEFT SIDEBAR */}
        <div className="space-y-4" style={{ borderRight: "1px solid #e5e7eb", paddingRight: 16 }}>
          {sections.summary && summary && summary.trim() && <Side title="Profile"><p>{summary}</p></Side>}
          {sections.technicalSkills && technicalSkills && technicalSkills.trim() && <Side title="Skills"><Bullets text={technicalSkills} /></Side>}
          {sections.achievements && achievements && achievements.trim() && <Side title="Achievements"><Bullets text={achievements} /></Side>}
          {sections.education && education && education.trim() && <Side title="Education"><Bullets text={education} /></Side>}
        </div>

        {/* RIGHT MAIN */}
        <div className="space-y-4">
          {sections.experience && experience && experience.trim() && (
            <Main title="Experience">
              {splitLines(experience).length > 0 && <TitleLine text={splitLines(experience)[0]} />}
              {splitLines(experience).length > 1 && <Bullets text={splitLines(experience).slice(1).join("\n")} />}
            </Main>
          )}

          {sections.projects && projects && projects.trim() && (
            <Main title="Projects">
              {projects.split("\n\n").filter(Boolean).map((block, i) => {
                const lines = block.split("\n").filter(Boolean);
                const [heading, ...rest] = lines;
                if (!heading || !heading.trim()) return null;
                return (
                  <div key={i}>
                    <TitleLine text={heading} />
                    {rest.length > 0 && <Bullets text={rest.join("\n")} />}
                  </div>
                );
              }).filter(Boolean)}
            </Main>
          )}
        </div>
      </div>
    </div>
  );
}

function Side({ title, children }) {
  return (
    <section>
      <h2 className="text-[11px] font-semibold uppercase mb-1" style={{ color: "#000000" }}>{title}</h2>
      {children}
    </section>
  );
}

function Main({ title, children }) {
  return (
    <section>
      <h2 className="text-[11px] font-semibold uppercase pb-1 mb-1" style={{ borderBottom: "1px solid #e5e7eb", color: "#000000" }}>{title}</h2>
      {children}
    </section>
  );
}
