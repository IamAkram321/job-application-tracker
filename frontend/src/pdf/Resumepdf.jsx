import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#000000",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  contactContainer: {
    marginBottom: 16,
    fontSize: 9,
    lineHeight: 1.8,
  },
  contactLine: {
    marginBottom: 2,
  },
  contactLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  section: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1.5pt solid #000000",
    paddingBottom: 4,
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "justify",
    lineHeight: 1.7,
  },
  bulletItem: {
    marginLeft: 20,
    marginBottom: 5,
    paddingLeft: 0,
    lineHeight: 1.6,
  },
  bulletText: {
    marginLeft: 0,
  },
  projectContainer: {
    marginBottom: 10,
  },
  projectTitle: {
    fontWeight: "bold",
    marginBottom: 3,
    fontSize: 10,
    lineHeight: 1.5,
  },
  projectTech: {
    fontSize: 9,
    marginBottom: 4,
    color: "#333333",
    fontStyle: "italic",
  },
  experienceContainer: {
    marginBottom: 12,
  },
  experienceCompany: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 2,
  },
  experienceRole: {
    fontWeight: "bold",
    fontSize: 9,
    marginBottom: 2,
  },
  experienceMeta: {
    fontSize: 9,
    marginBottom: 4,
    color: "#333333",
  },
  skillsLine: {
    marginBottom: 3,
    fontSize: 9,
    lineHeight: 1.6,
  },
  skillsCategory: {
    fontWeight: "bold",
    fontSize: 9,
    marginTop: 4,
    marginBottom: 2,
  },
  educationLine: {
    marginBottom: 3,
    fontSize: 9,
    lineHeight: 1.6,
  },
  educationInstitution: {
    fontWeight: "bold",
    fontSize: 9,
    marginBottom: 2,
  },
});

// Ensure URLs always have https:// so clicking works
const fixUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const splitBullets = (text = "") => {
  if (!text || typeof text !== "string") return [];
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
};

