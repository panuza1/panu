import * as THREE from "three";

// Voxel tree
function PixelTree({ x, z }) {
    const h = 1.2 + Math.abs(Math.sin(x * 3.7 + z)) * 1.2;
    const leafColor = ["#38b000", "#70e000", "#2d6a4f", "#52b788"][Math.floor(Math.abs(x + z * 2)) % 4];
    return (
        <group position={[x, 0, z]}>
            <mesh position={[0, h / 2, 0]} castShadow>
                <boxGeometry args={[0.4, h, 0.4]} />
                <meshLambertMaterial color="#7f5539" />
            </mesh>
            <mesh position={[0, h + 0.5, 0]} castShadow>
                <boxGeometry args={[1.4, 1.0, 1.4]} />
                <meshLambertMaterial color={leafColor} />
            </mesh>
            <mesh position={[0, h + 1.2, 0]} castShadow>
                <boxGeometry args={[1.0, 0.8, 1.0]} />
                <meshLambertMaterial color={leafColor} />
            </mesh>
            <mesh position={[0, h + 1.8, 0]} castShadow>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshLambertMaterial color={leafColor} />
            </mesh>
        </group>
    );
}

// Small decorative flowers/bushes
function PixelBush({ x, z }) {
    const color = ["#f72585", "#7209b7", "#3a86ff", "#ffbe0b"][Math.floor(Math.abs(x * z)) % 4];
    return (
        <mesh position={[x, 0.25, z]} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshLambertMaterial color={color} />
        </mesh>
    );
}

// Road tile
function RoadStrip({ x1, z1, x2, z2, w = 5 }) {
    const mid = [(x1 + x2) / 2, 0.02, (z1 + z2) / 2];
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    return (
        <mesh position={mid} rotation={[-Math.PI / 2, 0, -angle]} receiveShadow>
            <planeGeometry args={[w, len]} />
            <meshLambertMaterial color="#3d405b" />
        </mesh>
    );
}

// Dashed center line
function CenterLine({ x1, z1, x2, z2 }) {
    const mid = [(x1 + x2) / 2, 0.03, (z1 + z2) / 2];
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    const count = Math.floor(len / 4);
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                const t = (i + 0.5) / count;
                const px = x1 + dx * t;
                const pz = z1 + dz * t;
                return (
                    <mesh key={i} position={[px, 0.03, pz]} rotation={[-Math.PI / 2, 0, -angle]} receiveShadow>
                        <planeGeometry args={[0.2, 2]} />
                        <meshLambertMaterial color="#f2cc8f" />
                    </mesh>
                );
            })}
        </>
    );
}

const TREES = [
    [-30,-10],[-32,-12],[-28, 12],[-35, 5],[-38,-18],
    [ 30,-28],[ 32, 10],[ 28, 28],[ 35, -8],[ 38, 20],
    [-20, 40],[ 20, 38],[-15,-42],[ 18,-40],[ 22,-45],
    [-45, 20],[ 45, 22],[-42,-20],[ 44,-18],[ 48,  0],
    [-60,  0],[ 60,  5],[  0, 60],[  0,-60],
    [-55, 40],[ 55,-38],[-50,-45],[ 52, 42],
    [-70, 10],[ 70,-10],[-10, 70],[ 10,-70],
    [-15,-15],[ 15,-15],[-15, 15],[ 15, 15],
    [-8, 35],[ 8, 35],[-8,-35],[ 8,-35],
];

const BUSHES = [
    [-6, 10],[ 6, 10],[-6,-10],[ 6,-10],
    [ 12, 5],[-12, 5],[ 12,-5],[-12,-5],
    [-18, 22],[ 18, 22],[-22, 18],[ 22,-18],
];

export function Ground() {
    return (
        <>
            {/* Base ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[200, 200]} />
                <meshLambertMaterial color="#588157" />
            </mesh>

            {/* Pixel grid pattern — thin strips */}
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={`gx-${i}`}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[-90 + i * 10, 0.005, 0]}
                    receiveShadow
                >
                    <planeGeometry args={[0.12, 180]} />
                    <meshLambertMaterial color="#3a7d44" transparent opacity={0.4} />
                </mesh>
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={`gz-${i}`}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, 0.005, -90 + i * 10]}
                    receiveShadow
                >
                    <planeGeometry args={[180, 0.12]} />
                    <meshLambertMaterial color="#3a7d44" transparent opacity={0.4} />
                </mesh>
            ))}

            {/* Roads */}
            <RoadStrip x1={-90} z1={0}  x2={90}  z2={0} w={6} />
            <RoadStrip x1={0}  z1={-90} x2={0}   z2={90} w={6} />
            <RoadStrip x1={-38} z1={-38} x2={38} z2={38} w={4} />
            <RoadStrip x1={38}  z1={-38} x2={-38} z2={38} w={4} />

            {/* Center lines */}
            <CenterLine x1={-90} z1={0}  x2={90}  z2={0} />
            <CenterLine x1={0}  z1={-90} x2={0}   z2={90} />

            {/* Trees */}
            {TREES.map(([x, z], i) => <PixelTree key={i} x={x} z={z} />)}

            {/* Bushes */}
            {BUSHES.map(([x, z], i) => <PixelBush key={i} x={x} z={z} />)}
        </>
    );
}
