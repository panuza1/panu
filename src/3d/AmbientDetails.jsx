import { useMemo } from "react";
import { Text, Billboard } from "@react-three/drei";
import { trackSamples } from "./track.js";
import { raceSamples, RACE_WIDTH } from "./raceTrack.js";
import { KnockBody } from "./KnockBody.jsx";

function StreetLamp({ x, z, lit = false }) {
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
                <meshStandardMaterial color="#5c5348" metalness={0.35} roughness={0.55} />
            </mesh>
            <mesh position={[0.35, 2.95, 0]} castShadow>
                <boxGeometry args={[0.7, 0.08, 0.08]} />
                <meshStandardMaterial color="#5c5348" metalness={0.35} roughness={0.55} />
            </mesh>
            <mesh position={[0.65, 2.85, 0]} castShadow>
                <boxGeometry args={[0.28, 0.16, 0.22]} />
                <meshStandardMaterial
                    color="#fff8e1"
                    emissive={lit ? "#ffcc66" : "#fff3c4"}
                    emissiveIntensity={lit ? 2.4 : 0.35}
                />
            </mesh>
            {lit && (
                <pointLight
                    position={[0.65, 2.7, 0]}
                    intensity={1.8}
                    distance={14}
                    decay={2}
                    color="#ffd89a"
                />
            )}
        </group>
    );
}

function Bench({ x, z, rot = 0 }) {
    return (
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.42, 0]} castShadow>
                <boxGeometry args={[1.5, 0.1, 0.42]} />
                <meshStandardMaterial color="#a67c52" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.7, -0.18]} castShadow>
                <boxGeometry args={[1.5, 0.45, 0.08]} />
                <meshStandardMaterial color="#a67c52" roughness={0.85} />
            </mesh>
            <mesh position={[-0.55, 0.2, 0]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.4]} />
                <meshStandardMaterial color="#6b4f3a" />
            </mesh>
            <mesh position={[0.55, 0.2, 0]} castShadow>
                <boxGeometry args={[0.1, 0.4, 0.4]} />
                <meshStandardMaterial color="#6b4f3a" />
            </mesh>
        </group>
    );
}

function DirectionSign({ x, z, rot = 0, label, color = "#3d5a6c" }) {
    return (
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
            <mesh position={[0, 1.0, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.07, 2, 6]} />
                <meshStandardMaterial color="#6b4f3a" />
            </mesh>
            <mesh position={[0.55, 1.7, 0]} castShadow>
                <boxGeometry args={[1.3, 0.5, 0.08]} />
                <meshStandardMaterial color="#f5f0e6" roughness={0.7} />
            </mesh>
            <mesh position={[1.15, 1.7, 0]} rotation={[0, 0, Math.PI / 2]}>
                <coneGeometry args={[0.18, 0.28, 3]} />
                <meshStandardMaterial color="#f5f0e6" />
            </mesh>
            <Billboard position={[0.5, 1.7, 0.06]}>
                <Text fontSize={0.22} color={color} anchorX="center" anchorY="middle" fontWeight={800}>
                    {label}
                </Text>
            </Billboard>
        </group>
    );
}

function FenceSegment({ x, z, rot = 0, len = 2 }) {
    return (
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.55, 0]} castShadow>
                <boxGeometry args={[len, 0.08, 0.06]} />
                <meshStandardMaterial color="#8d6e63" />
            </mesh>
            <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[len, 0.08, 0.06]} />
                <meshStandardMaterial color="#8d6e63" />
            </mesh>
            {[-len / 2, 0, len / 2].map((px, i) => (
                <mesh key={i} position={[px, 0.4, 0]} castShadow>
                    <boxGeometry args={[0.08, 0.8, 0.08]} />
                    <meshStandardMaterial color="#6b4f3a" />
                </mesh>
            ))}
        </group>
    );
}

function KerbBlock({ x, z, rot = 0, red = true }) {
    return (
        <mesh position={[x, 0.12, z]} rotation={[0, rot, 0]} castShadow>
            <boxGeometry args={[0.7, 0.22, 0.28]} />
            <meshStandardMaterial color={red ? "#c62828" : "#f5f5f5"} roughness={0.75} />
        </mesh>
    );
}

function BillboardBoard({ x, z, rot = 0, label = "PANU" }) {
    return (
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
            <mesh position={[-1.4, 1.4, 0]} castShadow>
                <boxGeometry args={[0.12, 2.8, 0.12]} />
                <meshStandardMaterial color="#5c5348" />
            </mesh>
            <mesh position={[1.4, 1.4, 0]} castShadow>
                <boxGeometry args={[0.12, 2.8, 0.12]} />
                <meshStandardMaterial color="#5c5348" />
            </mesh>
            <mesh position={[0, 2.2, 0]} castShadow>
                <boxGeometry args={[3.0, 1.4, 0.12]} />
                <meshStandardMaterial color="#dceaf5" roughness={0.5} />
            </mesh>
            <Billboard position={[0, 2.2, 0.1]}>
                <Text fontSize={0.38} color="#3d5a6c" anchorX="center" fontWeight={800}>{label}</Text>
            </Billboard>
        </group>
    );
}

