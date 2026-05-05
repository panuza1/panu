import { useEffect, useMemo, useRef, useState } from "react";

const loadingMessages = [
    "READING YOUR ENERGY...",
    "DECODING YOUR AURA...",
    "ANALYZING VIBE FREQUENCY...",
    "TRANSLATING YOUR MOOD..."
];

const useMockVibe = (text) => {
    return useMemo(
        () => ({
            vibeColor: "#c8ff00",
            vibeName: "Main Character Energy",
            vibeNameEn: "MAIN CHARACTER ERA",
            emoji: "✨",
            reading:
                "Your words carry a confident pulse with a soft edge of reflection. You are moving forward, but still checking in with yourself.",
            insight:
                "There is a quiet pattern of self-awareness here. You are calibrating your next move, not rushing it.",
            affirmation:
                "You are allowed to take up space and still move with care. Your pace is a strength, not a delay.",
            intensity: 82,
            meters: [
                { label: "Energy", val: 76, color: "#c8ff00" },
                { label: "Clarity", val: 64, color: "#ff3cac" },
                { label: "Mood", val: 88, color: "#00f5ff" }
            ],
            tracks: [
                { emoji: "🎧", name: "After Dark", artist: "Mr.Kitty", tag: "synth" },
                { emoji: "🌙", name: "Space Song", artist: "Beach House", tag: "dream" },
                { emoji: "⚡", name: "Sunset Lover", artist: "Petit Biscuit", tag: "chill" }
            ],
            tags: [
                { text: "#soft-focus", color: "#ff3cac" },
                { text: "#quiet-confidence", color: "#c8ff00" },
                { text: "#late-night-clarity", color: "#00f5ff" }
            ]
        }),
        [text]
    );
};

export const VibeCheck = ({ onBack }) => {
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("input");
    const [loadingIndex, setLoadingIndex] = useState(0);
    const [result, setResult] = useState(null);
    const timeoutRef = useRef(null);

    const mockVibe = useMockVibe(input);

    useEffect(() => {
        if (status !== "loading") return undefined;
        const interval = setInterval(() => {
            setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 700);
        return () => clearInterval(interval);
    }, [status]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleAnalyze = () => {
        if (!input.trim()) return;
        setStatus("loading");
        setLoadingIndex(0);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setResult(mockVibe);
            setStatus("result");
        }, 1200);
    };

    const handleReset = () => {
        setInput("");
        setResult(null);
        setStatus("input");
    };

    return (
        <section id="vibe-check" className="vibe-check">
            <div className="container">
                <button className="vibe-back" onClick={onBack} type="button">
                    ← Back to Home
                </button>
                <div className="header">
                    <div className="logo">VIBE<br />CHECK</div>
                    <div className="logo-sub">AI MOOD ANALYSIS</div>
                </div>

                {status === "input" && (
                    <div className="input-section">
                        <span className="input-label">// tell me how today feels</span>
                        <div className="input-wrapper">
                            <textarea
                                value={input}
                                placeholder="Share a quick snapshot of your day, your mood, or a thought that is stuck in your head."
                                maxLength={300}
                                onChange={(event) => setInput(event.target.value)}
                            />
                            <span className="char-count">{input.length} / 300</span>
                        </div>
                        <button className="submit-btn" onClick={handleAnalyze}>
                            <span className="btn-inner">
                                <span>✦</span>
                                <span>ANALYZE MY VIBE</span>
                                <span>✦</span>
                            </span>
                        </button>
                    </div>
                )}

                {status === "loading" && (
                    <div className="loading active">
                        <div className="loading-orb"></div>
                        <div className="loading-text">{loadingMessages[loadingIndex]}</div>
                    </div>
                )}

                {status === "result" && result && (
                    <div className="result-section active">
                        <div className="vibe-hero" style={{ "--vibe-color": result.vibeColor }}>
                            <span className="vibe-badge">✦ AI ANALYZED</span>
                            <span className="vibe-emoji">{result.emoji}</span>
                            <div className="vibe-name" style={{ color: result.vibeColor }}>
                                {result.vibeName}
                            </div>
                            <div className="vibe-en">{result.vibeNameEn}</div>
                            <div className="vibe-bar-wrap">
                                <div className="vibe-bar" style={{ background: result.vibeColor, width: `${result.intensity}%` }}></div>
                            </div>
                            <div className="vibe-score-label">
                                VIBE INTENSITY — <span style={{ color: result.vibeColor }}>{result.intensity}</span>/100
                            </div>
                        </div>

                        <div className="cards-grid">
                            <div className="info-card">
                                <div className="card-label">// ai reading</div>
                                <div className="card-content">{result.reading}</div>
                            </div>
                            <div className="info-card">
                                <div className="card-label">// energy meters</div>
                                <div className="meter-row">
                                    {result.meters.map((meter) => (
                                        <div className="meter-item" key={meter.label}>
                                            <span className="meter-label">{meter.label}</span>
                                            <div className="meter-track">
                                                <div
                                                    className="meter-fill"
                                                    style={{ background: meter.color, width: `${meter.val}%` }}
                                                ></div>
                                            </div>
                                            <span className="meter-val">{meter.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="insight-card">
                            <div className="insight-label">✦ AI DEEP INSIGHT</div>
                            <div className="insight-text">{result.insight}</div>
                        </div>

                        <div className="affirmation-card">
                            <div className="affirmation-text">{result.affirmation}</div>
                            <div className="affirmation-sub">✦ PERSONALIZED AFFIRMATION</div>
                        </div>

                        <div className="playlist-card">
                            <div className="playlist-title">// vibe playlist — ai curated for you</div>
                            {result.tracks.map((track, index) => (
                                <div className="track" key={track.name}>
                                    <span className="track-num">{`0${index + 1}`}</span>
                                    <div className="track-art">{track.emoji}</div>
                                    <div className="track-info">
                                        <div className="track-name">{track.name}</div>
                                        <div className="track-artist">{track.artist}</div>
                                    </div>
                                    <span className="track-tag">{track.tag}</span>
                                </div>
                            ))}
                        </div>

                        <div className="tags-row">
                            {result.tags.map((tag) => (
                                <span
                                    className="tag"
                                    key={tag.text}
                                    style={{ color: tag.color, borderColor: `${tag.color}33` }}
                                >
                                    {tag.text}
                                </span>
                            ))}
                        </div>

                        <button className="reset-btn" onClick={handleReset}>↺ CHECK AGAIN</button>
                    </div>
                )}
            </div>
        </section>
    );
};
