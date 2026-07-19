import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Voxel building block
function VoxelBuilding({ position, floors, width, depth, wallColor, roofColor, label, labelColor }) {
    const h = floors * 1.2;
    return (
        <group position={position}>
            {/* Base */}
            <mesh castShadow receiveShadow position={[0, h / 2, 0]}>
                <boxGeometry args={[width, h, depth]} />
                <meshLambertMaterial color={wallColor} />
            </mesh>
            {/* Roof */}
            <mesh castShadow position={[0, h + 0.3, 0]}>
                <boxGeometry args={[width + 0.4, 0.6, depth + 0.4]} />
                <meshLambertMaterial color={roofColor} />
            </mesh>
            {/* Windows */}
            {Array.from({ length: floors }).map((_, row) =>
                Array.from({ length: Math.max(1, Math.floor(width / 1.8)) }).map((_, col) => {
                    const cols = Math.max(1, Math.floor(width / 1.8));
                    const wx = -width / 2 + (width / (cols + 1)) * (col + 1);
                    const wy = 0.6 + row * 1.2;
                    return (
                        <mesh key={`${row}-${col}`} position={[wx, wy, depth / 2 + 0.02]}>
                            <boxGeometry args={[0.5, 0.6, 0.08]} />
                            <meshLambertMaterial
                                color={Math.random() > 0.3 ? "#ffe169" : "#a2d2ff"}
                                emissive={Math.random() > 0.3 ? "#ffe169" : "#a2d2ff"}
                                emissiveIntensity={0.4}
                            />
                        </mesh>
                    );
                })
            )}
            {/* Sign */}
            <mesh position={[0, h + 1.0, depth / 2 + 0.05]}>
                <boxGeometry args={[width - 0.4, 0.8, 0.12]} />
                <meshLambertMaterial color={labelColor} />
            </mesh>
            <Text
                position={[0, h + 1.0, depth / 2 + 0.15]}
                fontSize={0.38}
                color="white"
                anchorX="center"
                anchorY="middle"
                font={undefined}
            >
                {label}
            </Text>
            {/* Entrance arrow */}
            <Text
                position={[0, 0.6, depth / 2 + 0.3]}
                fontSize={0.5}
                color={labelColor}
                anchorX="center"
                anchorY="middle"
            >
                ▲
            </Text>
        </group>
    );
}

// Spinning coin / collectible
function SpinCoin({ position, color }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.getElapsedTime() * 2;
        ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    });
    return (
        <group ref={ref} position={position}>
            <mesh castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.12, 8]} />
                <meshLambertMaterial color={color} />
            </mesh>
            <pointLight color={color} intensity={4} distance={8} />
        </group>
    );
}

// Sign post
function SignPost({ position, text, color }) {
    return (
        <group position={position}>
            <mesh position={[0, 1.5, 0]} castShadow>
                <boxGeometry args={[0.18, 3, 0.18]} />
                <meshLambertMaterial color="#7f5539" />
            </mesh>
            <mesh position={[0, 3.1, 0]} castShadow>
                <boxGeometry args={[2.8, 0.8, 0.2]} />
                <meshLambertMaterial color={color} />
            </mesh>
            <Text position={[0, 3.1, 0.12]} fontSize={0.32} color="white" anchorX="center" anchorY="middle">
                {text}
            </Text>
        </group>
    );
}

export const AREAS = [
    { id: "about",    pos: [-28,  0, -22], label: "About Me",  wallColor: "#4361ee", roofColor: "#3a0ca3", labelColor: "#4cc9f0", coinColor: "#4cc9f0" },
    { id: "projects", pos: [ 28,  0, -22], label: "Projects",  wallColor: "#f72585", roofColor: "#b5179e", labelColor: "#ff6b6b", coinColor: "#ff6b6b" },
    { id: "blog",     pos: [  0,  0,  32], label: "Blog",      wallColor: "#f77f00", roofColor: "#d62828", labelColor: "#ffe169", coinColor: "#ffe169" },
];

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
            if (Math.sqrt(dx * dx + dz * dz) < 9) { found = a.id; break; }
        }
        if (found !== prevArea.current) { prevArea.current = found; onEnterArea(found); }
    });

    return (
        <>
            {/* Spawn welcome sign */}
            <SignPost position={[-5, 0, 6]} text="PANUPONG.CHAI ★" color="#7209b7" />

            {AREAS.map((a) => (
                <group key={a.id}>
                    <VoxelBuilding
                        position={[a.pos[0], 0, a.pos[2]]}
                        floors={4 + (a.id === "projects" ? 2 : 0)}
                        width={8}
                        depth={5}
                        wallColor={a.wallColor}
                        roofColor={a.roofColor}
                        label={a.label}
                        labelColor={a.labelColor}
                    />
                    <SpinCoin
                        position={[a.pos[0], 1.2, a.pos[2] + 4]}
                        color={a.coinColor}
                    />
                </group>
            ))}

            {/* Decorative pixel lamp posts */}
            {[[-10, 0, -10], [10, 0, -10], [-10, 0, 10], [10, 0, 10],
              [-20, 0, 0], [20, 0, 0], [0, 0, -20], [0, 0, 20]].map(([x, y, z], i) => (
                <group key={i} position={[x, 0, z]}>
                    <mesh position={[0, 1.5, 0]} castShadow>
                        <boxGeometry args={[0.2, 3, 0.2]} />
                        <meshLambertMaterial color="#5c4033" />
                    </mesh>
                    <mesh position={[0, 3.1, 0]} castShadow>
                        <boxGeometry args={[0.5, 0.4, 0.5]} />
                        <meshLambertMaterial color="#ffe169" />
                    </mesh>
                    <pointLight position={[x, 3.2, z]} intensity={6} distance={10} color="#ffe4a0" />
                </group>
            ))}
        </>
    );
}
