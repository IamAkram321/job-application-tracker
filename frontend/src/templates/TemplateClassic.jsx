import React from "react";



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
        <li
          key={i}
          style={{
            textAlign: "left",         // <-- NOT justified
            whiteSpace: "normal",      // <-- allows wrapping
            wordBreak: "break-word",   // <-- prevents overflow
          }}
        >
          {line.replace(/^[-•]\s*/, "")}
        </li>
      ))}
    </ul>
  );
}


function Paragraphs({ text }) {
  if (!text || typeof text !== "string" || !text.trim()) return null;
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;
  return (
    <p
      className="text-[11px] leading-snug"
      style={{
        textAlign: "justify",
        textJustify: "inter-word",
        color: "#1f2937",
        whiteSpace: "pre-line",
      }}
    >
      {trimmed}
    </p>
  );
}


export default function TemplateClassic({ data, sections }) {
  const { fullName, phone, email, linkedin, github, leetcode, portfolio,
    summary, technicalSkills, experience, projects, achievements, education } = data;

  return (
    <div className="p-8 font-serif text-[11px]" style={{ color: "#1f2937" }}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-[0.15em] mb-1" style={{ color: "#000000" }}>
          {fullName || "YOUR NAME"}
        </h1>

        <p className="text-[10px] space-x-1 wrap-break-word">
          {phone && <span>{phone}</span>}
          {email && <> <span>|</span> <span>{email}</span> </>}
          {linkedin && <> <span>|</span> <span>{linkedin}</span> </>}
          {github && <> <span>|</span> <span>{github}</span> </>}
          {leetcode && <> <span>|</span> <span>{leetcode}</span> </>}
          {portfolio && <> <span>|</span> <span>{portfolio}</span> </>}
        </p>

        <div style={{ height: 1, background: "#000000", marginTop: "12px" }} />
      </div>

      <div className="mt-4 space-y-3">
        {sections.summary && summary && summary.trim() && <Section title="Profile Summary"><Paragraphs text={summary} /></Section>}

        {sections.technicalSkills && technicalSkills && technicalSkills.trim() && (
          <Section title="Skills">
            <Bullets text={technicalSkills} />
          </Section>
        )}

        {sections.experience && experience && experience.trim() && (
          <Section title="Experience">
            <Paragraphs text={experience} />
          </Section>
        )}

        {sections.projects && projects && projects.trim() && (
          <Section title="Projects">
            {projects.split("\n\n").filter(Boolean).map((block, i) => {
              const lines = block.split("\n").filter(Boolean);
              const [heading, ...rest] = lines;
              if (!heading || !heading.trim()) return null;
              return (
                <div key={i}>
                  <p className="font-semibold whitespace-pre-line wrap-break-word">{heading}</p>
                  {rest.length > 0 && <Bullets text={rest.join("\n")} />}
                </div>
              );
            }).filter(Boolean)}
          </Section>
        )}

        {sections.achievements && achievements && achievements.trim() && (
          <Section title="Achievements and Leadership">
            <Bullets text={achievements} />
          </Section>
        )}

        {sections.education && education && education.trim() && (
          <Section title="Education"><Paragraphs text={education} /></Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2
        className="uppercase tracking-wide text-[11px] pb-1 font-bold"
        style={{ borderBottom: "1px solid #000000", color: "#000000" }}
      >
        {title}
      </h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}
