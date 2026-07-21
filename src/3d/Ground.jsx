import { useMemo } from "react";
import * as THREE from "three";
import { trackSamples, ROAD_WIDTH, isOnRoad } from "./track.js";
import { isOnRaceTrack, raceOuterSamples } from "./raceTrack.js";

const BUILDING_SPOTS = [[-14, -12], [14, -12], [0, 16]];

function tooCloseToBuilding(x, z, r = 7) {
    return BUILDING_SPOTS.some(([bx, bz]) => (x - bx) ** 2 + (z - bz) ** 2 < r * r);
}

const PONDS_RAW = [
    [8, 5, 3.0, 2.3],
    [-9, 6, 2.6, 2.0],
];

function nearPond(x, z) {
    return PONDS_RAW.some(([px, pz, rx, rz]) => {
        const dx = (x - px) / (rx + 1);
        const dz = (z - pz) / (rz + 1);
        return dx * dx + dz * dz < 1;
    });
}

function canPlace(x, z, roadMargin = 2.9) {
    if (Math.abs(x) > 42 || Math.abs(z) > 42) return false;
    if (isOnRoad(x, z, roadMargin)) return false;
    if (isOnRaceTrack(x, z)) return false;
    if (tooCloseToBuilding(x, z)) return false;
    if (nearPond(x, z)) return false;
    if (x * x + z * z < 9) return false;
    return true;
}

function scatter(count, radius, seed, margin = 2.9) {
    const out = [];
    let s = seed;
    for (let i = 0; i < count * 6 && out.length < count; i++) {
        s = (s * 16807) % 2147483647;
        const a = (s / 2147483647) * Math.PI * 2;
        s = (s * 16807) % 2147483647;
        const r = Math.sqrt(s / 2147483647) * radius;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        if (canPlace(x, z, margin)) out.push([Math.round(x * 10) / 10, Math.round(z * 10) / 10]);
    }
    return out;
}

/* ---------- Realistic-ish low poly nature ---------- */

function RealTree({ x, z, kind = 0 }) {
    const scale = 0.85 + Math.abs(Math.sin(x * 1.7 + z)) * 0.35;
    const lean = Math.sin(x * 0.4) * 0.08;
    const trunkH = kind === 1 ? 1.8 : 1.45;
    const leafColor = kind === 0 ? "#4f7d4a" : kind === 1 ? "#3f6b45" : "#5a8a52";
    const leafColor2 = kind === 0 ? "#6a9458" : kind === 1 ? "#557f4f" : "#73a05f";

    return (
        <group position={[x, 0, z]} scale={scale} rotation={[lean, x, 0]}>
            {/* Roots flare */}
            <mesh position={[0, 0.12, 0]} castShadow>
                <cylinderGeometry args={[0.32, 0.42, 0.24, 7]} />
                <meshStandardMaterial color="#6b4f3a" roughness={0.95} />
            </mesh>
            {/* Trunk */}
            <mesh position={[0, trunkH / 2 + 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.24, trunkH, 7]} />
                <meshStandardMaterial color="#7a5a3e" roughness={0.92} />
            </mesh>
            {/* Branch stubs */}
            <mesh position={[0.28, trunkH * 0.7, 0]} rotation={[0, 0, 0.9]} castShadow>
                <cylinderGeometry args={[0.05, 0.07, 0.45, 5]} />
                <meshStandardMaterial color="#6b4f3a" roughness={0.95} />
            </mesh>

            {kind === 1 ? (
                /* Pine style */
                <>
                    <mesh position={[0, trunkH + 0.5, 0]} castShadow>
                        <coneGeometry args={[1.1, 1.6, 7]} />
                        <meshStandardMaterial color={leafColor} roughness={0.88} />
                    </mesh>
                    <mesh position={[0, trunkH + 1.3, 0]} castShadow>
                        <coneGeometry args={[0.8, 1.3, 7]} />
                        <meshStandardMaterial color={leafColor2} roughness={0.88} />
                    </mesh>
                    <mesh position={[0, trunkH + 2.0, 0]} castShadow>
                        <coneGeometry args={[0.45, 0.9, 7]} />
                        <meshStandardMaterial color={leafColor} roughness={0.88} />
                    </mesh>
                </>
            ) : (
                /* Round deciduous canopy — fluffy cloud clusters */
                <>
                    <mesh position={[0, trunkH + 0.75, 0]} castShadow>
                        <sphereGeometry args={[1.15, 10, 10]} />
                        <meshStandardMaterial color={leafColor} roughness={0.82} />
                    </mesh>
                    <mesh position={[0.55, trunkH + 1.0, 0.25]} castShadow>
                        <sphereGeometry args={[0.72, 9, 9]} />
                        <meshStandardMaterial color={leafColor2} roughness={0.82} />
                    </mesh>
                    <mesh position={[-0.5, trunkH + 0.95, -0.3]} castShadow>
                        <sphereGeometry args={[0.62, 9, 9]} />
                        <meshStandardMaterial color={leafColor2} roughness={0.82} />
                    </mesh>
                    <mesh position={[0.15, trunkH + 1.45, -0.05]} castShadow>
                        <sphereGeometry args={[0.55, 9, 9]} />
                        <meshStandardMaterial color={leafColor} roughness={0.82} />
                    </mesh>
                    <mesh position={[-0.15, trunkH + 0.55, 0.45]} castShadow>
                        <sphereGeometry args={[0.5, 8, 8]} />
                        <meshStandardMaterial color={leafColor2} roughness={0.82} />
                    </mesh>
                </>
            )}
        </group>
    );
}

