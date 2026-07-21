import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import { isOnRoad } from "./track.js";

function FloatingLabel({ position, text, color, fontSize = 0.7 }) {
    const w = text.length * fontSize * 0.52 + 1.1;
    return (
        <Billboard position={position}>
            <mesh>
                <planeGeometry args={[w, fontSize * 1.7]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={fontSize} color={color} anchorX="center" anchorY="middle" fontWeight={700}>
                {text}
            </Text>
        </Billboard>
    );
}

// Cute low-poly house with pitched roof, door, porch
function CuteHouse({ position, wallColor, roofColor, trimColor, label, labelColor, accent }) {
    return (
        <group position={position}>
            {/* Base / porch platform */}
            <mesh castShadow receiveShadow position={[0, 0.12, 0.15]}>
                <boxGeometry args={[5.4, 0.24, 4.4]} />
                <meshStandardMaterial color="#7a6548" roughness={0.95} />
            </mesh>

            {/* Main walls */}
            <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
                <boxGeometry args={[4.6, 2.6, 3.4]} />
                <meshStandardMaterial color={wallColor} roughness={0.72} />
            </mesh>

            {/* Pitched roof left */}
            <mesh castShadow position={[-1.15, 3.35, 0]} rotation={[0, 0, 0.45]}>
                <boxGeometry args={[2.8, 0.22, 3.9]} />
                <meshStandardMaterial color={roofColor} roughness={0.65} />
            </mesh>
            {/* Pitched roof right */}
            <mesh castShadow position={[1.15, 3.35, 0]} rotation={[0, 0, -0.45]}>
                <boxGeometry args={[2.8, 0.22, 3.9]} />
                <meshStandardMaterial color={roofColor} roughness={0.65} />
            </mesh>
            {/* Roof ridge fill */}
            <mesh castShadow position={[0, 3.85, 0]}>
                <boxGeometry args={[0.35, 0.25, 3.9]} />
                <meshStandardMaterial color={trimColor} roughness={0.6} />
            </mesh>

            {/* Chimney */}
            <mesh castShadow position={[1.4, 4.2, -0.6]}>
                <boxGeometry args={[0.55, 1.1, 0.55]} />
                <meshStandardMaterial color="#9e8b7a" roughness={0.85} />
            </mesh>
            <mesh castShadow position={[1.4, 4.8, -0.6]}>
                <boxGeometry args={[0.7, 0.18, 0.7]} />
                <meshStandardMaterial color="#7d6b5c" roughness={0.8} />
            </mesh>

            {/* Front door */}
            <mesh position={[0, 0.95, 1.72]}>
                <boxGeometry args={[0.85, 1.5, 0.08]} />
                <meshStandardMaterial color={accent} roughness={0.55} />
            </mesh>
            <mesh position={[0.28, 0.95, 1.78]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Door awning */}
            <mesh castShadow position={[0, 1.85, 2.05]} rotation={[0.35, 0, 0]}>
                <boxGeometry args={[1.5, 0.1, 0.7]} />
                <meshStandardMaterial color={roofColor} roughness={0.65} />
            </mesh>

            {/* Windows front */}
            {[-1.4, 1.4].map((wx) => (
                <group key={wx}>
                    <mesh position={[wx, 1.7, 1.72]}>
                        <boxGeometry args={[0.85, 0.85, 0.08]} />
                        <meshStandardMaterial color="#d9eef7" emissive="#d9eef7" emissiveIntensity={0.2} roughness={0.2} />
                    </mesh>
                    <mesh position={[wx, 1.7, 1.77]}>
                        <boxGeometry args={[0.95, 0.08, 0.05]} />
                        <meshStandardMaterial color={trimColor} />
                    </mesh>
                    <mesh position={[wx, 1.7, 1.77]}>
                        <boxGeometry args={[0.08, 0.95, 0.05]} />
                        <meshStandardMaterial color={trimColor} />
                    </mesh>
                </group>
            ))}

            {/* Side windows */}
            <mesh position={[2.32, 1.7, 0]}>
                <boxGeometry args={[0.08, 0.75, 0.75]} />
                <meshStandardMaterial color="#d9eef7" emissive="#d9eef7" emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[-2.32, 1.7, 0]}>
                <boxGeometry args={[0.08, 0.75, 0.75]} />
                <meshStandardMaterial color="#d9eef7" emissive="#d9eef7" emissiveIntensity={0.15} />
            </mesh>

            {/* Little garden planter */}
            <mesh castShadow position={[-2.0, 0.35, 2.0]}>
                <boxGeometry args={[0.9, 0.35, 0.5]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.85} />
            </mesh>
            <mesh position={[-2.0, 0.65, 2.0]}>
                <sphereGeometry args={[0.28, 7, 7]} />
                <meshStandardMaterial color="#7faa72" roughness={0.9} />
            </mesh>

            <FloatingLabel position={[0, 5.5, 0]} text={label} color={labelColor} fontSize={0.72} />
        </group>
    );
}

