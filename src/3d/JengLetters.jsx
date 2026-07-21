import { KnockBody } from "./KnockBody.jsx";

function LetterMesh({ letter, color }) {
    const u = 0.38;
    const blocks = {
        J: [
            [0, 2], [1, 2], [2, 2],
            [2, 1], [2, 0], [2, -1],
            [1, -2], [0, -2], [-1, -1],
        ],
        E: [
            [-1, 2], [0, 2], [1, 2],
            [-1, 1], [-1, 0], [0, 0], [1, 0],
            [-1, -1], [-1, -2], [0, -2], [1, -2],
        ],
        N: [
            [-1, 2], [-1, 1], [-1, 0], [-1, -1], [-1, -2],
            [0, 1], [1, 0],
            [2, 2], [2, 1], [2, 0], [2, -1], [2, -2],
        ],
        G: [
            [1, 2], [0, 2], [-1, 1], [-1, 0], [-1, -1],
            [0, -2], [1, -2], [2, -1], [2, 0], [1, 0],
        ],
    }[letter] || [];

    return (
        <group>
            {blocks.map(([bx, by], i) => (
                <mesh key={i} position={[bx * u, by * u, 0]} castShadow>
                    <boxGeometry args={[u * 0.92, u * 0.92, u * 0.92]} />
                    <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
                </mesh>
            ))}
        </group>
    );
}

const LETTERS = [
    { letter: "J", color: "#c62828", pos: [-4.5, 1.05, 0] },
    { letter: "E", color: "#1565c0", pos: [-1.5, 1.05, 0] },
    { letter: "N", color: "#2e7d32", pos: [1.5, 1.05, 0] },
    { letter: "G", color: "#ef6c00", pos: [4.5, 1.05, 0] },
];

export function JengLetters({ carRef }) {
    // World positions (not nested) so hit detection matches the car
    return (
        <group>
            {LETTERS.map((L) => (
                <KnockBody
                    key={L.letter}
                    carRef={carRef}
                    position={[L.pos[0], L.pos[1], 7.5 + L.pos[2]]}
                    mass={2.2}
                    hitRadius={2.2}
                    restY={1.05}
                >
                    <LetterMesh letter={L.letter} color={L.color} />
                </KnockBody>
            ))}
            <mesh position={[0, 0.08, 7.5]} receiveShadow>
                <boxGeometry args={[12, 0.16, 2.2]} />
                <meshStandardMaterial color="#7a6548" roughness={0.95} />
            </mesh>
        </group>
    );
}
