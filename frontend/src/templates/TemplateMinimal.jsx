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

export default function TemplateMinimal({ data, sections }) {
    const { fullName, phone, email, linkedin, github, leetcode, portfolio,
        summary, technicalSkills, experience, projects, achievements, education } = data;

    return (
        <div className="p-8 font-sans text-[11px]" style={{ color: "#1f2937" }}>
            {/* HEADER */}
            <div className="flex justify-between items-baseline">
                <h1 className="text-2xl font-bold">{fullName || "Your Name"}</h1>
                <div className="text-right text-[10px]">
                    {phone && <p>{phone}</p>}
                    {email && <p>{email}</p>}
                    {linkedin && <p>{linkedin}</p>}
                    {github && <p>{github}</p>}
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {sections.summary && (
                    <Section title="Profile Summary">
                        {summary && summary.trim() ? <Paragraphs text={summary} /> : <p className="text-[10px] italic text-gray-400">Start typing...</p>}
                    </Section>
                )}

                {sections.technicalSkills && technicalSkills && technicalSkills.trim() && <Section title="Skills"><Bullets text={technicalSkills} /></Section>}

                {sections.experience && experience && experience.trim() && (
                    <Section title="Experience">
                        {splitLines(experience).length > 0 && <TitleLine text={splitLines(experience)[0]} />}
                        {splitLines(experience).length > 1 && <Bullets text={splitLines(experience).slice(1).join("\n")} />}
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
                                    <TitleLine text={heading} />
                                    {rest.length > 0 && <Bullets text={rest.join("\n")} />}
                                </div>
                            );
                        }).filter(Boolean)}
                    </Section>
                )}

                {sections.achievements && achievements && achievements.trim() && <Section title="Achievements"><Bullets text={achievements} /></Section>}

                {sections.education && education && education.trim() && (
                    <Section title="Education">
                        {splitLines(education).length > 0 && <TitleLine text={splitLines(education)[0]} />}
                        {splitLines(education).length > 1 && <Bullets text={splitLines(education).slice(1).join("\n")} />}
                    </Section>
                )}

            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="space-y-1">
            <h2 className="uppercase font-semibold text-[11px]">{title}</h2>
            {children}
            <div style={{ height: 1, background: "#e5e7eb", marginTop: 8 }} />
        </section>
    );
}