function RealBush({ x, z }) {
    const s = 0.75 + Math.abs(Math.sin(x + z * 2)) * 0.4;
    return (
        <group position={[x, 0, z]} scale={s}>
            <mesh position={[0, 0.35, 0]} castShadow>
                <sphereGeometry args={[0.42, 8, 8]} />
                <meshStandardMaterial color="#5f8a52" roughness={0.9} />
            </mesh>
            <mesh position={[0.28, 0.3, 0.12]} castShadow>
                <sphereGeometry args={[0.3, 7, 7]} />
                <meshStandardMaterial color="#6f9a5c" roughness={0.9} />
            </mesh>
            <mesh position={[-0.22, 0.28, -0.1]} castShadow>
                <sphereGeometry args={[0.26, 7, 7]} />
                <meshStandardMaterial color="#4e7a45" roughness={0.9} />
            </mesh>
        </group>
    );
}

function GrassClump({ x, z }) {
    const h = 0.28 + Math.abs(Math.sin(x * 5 + z * 3)) * 0.22;
    return (
        <group position={[x, 0, z]}>
            {[[-0.06, 0], [0.02, 0.05], [0.07, -0.03], [-0.02, -0.06]].map(([ox, oz], i) => (
                <mesh key={i} position={[ox, h * (0.7 + i * 0.08) / 2, oz]} castShadow
                    rotation={[0.05 * i, 0, (i - 1.5) * 0.12]}>
                    <boxGeometry args={[0.05, h * (0.7 + i * 0.08), 0.05]} />
                    <meshStandardMaterial color={i % 2 ? "#6f9b58" : "#5d8a4a"} roughness={1} />
                </mesh>
            ))}
        </group>
    );
}

function Flower({ x, z }) {
    const palette = ["#e8a0a0", "#f0c97a", "#a8c8dc", "#d4b4e0", "#f5f0e6"];
    const c = palette[Math.abs(Math.floor(x * 11 + z * 5)) % palette.length];
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, 0.16, 0]}>
                <cylinderGeometry args={[0.025, 0.03, 0.32, 5]} />
                <meshStandardMaterial color="#5d8a4a" />
            </mesh>
            <mesh position={[0, 0.34, 0]} castShadow>
                <sphereGeometry args={[0.1, 7, 7]} />
                <meshStandardMaterial color={c} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.34, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshStandardMaterial color="#f0e6a0" />
            </mesh>
        </group>
    );
}

function Rock({ x, z }) {
    const s = 0.35 + Math.abs(Math.sin(x * 2.2)) * 0.55;
    return (
        <mesh position={[x, 0.12 * s, z]} castShadow scale={[s, s * 0.7, s]} rotation={[0.15, x, 0.2]}>
            <dodecahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color="#9a9080" roughness={0.95} />
        </mesh>
    );
}

function Log({ x, z }) {
    const rot = Math.sin(x) * 1.2;
    return (
        <mesh position={[x, 0.18, z]} rotation={[0.1, rot, 0.15]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 1.4, 7]} />
            <meshStandardMaterial color="#6b4f3a" roughness={0.95} />
        </mesh>
    );
}

function Mushroom({ x, z }) {
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 0.2, 6]} />
                <meshStandardMaterial color="#e8dcc8" />
            </mesh>
            <mesh position={[0, 0.24, 0]} castShadow>
                <sphereGeometry args={[0.12, 7, 7]} />
                <meshStandardMaterial color="#c45c4a" roughness={0.7} />
            </mesh>
        </group>
    );
}