function ParkedCar({ x, z, rot = 0, color = "#5d7a8a" }) {
    return (
        <group position={[x, 0.32, z]} rotation={[0, rot, 0]}>
            <mesh castShadow position={[0, 0.2, 0]}>
                <boxGeometry args={[1.4, 0.4, 2.4]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh castShadow position={[0, 0.55, -0.1]}>
                <boxGeometry args={[1.2, 0.35, 1.2]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
            </mesh>
            <mesh position={[0, 0.55, 0.5]}>
                <boxGeometry args={[1.1, 0.28, 0.06]} />
                <meshStandardMaterial color="#90a4ae" transparent opacity={0.5} />
            </mesh>
            {[[0.72, -0.15, 0.75], [-0.72, -0.15, 0.75], [0.72, -0.15, -0.75], [-0.72, -0.15, -0.75]].map((p, i) => (
                <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.28, 0.28, 0.2, 10]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
            ))}
        </group>
    );
}

function TrashBin({ x, z }) {
    return (
        <mesh position={[x, 0.35, z]} castShadow>
            <cylinderGeometry args={[0.22, 0.25, 0.7, 8]} />
            <meshStandardMaterial color="#4a5a4a" roughness={0.8} metalness={0.2} />
        </mesh>
    );
}

function FireHydrant({ x, z }) {
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.18, 0.7, 8]} />
                <meshStandardMaterial color="#c62828" roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.75, 0]} castShadow>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial color="#c62828" />
            </mesh>
        </group>
    );
}

function Mailbox({ x, z, rot = 0 }) {
    return (
        <group position={[x, 0, z]} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.55, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.1, 6]} />
                <meshStandardMaterial color="#5c5348" />
            </mesh>
            <mesh position={[0, 1.15, 0]} castShadow>
                <boxGeometry args={[0.45, 0.35, 0.3]} />
                <meshStandardMaterial color="#3d5a6c" roughness={0.6} />
            </mesh>
        </group>
    );
}

function alongSamples(samples, every, sideOff) {
    const out = [];
    for (let i = 0; i < samples.length; i += every) {
        const p = samples[i];
        const next = samples[(i + 1) % samples.length];
        const tx = next.x - p.x, tz = next.z - p.z;
        const len = Math.hypot(tx, tz) || 1;
        const nx = -tz / len, nz = tx / len;
        const rot = Math.atan2(tx, tz);
        out.push({
            x: p.x + nx * sideOff,
            z: p.z + nz * sideOff,
            rot,
        });
    }
    return out;
}