function Marker({ position, color }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.15;
        ref.current.rotation.y = clock.getElapsedTime() * 1.1;
    });
    return (
        <group ref={ref} position={position}>
            <mesh castShadow>
                <octahedronGeometry args={[0.32, 0]} />
                <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
            </mesh>
        </group>
    );
}

export const AREAS = [
    {
        id: "about", pos: [-14, 0, -12], label: "About Me",
        wallColor: "#9db8c9", roofColor: "#6d8ea0", trimColor: "#5a7380",
        labelColor: "#3d5a6c", accent: "#5d7a8a", markerOffset: [3.2, -3.2],
    },
    {
        id: "projects", pos: [14, 0, -12], label: "Projects",
        wallColor: "#d4a494", roofColor: "#b57a68", trimColor: "#966455",
        labelColor: "#7a4a3d", accent: "#a66a58", markerOffset: [-3.2, -3.2],
    },
    {
        id: "blog", pos: [0, 0, 16], label: "Blog",
        wallColor: "#d8c29a", roofColor: "#b8945f", trimColor: "#9a7a4a",
        labelColor: "#6e5630", accent: "#8b6b3d", markerOffset: [0, -3.8],
    },
];

const LAMP_SPOTS = [
    [-6, -6], [6, -6], [-6, 6], [6, 6],
].filter(([x, z]) => !isOnRoad(x, z, 3.2));

export function Buildings({ carRef, onEnterArea }) {
    const prevArea = useRef(null);

    useFrame(() => {
        if (!carRef?.current) return;
        const pos = carRef.current.position();
        if (!pos) return;
        let found = null;
        for (const a of AREAS) {
            const dx = pos.x - a.pos[0];
            const dz = pos.z - a.pos[2];
            if (Math.sqrt(dx * dx + dz * dz) < 7) { found = a.id; break; }
        }
        if (found !== prevArea.current) {
            prevArea.current = found;
            onEnterArea(found);
        }
    });

    return (
        <>
            <FloatingLabel position={[-3.5, 3.6, 4]} text="Panupong.Chai" color="#5a4a3a" fontSize={0.6} />
            <mesh position={[-3.5, 1.2, 4]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 2.4, 8]} />
                <meshStandardMaterial color="#8d6e63" roughness={0.9} />
            </mesh>

            {AREAS.map((a) => (
                <group key={a.id}>
                    <CuteHouse
                        position={[a.pos[0], 0, a.pos[2]]}
                        wallColor={a.wallColor}
                        roofColor={a.roofColor}
                        trimColor={a.trimColor}
                        accent={a.accent}
                        label={a.label}
                        labelColor={a.labelColor}
                    />
                    <Marker
                        position={[a.pos[0] + a.markerOffset[0], 1.0, a.pos[2] + a.markerOffset[1]]}
                        color={a.roofColor}
                    />
                </group>
            ))}

            {LAMP_SPOTS.map(([x, z], i) => (
                <group key={i} position={[x, 0, z]}>
                    <mesh position={[0, 1.2, 0]} castShadow>
                        <cylinderGeometry args={[0.07, 0.09, 2.4, 6]} />
                        <meshStandardMaterial color="#8d6e63" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 2.5, 0]} castShadow>
                        <sphereGeometry args={[0.18, 8, 8]} />
                        <meshStandardMaterial color="#fff3c4" emissive="#fff3c4" emissiveIntensity={0.3} />
                    </mesh>
                </group>
            ))}
        </>
    );
}