function Pond({ x, z, rx = 3, rz = 2.2 }) {
    return (
        <group position={[x, 0, z]}>
            {/* Mud shore */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
                <circleGeometry args={[Math.max(rx, rz) + 0.7, 22]} />
                <meshStandardMaterial color="#8a7355" roughness={1} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]} receiveShadow>
                <circleGeometry args={[Math.max(rx, rz) + 0.35, 22]} />
                <meshStandardMaterial color="#6e5a42" roughness={1} />
            </mesh>
            {/* Water */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]} scale={[1, rz / rx, 1]} receiveShadow>
                <circleGeometry args={[rx, 22]} />
                <meshStandardMaterial color="#5a9aaa" transparent opacity={0.78} roughness={0.12} metalness={0.3} />
            </mesh>
            {/* Reeds */}
            {[[-rx * 0.65, rz * 0.5], [rx * 0.6, -rz * 0.35], [rx * 0.2, rz * 0.55]].map(([px, pz], i) => (
                <mesh key={i} position={[px, 0.4, pz]} castShadow>
                    <cylinderGeometry args={[0.035, 0.04, 0.8, 5]} />
                    <meshStandardMaterial color="#5d8a4a" roughness={1} />
                </mesh>
            ))}
        </group>
    );
}

/* ---------- Ground surfaces ---------- */

