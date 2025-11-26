export default function TitleLine({ text }) {
  if (!text || typeof text !== "string") return null;
  return (
    <p
      className="text-[11px] font-semibold leading-snug"
      style={{
        textAlign: "left",
        color: "#1f2937",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </p>
  );
}
