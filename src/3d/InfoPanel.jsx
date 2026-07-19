import { useState } from "react";

const px = {
    fontFamily: "'Press Start 2P', 'Courier New', monospace",
};

function Panel({ onClose, title, accent, children }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        }}>
            <div style={{
                background: "#0f0e17", border: `3px solid ${accent}`,
                borderRadius: 0, padding: 0, width: "min(480px,92vw)",
                boxShadow: `6px 6px 0 ${accent}`,
                imageRendering: "pixelated",
            }}>
                {/* Title bar */}
                <div style={{
                    background: accent, padding: "10px 16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <span style={{ ...px, fontSize: 12, color: "#fff", letterSpacing: 1 }}>{title}</span>
                    <button onClick={onClose} style={{
                        background: "none", border: "2px solid #fff", color: "#fff",
                        cursor: "pointer", padding: "2px 8px", ...px, fontSize: 12,
                    }}>X</button>
                </div>
                {/* Content */}
                <div style={{ padding: "20px 20px 24px", overflowY: "auto", maxHeight: "60vh" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

function Tag({ children, color }) {
    return (
        <span style={{
            display: "inline-block", border: `2px solid ${color}`, color: color,
            padding: "2px 8px", marginRight: 6, marginBottom: 6,
            ...px, fontSize: 8,
        }}>{children}</span>
    );
}

export function AboutPanel({ onClose }) {
    return (
        <Panel onClose={onClose} title="▸ ABOUT ME" accent="#4cc9f0">
            <p style={{ color: "#e0fbfc", lineHeight: 1.9, fontSize: 13, marginBottom: 16 }}>
                Hi! I'm <span style={{ color: "#4cc9f0" }}>Panupong Chaichun</span>{" "}
                (call me <span style={{ color: "#4cc9f0" }}>Jeng</span>) 👋
            </p>
            <p style={{ color: "#a8dadc", lineHeight: 1.8, fontSize: 12, marginBottom: 20 }}>
                Currently studying Information Technology at{" "}
                <span style={{ color: "#ffe169" }}>KMUTT</span> — King Mongkut's University of Technology Thonburi.
            </p>
            <div style={{ marginBottom: 20 }}>
                {["React", "Python", "JavaScript", "Three.js", "Node.js"].map(t => (
                    <Tag key={t} color="#4cc9f0">{t}</Tag>
                ))}
            </div>
            <a href="https://github.com/panuza1" target="_blank" rel="noopener noreferrer"
                style={{
                    display: "inline-block", background: "#4cc9f0", color: "#0f0e17",
                    padding: "8px 18px", ...px, fontSize: 10, textDecoration: "none",
                    border: "3px solid #fff", boxShadow: "3px 3px 0 #fff",
                }}>
                ★ GITHUB
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
        color: "#ff6b6b",
    },
];

export function ProjectsPanel({ onClose }) {
    return (
        <Panel onClose={onClose} title="▸ PROJECTS" accent="#ff6b6b">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {projects.map((p, i) => (
                    <div key={i} style={{
                        border: `2px solid ${p.color}`, padding: 14,
                        boxShadow: `3px 3px 0 ${p.color}`,
                    }}>
                        <div style={{ ...px, fontSize: 10, color: p.color, marginBottom: 8 }}>{p.title}</div>
                        <p style={{ color: "#ccc", fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>{p.desc}</p>
                        <div style={{ marginBottom: 10 }}>
                            {p.tech.map(t => <Tag key={t} color={p.color}>{t}</Tag>)}
                        </div>
                        <a href={p.link} target="_blank" rel="noopener noreferrer"
                            style={{ color: p.color, fontSize: 11, ...px, textDecoration: "none" }}>
                            ▸ VIEW PROJECT
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
        <Panel onClose={onClose} title="▸ BLOG" accent="#ffe169">
            {selected ? (
                <div>
                    <button onClick={() => setSelected(null)}
                        style={{ ...px, fontSize: 9, color: "#ffe169", background: "none", border: "none", cursor: "pointer", marginBottom: 14 }}>
                        ◂ BACK
                    </button>
                    <div style={{ ...px, fontSize: 10, color: "#ffe169", marginBottom: 12 }}>{selected.title}</div>
                    <p style={{ color: "#ccc", lineHeight: 1.8, fontSize: 12 }}>{selected.body}</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {posts.map((p, i) => (
                        <div key={i} style={{
                            border: "2px solid #ffe169", padding: 14, cursor: "pointer",
                            boxShadow: "3px 3px 0 #ffe169",
                        }} onClick={() => setSelected(p)}>
                            <div style={{ ...px, fontSize: 9, color: "#ffe169", marginBottom: 8 }}>{p.title}</div>
                            <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.6, marginBottom: 6 }}>{p.excerpt}</p>
                            <span style={{ ...px, fontSize: 8, color: "#ffe169" }}>▸ READ MORE</span>
                        </div>
                    ))}
                </div>
            )}
        </Panel>
    );
}