function DirtGround() {
    // Layered dirt patches for natural variation
    const patches = useMemo(() => {
        const out = [];
        let s = 17;
        for (let i = 0; i < 55; i++) {
            s = (s * 16807) % 2147483647;
            const a = (s / 2147483647) * Math.PI * 2;
            s = (s * 16807) % 2147483647;
            const r = Math.sqrt(s / 2147483647) * 26;
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;
            s = (s * 16807) % 2147483647;
            const size = 2.2 + (s / 2147483647) * 3.5;
            const tone = i % 3;
            out.push({ x, z, size, tone });
        }
        return out;
    }, []);

    const colors = ["#8f7354", "#7d6548", "#9a8160"];

    return (
        <>
            {/* Base dirt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[110, 110]} />
                <meshStandardMaterial color="#866b4c" roughness={1} />
            </mesh>
            {/* Darker outer ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[160, 160]} />
                <meshStandardMaterial color="#6e573e" roughness={1} />
            </mesh>
            {/* Tone patches */}
            {patches.map((p, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, p.x]} position={[p.x, 0.008, p.z]} receiveShadow>
                    <circleGeometry args={[p.size, 10]} />
                    <meshStandardMaterial color={colors[p.tone]} roughness={1} />
                </mesh>
            ))}
            {/* Sparse grass patches on dirt */}
            {patches.filter((_, i) => i % 3 === 0).map((p, i) => (
                <mesh key={`g${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[p.x * 0.85, 0.012, p.z * 0.85]} receiveShadow>
                    <circleGeometry args={[p.size * 0.55, 8]} />
                    <meshStandardMaterial color="#6a8450" roughness={1} transparent opacity={0.55} />
                </mesh>
            ))}
        </>
    );
}

function RoadRibbon() {
    const geometry = useMemo(() => {
        const pts = trackSamples;
        const n = pts.length;
        const half = ROAD_WIDTH / 2;
        const verts = [];
        const idx = [];
        for (let i = 0; i < n; i++) {
            const p = pts[i];
            const next = pts[(i + 1) % n];
            const tx = next.x - p.x, tz = next.z - p.z;
            const len = Math.hypot(tx, tz) || 1;
            const nx = -tz / len, nz = tx / len;
            verts.push(p.x + nx * half, 0.035, p.z + nz * half);
            verts.push(p.x - nx * half, 0.035, p.z - nz * half);
        }
        for (let i = 0; i < n; i++) {
            const a = 2 * i, b = 2 * i + 1;
            const c = 2 * ((i + 1) % n), d = 2 * ((i + 1) % n) + 1;
            idx.push(a, c, b, b, c, d);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
    }, []);

    return (
        <mesh geometry={geometry} receiveShadow>
            <meshStandardMaterial color="#5c5348" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
    );
}

function RoadShoulder() {
    // Soft dirt edge beside road
    const geometry = useMemo(() => {
        const pts = trackSamples;
        const n = pts.length;
        const half = ROAD_WIDTH / 2 + 0.7;
        const verts = [];
        const idx = [];
        for (let i = 0; i < n; i++) {
            const p = pts[i];
            const next = pts[(i + 1) % n];
            const tx = next.x - p.x, tz = next.z - p.z;
            const len = Math.hypot(tx, tz) || 1;
            const nx = -tz / len, nz = tx / len;
            verts.push(p.x + nx * half, 0.02, p.z + nz * half);
            verts.push(p.x - nx * half, 0.02, p.z - nz * half);
        }
        for (let i = 0; i < n; i++) {
            const a = 2 * i, b = 2 * i + 1;
            const c = 2 * ((i + 1) % n), d = 2 * ((i + 1) % n) + 1;
            idx.push(a, c, b, b, c, d);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
    }, []);

    return (
        <mesh geometry={geometry} receiveShadow>
            <meshStandardMaterial color="#7a6548" roughness={1} side={THREE.DoubleSide} />
        </mesh>
    );
}

function CenterDashes() {
    const dashes = useMemo(() => {
        const out = [];
        for (let i = 0; i < trackSamples.length; i += 9) {
            const p = trackSamples[i];
            const next = trackSamples[(i + 1) % trackSamples.length];
            out.push({ x: p.x, z: p.z, angle: Math.atan2(next.x - p.x, next.z - p.z) });
        }
        return out;
    }, []);
    return (
        <>
            {dashes.map((d, i) => (
                <mesh key={i} position={[d.x, 0.05, d.z]} rotation={[-Math.PI / 2, 0, -d.angle]} receiveShadow>
                    <planeGeometry args={[0.12, 1.0]} />
                    <meshStandardMaterial color="#cbb896" roughness={1} />
                </mesh>
            ))}
        </>
    );
}

const TREES = scatter(30, 25, 42).map(([x, z], i) => [x, z, i % 3]);
const BUSHES = scatter(34, 23, 99);
const GRASS = scatter(55, 22, 7, 2.6);
const FLOWERS = scatter(28, 20, 123, 2.7);
const ROCKS = scatter(18, 24, 55);
const LOGS = scatter(8, 22, 77);
const MUSHROOMS = scatter(14, 18, 31, 2.8);
const PONDS = PONDS_RAW.filter(([x, z]) => !isOnRoad(x, z, 4) && !tooCloseToBuilding(x, z, 8));

// Outer trees — just outside the winding circuit
const EDGE_TREES = (() => {
    const pts = raceOuterSamples(5.2, 5);
    return pts
        .filter((p, i) => i % 2 === 0 && !tooCloseToBuilding(p.x, p.z, 10) && !isOnRaceTrack(p.x, p.z))
        .map((p, i) => [p.x, p.z, i % 3]);
})();

const FAR_TREES = (() => {
    const pts = raceOuterSamples(9.5, 4);
    return pts
        .filter((p, i) => i % 2 === 1 && !isOnRaceTrack(p.x, p.z, 6))
        .map((p, i) => [p.x, p.z, (i + 1) % 3]);
})();

const EDGE_BUSHES = (() => {
    const pts = [
        ...raceOuterSamples(3.6, 3),
        ...raceOuterSamples(7.2, 5),
    ];
    return pts
        .filter((p) => !isOnRaceTrack(p.x, p.z))
        .map((p) => [p.x, p.z]);
})();

export function Ground() {
    return (
        <>
            <DirtGround />
            <RoadShoulder />
            <RoadRibbon />
            <CenterDashes />

            {PONDS.map(([x, z, rx, rz], i) => (
                <Pond key={`p${i}`} x={x} z={z} rx={rx} rz={rz} />
            ))}

            {TREES.map(([x, z, kind], i) => (
                <RealTree key={`t${i}`} x={x} z={z} kind={kind} />
            ))}
            {EDGE_TREES.map(([x, z, kind], i) => (
                <RealTree key={`et${i}`} x={x} z={z} kind={kind} />
            ))}
            {FAR_TREES.map(([x, z, kind], i) => (
                <RealTree key={`ft${i}`} x={x} z={z} kind={kind} />
            ))}
            {BUSHES.map(([x, z], i) => <RealBush key={`b${i}`} x={x} z={z} />)}
            {EDGE_BUSHES.map(([x, z], i) => <RealBush key={`eb${i}`} x={x} z={z} />)}
            {GRASS.map(([x, z], i) => <GrassClump key={`g${i}`} x={x} z={z} />)}
            {FLOWERS.map(([x, z], i) => <Flower key={`f${i}`} x={x} z={z} />)}
            {ROCKS.map(([x, z], i) => <Rock key={`r${i}`} x={x} z={z} />)}
            {LOGS.map(([x, z], i) => <Log key={`l${i}`} x={x} z={z} />)}
            {MUSHROOMS.map(([x, z], i) => <Mushroom key={`m${i}`} x={x} z={z} />)}
        </>
    );
}
