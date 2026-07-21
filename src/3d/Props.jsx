import { KnockBody } from "./KnockBody.jsx";
import { trackSamples, ROAD_WIDTH, isOnRoad } from "./track.js";

function Crate() {
    return (
        <mesh castShadow>
            <boxGeometry args={[0.75, 0.75, 0.75]} />
            <meshStandardMaterial color="#c4a484" roughness={0.85} />
        </mesh>
    );
}

function Barrel({ color = "#6d8b9c" }) {
    return (
        <mesh castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.9, 12]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
        </mesh>
    );
}

function Cone() {
    return (
        <>
            <mesh castShadow>
                <coneGeometry args={[0.35, 0.85, 8]} />
                <meshStandardMaterial color="#e07a3d" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.12, 8]} />
                <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
            </mesh>
        </>
    );
}

function Pin() {
    return (
        <>
            <mesh castShadow position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.22, 0.28, 0.45, 10]} />
                <meshStandardMaterial color="#f5f0e6" roughness={0.65} />
            </mesh>
            <mesh castShadow position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.22, 10, 10]} />
                <meshStandardMaterial color="#f5f0e6" roughness={0.65} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
                <torusGeometry args={[0.2, 0.04, 8, 16]} />
                <meshStandardMaterial color="#c62828" roughness={0.5} />
            </mesh>
        </>
    );
}

function Ball({ color }) {
    return (
        <mesh castShadow>
            <sphereGeometry args={[0.4, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
    );
}

const CONES = (() => {
    const out = [];
    const n = trackSamples.length;
    for (let i = 10; i < n; i += 36) {
        const p = trackSamples[i];
        const next = trackSamples[(i + 1) % n];
        const tx = next.x - p.x, tz = next.z - p.z;
        const len = Math.hypot(tx, tz) || 1;
        const side = (i / 36) % 2 < 1 ? 1 : -1;
        const off = ROAD_WIDTH / 2 + 0.85;
        out.push([p.x + (-tz / len) * off * side, p.z + (tx / len) * off * side]);
    }
    return out;
})();

const ITEMS = [
    ...CONES.map(([x, z]) => ({ type: "cone", x, z, mass: 0.5, restY: 0.42, r: 1.2 })),
    { type: "crate", x: 4, z: 5, mass: 2.2, restY: 0.4, r: 1.4 },
    { type: "crate", x: 4.8, z: 5.8, mass: 2.2, restY: 0.4, r: 1.4 },
    { type: "crate", x: -5, z: -4, mass: 2.2, restY: 0.4, r: 1.4 },
    { type: "barrel", x: -11, z: -8, mass: 3.5, restY: 0.45, r: 1.4, color: "#6d8b9c" },
    { type: "barrel", x: 11, z: -8, mass: 3.5, restY: 0.45, r: 1.4, color: "#a67c6d" },
    { type: "barrel", x: 2, z: 12, mass: 3.5, restY: 0.45, r: 1.4, color: "#7d9a72" },
    { type: "pin", x: 5, z: -1, mass: 0.7, restY: 0.55, r: 1.15 },
    { type: "pin", x: 5.7, z: -0.4, mass: 0.7, restY: 0.55, r: 1.15 },
    { type: "pin", x: 4.5, z: 0.2, mass: 0.7, restY: 0.55, r: 1.15 },
    { type: "ball", x: 7, z: -6, mass: 0.9, restY: 0.4, r: 1.3, color: "#8fa8b8" },
    { type: "ball", x: -7, z: 8, mass: 0.9, restY: 0.4, r: 1.3, color: "#c4a574" },
].filter((it) => !isOnRoad(it.x, it.z, 2.5));

export function Props({ carRef }) {
    return (
        <>
            {ITEMS.map((it, i) => (
                <KnockBody
                    key={i}
                    carRef={carRef}
                    position={[it.x, it.restY, it.z]}
                    mass={it.mass}
                    hitRadius={it.r}
                    restY={it.restY}
                >
                    {it.type === "crate" && <Crate />}
                    {it.type === "barrel" && <Barrel color={it.color} />}
                    {it.type === "cone" && <Cone />}
                    {it.type === "pin" && <Pin />}
                    {it.type === "ball" && <Ball color={it.color} />}
                </KnockBody>
            ))}
        </>
    );
}
