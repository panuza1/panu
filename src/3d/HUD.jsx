import { useState } from "react";
import { input, isTouchDevice } from "./input.js";

const font = { fontFamily: "'Nunito', system-ui, sans-serif" };

const card = {
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(90,74,58,0.12)",
    borderRadius: 16,
    boxShadow: "0 8px 28px rgba(60,50,40,0.12)",
};

function TouchBtn({ label, k, size = 64 }) {
    const set = (v) => (e) => { e.preventDefault(); input[k] = v; };
    return (
        <button
            onPointerDown={set(true)}
            onPointerUp={set(false)}
            onPointerLeave={set(false)}
            onPointerCancel={set(false)}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                width: size, height: size, ...font, fontSize: 22, fontWeight: 800,
                color: "#5a4a3a", background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(90,74,58,0.15)", borderRadius: 18,
                boxShadow: "0 4px 14px rgba(60,50,40,0.12)",
                touchAction: "none", userSelect: "none", cursor: "pointer",
            }}
        >{label}</button>
    );
}

export function TouchControls() {
    if (!isTouchDevice()) return null;
    return (
        <>
            <div style={{ position: "fixed", bottom: 24, left: 16, zIndex: 45, display: "flex", gap: 12 }}>
                <TouchBtn label="←" k="left" />
                <TouchBtn label="→" k="right" />
            </div>
            <div style={{
                position: "fixed", bottom: 24, right: 16, zIndex: 45,
                display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end",
            }}>
                <TouchBtn label="↑" k="forward" />
                <div style={{ display: "flex", gap: 10 }}>
                    <TouchBtn label="■" k="brake" size={52} />
                    <TouchBtn label="↓" k="backward" />
                </div>
            </div>
        </>
    );
}

export function ControlsHint() {
    const [open, setOpen] = useState(true);
    if (isTouchDevice()) return null;
    if (!open) {
        return (
            <button onClick={() => setOpen(true)} style={{
                position: "fixed", bottom: 20, left: 20, zIndex: 40,
                ...font, fontSize: 13, fontWeight: 700, color: "#5a4a3a",
                ...card, padding: "8px 14px", cursor: "pointer",
            }}>Controls</button>
        );
    }
    return (
        <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 40, ...card, padding: "14px 16px", minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ ...font, fontSize: 14, fontWeight: 800, color: "#5a4a3a" }}>Controls</span>
                <button onClick={() => setOpen(false)} style={{
                    border: "none", background: "transparent", cursor: "pointer",
                    ...font, fontSize: 14, color: "#8a7a6a",
                }}>×</button>
            </div>
            {[
                ["W / ↑", "Forward"],
                ["S / ↓", "Reverse"],
                ["A / ←", "Turn left"],
                ["D / →", "Turn right"],
                ["Space", "Brake"],
                ["Enter", "Open area"],
                ["N", "Day / night"],
            ].map(([key, action]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 18, marginBottom: 6 }}>
                    <span style={{
                        ...font, fontSize: 12, fontWeight: 700, color: "#5a4a3a",
                        background: "rgba(90,74,58,0.08)", padding: "2px 8px", borderRadius: 8,
                    }}>{key}</span>
                    <span style={{ ...font, fontSize: 12, color: "#7a6a5a" }}>{action}</span>
                </div>
            ))}
            <div style={{ marginTop: 8, ...font, fontSize: 11, color: "#9a8a7a" }}>
                Drive around to explore
            </div>
        </div>
    );
}

export function Speedometer({ speed }) {
    const kmh = Math.round(Math.abs(speed) * 3.6);
    const pct = Math.min(Math.abs(speed) / 12, 1);
    const touch = isTouchDevice();
    return (
        <div style={{
            position: "fixed",
            ...(touch ? { top: 64, right: 14 } : { bottom: 20, right: 20 }),
            zIndex: 40, ...card, padding: "10px 14px", minWidth: 100, textAlign: "center",
        }}>
            <div style={{ ...font, fontSize: 26, fontWeight: 800, color: "#5a4a3a", lineHeight: 1 }}>{kmh}</div>
            <div style={{ ...font, fontSize: 11, color: "#9a8a7a", marginBottom: 6 }}>km/h</div>
            <div style={{ background: "rgba(90,74,58,0.1)", height: 6, borderRadius: 99 }}>
                <div style={{
                    width: `${pct * 100}%`, height: "100%", borderRadius: 99,
                    background: "#c48b7a", transition: "width 0.1s",
                }} />
            </div>
        </div>
    );
}

export function AreaPrompt({ area, onOpen }) {
    if (!area) return null;
    const labels = { about: "About Me", projects: "Projects", blog: "Blog" };
    const touch = isTouchDevice();
    return (
        <div
            onClick={() => onOpen && onOpen(area)}
            style={{
                position: "fixed", left: "50%", bottom: "28%", transform: "translateX(-50%)",
                zIndex: 40, textAlign: "center", ...card, padding: "12px 22px", cursor: "pointer",
            }}
        >
            <div style={{ ...font, fontSize: 16, fontWeight: 800, color: "#5a4a3a" }}>{labels[area]}</div>
            <div style={{ ...font, fontSize: 12, color: "#8a7a6a", marginTop: 4 }}>
                {touch ? "Tap to open" : "Press Enter to open"}
            </div>
        </div>
    );
}

export function TopBar({ onOpen, night = false, onToggleNight }) {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 22px",
            background: night ? "rgba(18,24,36,0.72)" : "rgba(255,255,255,0.55)",
            backdropFilter: "blur(12px)",
            borderBottom: night
                ? "1px solid rgba(200,210,230,0.08)"
                : "1px solid rgba(90,74,58,0.08)",
            transition: "background 0.4s ease",
        }}>
            <span style={{
                ...font, fontSize: 18, fontWeight: 800,
                color: night ? "#e8eef8" : "#5a4a3a",
            }}>
                Panupong<span style={{ color: "#c48b7a" }}>.Chai</span>
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {onToggleNight && (
                    <button
                        onClick={onToggleNight}
                        title="Toggle day / night (N)"
                        style={{
                            ...font, fontSize: 13, fontWeight: 700,
                            color: night ? "#e8eef8" : "#5a4a3a",
                            background: night ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)",
                            border: night
                                ? "1px solid rgba(200,210,230,0.15)"
                                : "1px solid rgba(90,74,58,0.12)",
                            borderRadius: 999, padding: "6px 14px", cursor: "pointer",
                        }}
                    >
                        {night ? "Night" : "Day"}
                    </button>
                )}
                {[
                    { id: "about", label: "About" },
                    { id: "projects", label: "Projects" },
                    { id: "blog", label: "Blog" },
                ].map((b) => (
                    <button key={b.id} onClick={() => onOpen(b.id)} style={{
                        ...font, fontSize: 13, fontWeight: 700,
                        color: night ? "#e8eef8" : "#5a4a3a",
                        background: night ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)",
                        border: night
                            ? "1px solid rgba(200,210,230,0.15)"
                            : "1px solid rgba(90,74,58,0.12)",
                        borderRadius: 999, padding: "6px 14px", cursor: "pointer",
                    }}>{b.label}</button>
                ))}
            </div>
        </div>
    );
}
