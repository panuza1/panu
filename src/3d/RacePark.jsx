import { useMemo } from "react";
import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";
import {
    raceCurve,
    raceSamples,
    RACE_WIDTH,
    pointAt,
    tangentAt,
} from "./raceTrack.js";
import { KnockBody, KnockTireBarriers } from "./KnockBody.jsx";

function Ribbon({ pts, width, y = 0.04, color }) {
    const geometry = useMemo(() => {
        const n = pts.length;
        const half = width / 2;
        const verts = [];
        const idx = [];
        for (let i = 0; i < n; i++) {
            const p = pts[i];
            const next = pts[(i + 1) % n];
            const tx = next.x - p.x, tz = next.z - p.z;
            const len = Math.hypot(tx, tz) || 1;
            const nx = -tz / len, nz = tx / len;
            verts.push(p.x + nx * half, y, p.z + nz * half);
            verts.push(p.x - nx * half, y, p.z - nz * half);
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
    }, [pts, width, y]);

    return (
        <mesh geometry={geometry} receiveShadow>
            <meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
    );
}

function StartGate({ x, z, rot = 0 }) {
    return (
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
            <mesh position={[-2.4, 1.7, 0]} castShadow>
                <boxGeometry args={[0.18, 3.4, 0.18]} />
                <meshStandardMaterial color="#5a5a5a" metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[2.4, 1.7, 0]} castShadow>
                <boxGeometry args={[0.18, 3.4, 0.18]} />
                <meshStandardMaterial color="#5a5a5a" metalness={0.3} roughness={0.5} />
            </mesh>
            <mesh position={[0, 3.35, 0]} castShadow>
                <boxGeometry args={[5.0, 0.35, 0.25]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} position={[-2.25 + i * 0.5, 3.35, 0.14]}>
                    <boxGeometry args={[0.48, 0.32, 0.04]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "#111" : "#f5f5f5"} />
                </mesh>
            ))}
            <Billboard position={[0, 3.95, 0]}>
                <Text fontSize={0.4} color="#5a4a3a" anchorX="center" fontWeight={800}>CIRCUIT</Text>
            </Billboard>
        </group>
    );
}

function CheckeredLine({ x, z, rot = 0 }) {
    return (
        <group position={[x, 0.055, z]} rotation={[-Math.PI / 2, 0, rot]}>
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} position={[-2.25 + i * 0.5, 0, 0]} receiveShadow>
                    <planeGeometry args={[0.48, RACE_WIDTH * 0.85]} />
                    <meshStandardMaterial color={i % 2 === 0 ? "#1a1a1a" : "#eee"} />
                </mesh>
            ))}
        </group>
    );
}

function Playground({ x, z }) {
    return (
        <group position={[x, 0, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
                <circleGeometry args={[3.6, 18]} />
                <meshStandardMaterial color="#c9b896" roughness={1} />
            </mesh>
            <mesh position={[-1.3, 0.85, 0]} castShadow>
                <boxGeometry args={[0.7, 1.7, 0.7]} />
                <meshStandardMaterial color="#c48b7a" roughness={0.7} />
            </mesh>
            <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, -0.55]} castShadow>
                <boxGeometry args={[2.0, 0.12, 0.65]} />
                <meshStandardMaterial color="#7ea8be" roughness={0.5} />
            </mesh>
            <Billboard position={[0, 2.6, 0]}>
                <Text fontSize={0.28} color="#5a4a3a" anchorX="center" fontWeight={800}>PLAY</Text>
            </Billboard>
        </group>
    );
}

function PicnicMesh() {
    return (
        <group>
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[1.8, 0.12, 1.0]} />
                <meshStandardMaterial color="#a67c52" roughness={0.85} />
            </mesh>
            <mesh position={[-0.7, -0.23, 0]} castShadow>
                <boxGeometry args={[0.12, 0.44, 0.12]} />
                <meshStandardMaterial color="#8d6e63" />
            </mesh>
            <mesh position={[0.7, -0.23, 0]} castShadow>
                <boxGeometry args={[0.12, 0.44, 0.12]} />
                <meshStandardMaterial color="#8d6e63" />
            </mesh>
            <mesh position={[0, -0.1, 0.85]} castShadow>
                <boxGeometry args={[1.6, 0.1, 0.35]} />
                <meshStandardMaterial color="#a67c52" />
            </mesh>
            <mesh position={[0, -0.1, -0.85]} castShadow>
                <boxGeometry args={[1.6, 0.1, 0.35]} />
                <meshStandardMaterial color="#a67c52" />
            </mesh>
        </group>
    );
}

