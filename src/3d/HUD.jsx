import { useState } from "react";

const px = { fontFamily: "'Press Start 2P', 'Courier New', monospace" };

export function ControlsHint() {
    const [open, setOpen] = useState(true);
    if (!open) return (
        <button onClick={() => setOpen(true)} style={{
            position: "fixed", bottom: 16, left: 16, zIndex: 40,
            ...px, fontSize: 9, color: "#ffe169", background: "#0f0e17",
            border: "2px solid #ffe169", padding: "6px 12px", cursor: "pointer",
            boxShadow: "3px 3px 0 #ffe169",
        }}>? HELP</button>
    );
    return (
        <div style={{
            position: "fixed", bottom: 16, left: 16, zIndex: 40,
            background: "#0f0e17", border: "2px solid #ffe169",
            boxShadow: "4px 4px 0 #ffe169",
            padding: "12px 16px", minWidth: 210,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ ...px, fontSize: 9, color: "#ffe169" }}>🎮 CONTROLS</span>
                <button onClick={() => setOpen(false)} style={{
                    ...px, fontSize: 9, color: "#ffe169", background: "none",
                    border: "2px solid #ffe169", cursor: "pointer", padding: "1px 6px",
                }}>X</button>
            </div>
            {[
                ["W / ↑", "Forward"],
                ["S / ↓", "Reverse"],
                ["A / ←", "Turn Left"],
                ["D / →", "Turn Right"],
                ["SPACE", "Brake"],
                ["ENTER", "Open Area"],
            ].map(([key, action]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
                    <span style={{ ...px, fontSize: 8, color: "#4cc9f0", background: "#1a1a2e", padding: "2px 6px", border: "1px solid #4cc9f0" }}>{key}</span>
                    <span style={{ ...px, fontSize: 8, color: "#ccc" }}>{action}</span>
                </div>
            ))}
            <div style={{ borderTop: "1px solid #333", marginTop: 10, paddingTop: 8 }}>
                <span style={{ ...px, fontSize: 7, color: "#666" }}>Drive to colored buildings!</span>
            </div>
        </div>
    );
}

export function Speedometer({ speed }) {
    const kmh = Math.round(Math.abs(speed) * 3.6);
    const pct = Math.min(Math.abs(speed) / 12, 1);
    const barColor = pct > 0.75 ? "#ff6b6b" : pct > 0.4 ? "#ffe169" : "#4cc9f0";
    return (
        <div style={{
            position: "fixed", bottom: 16, right: 16, zIndex: 40,
            background: "#0f0e17", border: "2px solid #4cc9f0",
            boxShadow: "4px 4px 0 #4cc9f0",
            padding: "10px 14px", minWidth: 120, textAlign: "center",
        }}>
            <div style={{ ...px, fontSize: 22, color: barColor, lineHeight: 1 }}>{kmh}</div>
            <div style={{ ...px, fontSize: 7, color: "#555", marginBottom: 8 }}>km/h</div>
            <div style={{ background: "#1a1a2e", height: 8, border: "1px solid #333" }}>
                <div style={{ width: `${pct * 100}%`, height: "100%", background: barColor, transition: "width 0.1s" }} />
            </div>
        </div>
    );
}

export function AreaPrompt({ area }) {
    if (!area) return null;
    const colors = { about: "#4cc9f0", projects: "#ff6b6b", blog: "#ffe169" };
    const labels = { about: "ABOUT ME", projects: "PROJECTS", blog: "BLOG" };
    const c = colors[area] || "#fff";
    return (
        <div style={{
            position: "fixed", bottom: "50%", left: "50%", transform: "translate(-50%, 60px)",
            zIndex: 40, textAlign: "center",
            background: "#0f0e17", border: `3px solid ${c}`,
            boxShadow: `5px 5px 0 ${c}`,
            padding: "10px 24px",
            animation: "blink 1s step-end infinite",
        }}>
            <div style={{ ...px, fontSize: 10, color: c }}>▸ {labels[area]}</div>
            <div style={{ ...px, fontSize: 8, color: "#888", marginTop: 6 }}>PRESS ENTER TO OPEN</div>
        </div>
    );
}

export function TopBar({ onOpen }) {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
            background: "#0f0e17", borderBottom: "2px solid #7209b7",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 20px",
        }}>
            <span style={{ ...px, fontSize: 12, color: "#fff" }}>
                PANUPONG<span style={{ color: "#7209b7" }}>.CHAI</span>
            </span>
            <div style={{ display: "flex", gap: 8 }}>
                {[
                    { id: "about", label: "ABOUT", c: "#4cc9f0" },
                    { id: "projects", label: "PROJECTS", c: "#ff6b6b" },
                    { id: "blog", label: "BLOG", c: "#ffe169" },
                ].map(b => (
                    <button key={b.id} onClick={() => onOpen(b.id)} style={{
                        ...px, fontSize: 8, color: b.c, background: "none",
                        border: `2px solid ${b.c}`, padding: "5px 10px",
                        cursor: "pointer", boxShadow: `2px 2px 0 ${b.c}`,
                    }}>{b.label}</button>
                ))}
            </div>
        </div>
    );
}