const formatContactInfo = (data) => {
  const items = [];
  if (data.phone && data.phone.trim()) {
    items.push({ label: "Phone", value: data.phone.trim(), type: "text" });
  }
  if (data.email && data.email.trim()) {
    items.push({ label: "Email", value: data.email.trim(), type: "email" });
  }
  if (data.linkedin && data.linkedin.trim()) {
    const url = fixUrl(data.linkedin);
    items.push({ label: "LinkedIn", value: url, type: "link", display: url.replace(/^https?:\/\//, "") });
  }
  if (data.github && data.github.trim()) {
    const url = fixUrl(data.github);
    items.push({ label: "GitHub", value: url, type: "link", display: url.replace(/^https?:\/\//, "") });
  }
  if (data.leetcode && data.leetcode.trim()) {
    const url = fixUrl(data.leetcode);
    items.push({ label: "LeetCode", value: url, type: "link", display: url.replace(/^https?:\/\//, "") });
  }
  if (data.portfolio && data.portfolio.trim()) {
    const url = fixUrl(data.portfolio);
    items.push({ label: "Personal Website", value: url, type: "link", display: url.replace(/^https?:\/\//, "") });
  }
  return items;
};

const parseExperience = (text) => {
  if (!text || typeof text !== "string") return [];
  const blocks = text.split("\n\n").filter(Boolean);
  return blocks.map((block) => {
    const lines = splitBullets(block);
    if (lines.length === 0) return null;
    
    // First line is usually company/role/date
    const header = lines[0];
    const bullets = lines.slice(1);
    
    // Try to parse header for company, role, date, location
    const parts = header.split("|").map(p => p.trim()).filter(Boolean);
    let company = "";
    let role = "";
    let date = "";
    let location = "";
    
    if (parts.length >= 1) company = parts[0];
    if (parts.length >= 2) role = parts[1];
    if (parts.length >= 3) date = parts[2];
    if (parts.length >= 4) location = parts[3];
    
    // If no pipes, try to detect patterns
    if (parts.length === 1) {
      // Check if it contains date patterns
      const dateMatch = header.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}/i);
      if (dateMatch) {
        company = header.substring(0, dateMatch.index).trim();
        date = dateMatch[0];
      } else {
        company = header;
      }
    }
    
    return { company, role, date, location, bullets };
  }).filter(Boolean);
};

const parseProjects = (text) => {
  if (!text || typeof text !== "string") return [];
  const blocks = text.split("\n\n").filter(Boolean);
  return blocks.map((block) => {
    const lines = block.split("\n").filter(Boolean);
    if (lines.length === 0) return null;
    
    const firstLine = lines[0];
    // Check if first line contains | (tech stack separator)
    const titleParts = firstLine.split("|").map(p => p.trim()).filter(Boolean);
    const title = titleParts[0] || "";
    const techStack = titleParts.slice(1).join(" | ");
    const bullets = lines.slice(1);
    
    return { title, techStack, bullets };
  }).filter(Boolean);
};

const parseSkills = (text) => {
  if (!text || typeof text !== "string") return [];
  const lines = splitBullets(text);
  const skills = [];
  let currentCategory = null;
  
  lines.forEach((line) => {
    // Check if line is a category (ends with : or is bold pattern)
    if (line.match(/^[A-Z][a-zA-Z\s]+:\s*$/)) {
      currentCategory = line.replace(":", "").trim();
      skills.push({ type: "category", name: currentCategory });
    } else if (line.match(/^\*\*[^*]+\*\*:/) || line.match(/^[A-Z][a-zA-Z\s]+$/)) {
      // Bold category or standalone category
      currentCategory = line.replace(/\*\*/g, "").replace(":", "").trim();
      skills.push({ type: "category", name: currentCategory });
    } else if (line.trim()) {
      skills.push({ type: "skill", text: line, category: currentCategory });
    }
  });
  
  return skills;
};

export default function ResumePdf({ data = {}, sections = {} }) {
  // Ensure data and sections are objects
  if (!data || typeof data !== "object") data = {};
  if (!sections || typeof sections !== "object") sections = {};
  
  const contactItems = formatContactInfo(data);
  const experiences = sections.experience && data.experience ? parseExperience(data.experience) : [];
  const projects = sections.projects && data.projects ? parseProjects(data.projects) : [];
  const skills = sections.technicalSkills && data.technicalSkills ? parseSkills(data.technicalSkills) : [];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* NAME */}
        <Text style={styles.name}>{data.fullName || "YOUR NAME"}</Text>

        {/* CONTACT INFORMATION */}
        {contactItems.length > 0 && (
          <View style={styles.contactContainer}>
            {contactItems.map((item, index) => (
              <View key={index} style={styles.contactLine}>
                <Text>
                  <Text style={styles.contactLabel}>{item.label}:</Text>
                  {item.type === "email" ? (
                    <Link src={`mailto:${item.value}`} style={{ color: "#000000", textDecoration: "none" }}>
                      {item.value}
                    </Link>
                  ) : item.type === "link" ? (
                    <Link src={item.value} style={{ color: "#000000", textDecoration: "none" }}>
                      {item.display || item.value}
                    </Link>
                  ) : (
                    <Text>{item.value}</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* PROFILE SUMMARY */}
        {sections.summary && data.summary && data.summary.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFILE SUMMARY</Text>
            <Text style={styles.paragraph}>{data.summary.trim()}</Text>
          </View>
        )}

        {/* TECHNICAL SKILLS */}
        {sections.technicalSkills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            {skills.map((item, i) => {
              if (item.type === "category") {
                return (
                  <Text key={i} style={styles.skillsCategory}>
                    {item.name ? `• ${item.name}:` : ""}
                  </Text>
                );
              } else {
                return (
                  <Text key={i} style={styles.skillsLine}>
                    {item.text}
                  </Text>
                );
              }
            })}
            {skills.length === 0 && data.technicalSkills && (
              <Text style={styles.skillsLine}>{data.technicalSkills.trim()}</Text>
            )}
          </View>
        )}

        {/* EXPERIENCE */}
        {sections.experience && experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {experiences.map((exp, i) => (
              <View key={i} style={styles.experienceContainer}>
                {exp.company && (
                  <Text style={styles.experienceCompany}>{exp.company}</Text>
                )}
                {exp.role && (
                  <Text style={styles.experienceRole}>{exp.role}</Text>
                )}
                {(exp.date || exp.location) && (
                  <Text style={styles.experienceMeta}>
                    {[exp.date, exp.location].filter(Boolean).join(" • ")}
                  </Text>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <View>
                    {exp.bullets.map((bullet, j) => (
                      <View key={j} style={styles.bulletItem}>
                        <Text style={styles.bulletText}>• {bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {sections.projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.map((project, i) => (
              <View key={i} style={styles.projectContainer}>
                {project.title && (
                  <Text style={styles.projectTitle}>{project.title.trim()}</Text>
                )}
                {project.techStack && (
                  <Text style={styles.projectTech}>{project.techStack}</Text>
                )}
                {project.bullets && project.bullets.length > 0 && (
                  <View>
                    {project.bullets.map((bullet, j) => (
                      <View key={j} style={styles.bulletItem}>
                        <Text style={styles.bulletText}>• {bullet.trim()}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ACHIEVEMENTS & LEADERSHIP */}
        {sections.achievements && data.achievements && data.achievements.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACHIEVEMENTS & LEADERSHIP</Text>
            {splitBullets(data.achievements).length > 0 ? (
              splitBullets(data.achievements).map((line, i) => (
                <View key={i} style={styles.bulletItem}>
                  <Text style={styles.bulletText}>• {line}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.paragraph}>{data.achievements.trim()}</Text>
            )}
          </View>
        )}

        {/* EDUCATION */}
        {sections.education && data.education && data.education.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {splitBullets(data.education).length > 0 ? (
              splitBullets(data.education).map((line, i) => {
                // Check if line looks like an institution name (usually first line or bold)
                const isInstitution = i === 0 || line.match(/^[A-Z][a-zA-Z\s&]+$/);
                return (
                  <Text key={i} style={isInstitution ? styles.educationInstitution : styles.educationLine}>
                    {line}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.educationLine}>{data.education.trim()}</Text>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