export function AmbientDetails({ carRef, night = false }) {
    const lamps = useMemo(() => alongSamples(trackSamples, 28, 3.2).slice(0, 8), []);
    const raceLamps = useMemo(() => alongSamples(raceSamples, 28, RACE_WIDTH / 2 + 1.8).slice(0, 6), []);
    const kerbs = useMemo(() => alongSamples(raceSamples, 8, RACE_WIDTH / 2 + 0.2), []);
    const boards = useMemo(() => {
        return [0.12, 0.38, 0.64, 0.9].map((t) => {
            const i = Math.floor(t * raceSamples.length) % raceSamples.length;
            const p = raceSamples[i];
            const next = raceSamples[(i + 1) % raceSamples.length];
            const tx = next.x - p.x, tz = next.z - p.z;
            const len = Math.hypot(tx, tz) || 1;
            const nx = -tz / len, nz = tx / len;
            return {
                x: p.x + nx * 5.2,
                z: p.z + nz * 5.2,
                rot: Math.atan2(nx, nz),
            };
        });
    }, []);

    const labels = ["KMUTT", "GITHUB", "JENG", "PORT"];

    return (
        <group>
            {lamps.map((l, i) => (
                <StreetLamp key={`lamp${i}`} x={l.x} z={l.z} lit={night} />
            ))}
            {raceLamps.map((l, i) => (
                <StreetLamp key={`rlamp${i}`} x={l.x} z={l.z} lit={night} />
            ))}

            {kerbs.map((k, i) => (
                <KnockBody key={`k${i}`} carRef={carRef} position={[k.x, 0.12, k.z]} mass={1.6} hitRadius={1.1} restY={0.12}>
                    <mesh rotation={[0, k.rot, 0]} castShadow>
                        <boxGeometry args={[0.7, 0.22, 0.28]} />
                        <meshStandardMaterial color={i % 2 === 0 ? "#c62828" : "#f5f5f5"} roughness={0.75} />
                    </mesh>
                </KnockBody>
            ))}

            {boards.map((b, i) => (
                <KnockBody key={`bb${i}`} carRef={carRef} position={[b.x, 1.5, b.z]} mass={5} hitRadius={2.2} restY={1.5}>
                    <group rotation={[0, b.rot, 0]}>
                        <mesh position={[-1.4, 0, 0]} castShadow>
                            <boxGeometry args={[0.12, 2.8, 0.12]} />
                            <meshStandardMaterial color="#5c5348" />
                        </mesh>
                        <mesh position={[1.4, 0, 0]} castShadow>
                            <boxGeometry args={[0.12, 2.8, 0.12]} />
                            <meshStandardMaterial color="#5c5348" />
                        </mesh>
                        <mesh position={[0, 0.7, 0]} castShadow>
                            <boxGeometry args={[3.0, 1.4, 0.12]} />
                            <meshStandardMaterial color="#dceaf5" roughness={0.5} />
                        </mesh>
                        <Billboard position={[0, 0.7, 0.1]}>
                            <Text fontSize={0.38} color="#3d5a6c" anchorX="center" fontWeight={800}>{labels[i]}</Text>
                        </Billboard>
                    </group>
                </KnockBody>
            ))}

            <DirectionSign x={-4} z={-4} rot={0.4} label="ABOUT" color="#3d5a6c" />
            <DirectionSign x={5} z={-5} rot={-0.6} label="PROJECTS" color="#7a4a3d" />
            <DirectionSign x={2} z={6} rot={3.0} label="BLOG" color="#6e5630" />

            <KnockBody carRef={carRef} position={[3, 0.42, 3]} mass={2} hitRadius={1.5} restY={0.42}>
                <BenchMesh />
            </KnockBody>
            <KnockBody carRef={carRef} position={[-5, 0.42, 2]} mass={2} hitRadius={1.5} restY={0.42}>
                <BenchMesh />
            </KnockBody>
            <KnockBody carRef={carRef} position={[1, 0.42, -10]} mass={2} hitRadius={1.5} restY={0.42}>
                <BenchMesh />
            </KnockBody>

            <FenceSegment x={-8} z={11.2} len={6} />
            <FenceSegment x={-8} z={4.8} len={6} />
            <FenceSegment x={-11.2} z={8} rot={Math.PI / 2} len={6} />
            <FenceSegment x={-4.8} z={8} rot={Math.PI / 2} len={6} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.03, 4]} receiveShadow>
                <planeGeometry args={[7, 5]} />
                <meshStandardMaterial color="#5c5348" roughness={0.95} />
            </mesh>

            <KnockBody carRef={carRef} position={[8.5, 0.32, 3.5]} mass={7} hitRadius={2.0} restY={0.32}>
                <ParkedCarMesh color="#6d8b9c" />
            </KnockBody>
            <KnockBody carRef={carRef} position={[11.2, 0.32, 4.2]} mass={7} hitRadius={2.0} restY={0.32}>
                <ParkedCarMesh color="#a67c6d" />
            </KnockBody>

            <KnockBody carRef={carRef} position={[4.5, 0.35, 2.2]} mass={1.5} hitRadius={1.1} restY={0.35}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.22, 0.25, 0.7, 8]} />
                    <meshStandardMaterial color="#4a5a4a" roughness={0.8} metalness={0.2} />
                </mesh>
            </KnockBody>
            <KnockBody carRef={carRef} position={[-3.5, 0.35, 5]} mass={1.5} hitRadius={1.1} restY={0.35}>
                <mesh castShadow>
                    <cylinderGeometry args={[0.22, 0.25, 0.7, 8]} />
                    <meshStandardMaterial color="#4a5a4a" roughness={0.8} metalness={0.2} />
                </mesh>
            </KnockBody>
            <KnockBody carRef={carRef} position={[-2, 0.35, -2.5]} mass={2.5} hitRadius={1.1} restY={0.35}>
                <group>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.16, 0.18, 0.7, 8]} />
                        <meshStandardMaterial color="#c62828" roughness={0.55} />
                    </mesh>
                    <mesh position={[0, 0.4, 0]} castShadow>
                        <sphereGeometry args={[0.14, 8, 8]} />
                        <meshStandardMaterial color="#c62828" />
                    </mesh>
                </group>
            </KnockBody>
        </group>
    );
}

function BenchMesh() {
    return (
        <group>
            <mesh castShadow>
                <boxGeometry args={[1.5, 0.1, 0.42]} />
                <meshStandardMaterial color="#a67c52" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.28, -0.18]} castShadow>
                <boxGeometry args={[1.5, 0.45, 0.08]} />
                <meshStandardMaterial color="#a67c52" roughness={0.85} />
            </mesh>
        </group>
    );
}

function ParkedCarMesh({ color }) {
    return (
        <group>
            <mesh castShadow position={[0, 0.2, 0]}>
                <boxGeometry args={[1.4, 0.4, 2.4]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh castShadow position={[0, 0.55, -0.1]}>
                <boxGeometry args={[1.2, 0.35, 1.2]} />
                <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
            </mesh>
            {[[0.72, -0.15, 0.75], [-0.72, -0.15, 0.75], [0.72, -0.15, -0.75], [-0.72, -0.15, -0.75]].map((p, i) => (
                <mesh key={i} position={p} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.28, 0.28, 0.2, 10]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
            ))}
        </group>
    );
}