export function RacePark({ carRef }) {
    const trackPts = useMemo(() => raceCurve.getSpacedPoints(140), []);

    const gate = useMemo(() => {
        const p = pointAt(0);
        const tan = tangentAt(0);
        return { x: p.x, z: p.z, rot: Math.atan2(tan.x, tan.z) };
    }, []);

    const stands = useMemo(() => {
        return [0.18, 0.45, 0.72].map((t) => {
            const p = pointAt(t);
            const tan = tangentAt(t);
            const nx = -tan.z, nz = tan.x;
            return {
                x: p.x + nx * 4.5,
                z: p.z + nz * 4.5,
                rot: Math.atan2(nx, nz) + Math.PI,
            };
        });
    }, []);

    const flags = useMemo(() => {
        const colors = ["#c62828", "#1565c0", "#2e7d32", "#c62828", "#1565c0"];
        return [0.05, 0.28, 0.52, 0.68, 0.88].map((t, i) => {
            const p = pointAt(t);
            const tan = tangentAt(t);
            const nx = -tan.z, nz = tan.x;
            return { x: p.x + nx * 3.2, z: p.z + nz * 3.2, color: colors[i] };
        });
    }, []);

    const stacks = useMemo(() => {
        return [0.02, 0.08, 0.35, 0.6, 0.85].map((t) => {
            const p = pointAt(t);
            const tan = tangentAt(t);
            const nx = -tan.z, nz = tan.x;
            return { x: p.x + nx * 3.6, z: p.z + nz * 3.6 };
        });
    }, []);

    return (
        <group>
            <Ribbon pts={trackPts} width={RACE_WIDTH + 1.4} y={0.025} color="#7a6548" />
            <Ribbon pts={trackPts} width={RACE_WIDTH} y={0.04} color="#4a453f" />
            <Ribbon pts={trackPts} width={0.18} y={0.05} color="#cbb896" />

            <KnockTireBarriers carRef={carRef} samples={raceSamples} width={RACE_WIDTH} every={5} />

            <StartGate x={gate.x} z={gate.z} rot={gate.rot} />
            <CheckeredLine x={gate.x} z={gate.z} rot={gate.rot} />

            {stands.map((s, i) => (
                <KnockBody key={`st${i}`} carRef={carRef} position={[s.x, 0.55, s.z]} mass={9} hitRadius={3.4} restY={0.55}>
                    <group rotation={[0, s.rot, 0]}>
                        {[0, 1, 2].map((row) => (
                            <mesh key={row} position={[0, row * 0.35, -row * 0.55]} castShadow>
                                <boxGeometry args={[6.2, 0.2, 0.55]} />
                                <meshStandardMaterial color="#8d6e63" roughness={0.85} />
                            </mesh>
                        ))}
                    </group>
                </KnockBody>
            ))}

            {flags.map((f, i) => (
                <KnockBody key={`fl${i}`} carRef={carRef} position={[f.x, 1.5, f.z]} mass={1.1} hitRadius={1.25} restY={1.5}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.05, 0.06, 3, 6]} />
                        <meshStandardMaterial color="#8d6e63" />
                    </mesh>
                    <mesh position={[0.35, 1.1, 0]} castShadow>
                        <boxGeometry args={[0.7, 0.45, 0.04]} />
                        <meshStandardMaterial color={f.color} roughness={0.7} />
                    </mesh>
                </KnockBody>
            ))}

            {stacks.map((s, i) => (
                <KnockBody key={`ts${i}`} carRef={carRef} position={[s.x, 0.35, s.z]} mass={2.4} hitRadius={1.4} restY={0.35}>
                    {[0, 0.22, 0.44].map((y, j) => (
                        <mesh key={j} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                            <torusGeometry args={[0.3, 0.11, 7, 12]} />
                            <meshStandardMaterial color={j === 1 ? "#333" : "#2a2a2a"} roughness={0.9} />
                        </mesh>
                    ))}
                </KnockBody>
            ))}

            <Playground x={-8} z={8} />
            <KnockBody carRef={carRef} position={[6, 0.45, -8]} mass={4} hitRadius={1.9} restY={0.45}>
                <PicnicMesh />
            </KnockBody>
            <KnockBody carRef={carRef} position={[-6, 0.45, -7]} mass={4} hitRadius={1.9} restY={0.45}>
                <PicnicMesh />
            </KnockBody>
        </group>
    );
}

export { raceSamples, RACE_WIDTH, isOnRaceTrack, RACE_RADIUS } from "./raceTrack.js";
