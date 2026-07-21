import { useState } from "react";

const font = { fontFamily: "'Nunito', system-ui, sans-serif" };

function Panel({ onClose, title, children }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(60,50,40,0.35)", backdropFilter: "blur(6px)",
            padding: 16,
        }}>
            <div style={{
                background: "rgba(255,255,255,0.95)", borderRadius: 20,
                width: "min(460px, 94vw)", boxShadow: "0 20px 50px rgba(60,50,40,0.2)",
                overflow: "hidden",
            }}>
                <div style={{
                    padding: "16px 20px", display: "flex", alignItems: "center",
                    justifyContent: "space-between", borderBottom: "1px solid rgba(90,74,58,0.08)",
                }}>
                    <span style={{ ...font, fontSize: 18, fontWeight: 800, color: "#5a4a3a" }}>{title}</span>
                    <button onClick={onClose} style={{
                        ...font, fontSize: 20, border: "none", background: "transparent",
                        color: "#8a7a6a", cursor: "pointer", lineHeight: 1,
                    }}>×</button>
                </div>
                <div style={{ padding: "20px 22px 24px", overflowY: "auto", maxHeight: "65vh" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

function Tag({ children }) {
    return (
        <span style={{
            display: "inline-block", ...font, fontSize: 12, fontWeight: 700,
            color: "#6a5a4a", background: "rgba(90,74,58,0.08)",
            padding: "4px 10px", borderRadius: 999, marginRight: 6, marginBottom: 6,
        }}>{children}</span>
    );
}

export function AboutPanel({ onClose }) {
    return (
        <Panel onClose={onClose} title="About Me">
            <p style={{ ...font, color: "#5a4a3a", lineHeight: 1.7, fontSize: 15, marginBottom: 12 }}>
                Hi! I'm <strong>Panupong Chaichun</strong> — you can call me <strong>Jeng</strong>.
            </p>
            <p style={{ ...font, color: "#7a6a5a", lineHeight: 1.7, fontSize: 14, marginBottom: 18 }}>
                Currently studying Information Technology at King Mongkut's University of Technology Thonburi (KMUTT).
            </p>
            <div style={{ marginBottom: 18 }}>
                {["React", "Python", "JavaScript", "Three.js", "Node.js"].map((t) => (
                    <Tag key={t}>{t}</Tag>
                ))}
            </div>
            <a href="https://github.com/panuza1" target="_blank" rel="noopener noreferrer"
                style={{
                    ...font, display: "inline-block", fontWeight: 800, fontSize: 14,
                    color: "#fff", background: "#c48b7a", textDecoration: "none",
                    padding: "10px 18px", borderRadius: 999,
                }}>
                GitHub →
            </a>
        </Panel>
    );
}

const projects = [
    {
        title: "Entropy Calculator",
        desc: "Calculate entropy and weighted average entropy for decision trees.",
        tech: ["Python"],
        link: "https://github.com/panuza1/calculate_entropy_and_Weigh_Avg_Ent",
    },
];

export function ProjectsPanel({ onClose }) {
    return (
        <Panel onClose={onClose} title="Projects">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {projects.map((p, i) => (
                    <div key={i} style={{
                        background: "rgba(90,74,58,0.04)", borderRadius: 14, padding: 14,
                    }}>
                        <div style={{ ...font, fontSize: 16, fontWeight: 800, color: "#5a4a3a", marginBottom: 6 }}>{p.title}</div>
                        <p style={{ ...font, fontSize: 13, color: "#7a6a5a", lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
                        <div style={{ marginBottom: 8 }}>{p.tech.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                        <a href={p.link} target="_blank" rel="noopener noreferrer"
                            style={{ ...font, fontSize: 13, fontWeight: 700, color: "#c48b7a", textDecoration: "none" }}>
                            View project →
                        </a>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

const posts = [
    {
        title: "Why I Stopped Using Classes in Python",
        excerpt: "After years of writing class-based Python code, I realized simpler tools often get the job done better...",
        body: "There was a day when I enclosed everything in classes. It seemed the 'professional' thing to do. But over time I found that functions, closures, and simple data structures often lead to cleaner, more readable code.",
    },
    {
        title: "Understanding JavaScript Closures",
        excerpt: "Closures are a fundamental concept in JavaScript that allow functions to access variables from an outer scope...",
        body: "Closures let you maintain private variables and create more modular code. Every time a function is defined inside another function, a closure is formed — capturing the outer scope.",
    },
];

export function BlogPanel({ onClose }) {
    const [selected, setSelected] = useState(null);
    return (
        <Panel onClose={onClose} title="Blog">
            {selected ? (
                <div>
                    <button onClick={() => setSelected(null)} style={{
                        ...font, fontSize: 13, fontWeight: 700, color: "#c48b7a",
                        background: "none", border: "none", cursor: "pointer", marginBottom: 12,
                    }}>← Back</button>
                    <div style={{ ...font, fontSize: 16, fontWeight: 800, color: "#5a4a3a", marginBottom: 10 }}>{selected.title}</div>
                    <p style={{ ...font, fontSize: 14, color: "#6a5a4a", lineHeight: 1.75 }}>{selected.body}</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {posts.map((p, i) => (
                        <div key={i} onClick={() => setSelected(p)} style={{
                            background: "rgba(90,74,58,0.04)", borderRadius: 14, padding: 14, cursor: "pointer",
                        }}>
                            <div style={{ ...font, fontSize: 15, fontWeight: 800, color: "#5a4a3a", marginBottom: 6 }}>{p.title}</div>
                            <p style={{ ...font, fontSize: 13, color: "#7a6a5a", lineHeight: 1.55 }}>{p.excerpt}</p>
                        </div>
                    ))}
                </div>
            )}
        </Panel>
    );
}
