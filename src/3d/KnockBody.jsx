import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GRAVITY = 28;
const CAR_MASS = 8;
const _world = new THREE.Vector3();

/**
 * Knockable body — hit test uses WORLD position so nested groups work (e.g. JENG letters).
 * Tuned for moderate scatter (not too explosive).
 */
export function KnockBody({
    carRef,
    position,
    mass = 1,
    hitRadius = 1.6,
    restY = 0.4,
    children,
}) {
    const ref = useRef();
    const state = useRef({
        vel: new THREE.Vector3(),
        angVel: new THREE.Vector3(),
        sleeping: true,
        cooldown: 0,
    });

    useFrame((_, delta) => {
        const g = ref.current;
        if (!g) return;
        const dt = Math.min(delta, 0.05);
        const s = state.current;
        if (s.cooldown > 0) s.cooldown -= dt;

        // World-space hit test (fixes nested groups like JENG)
        g.getWorldPosition(_world);

        if (carRef?.current && s.cooldown <= 0) {
            const cp = carRef.current.position();
            const speed = carRef.current.velocity();
            if (cp) {
                const dx = _world.x - cp.x;
                const dz = _world.z - cp.z;
                const dist = Math.hypot(dx, dz);

                if (dist < hitRadius && Math.abs(speed) > 0.6) {
                    const dir = new THREE.Vector3(dx || 0.001, 0, dz).normalize();
                    const carSpeed = Math.abs(speed);
                    // Softer impulse
                    const impulse = (CAR_MASS * carSpeed) / Math.max(mass, 0.4);
                    const up = 0.6 + impulse * 0.08;
                    const horiz = Math.min(impulse * 0.28, 8);

                    s.vel.x += dir.x * horiz;
                    s.vel.y += up;
                    s.vel.z += dir.z * horiz;

                    s.angVel.x += (Math.random() - 0.5) * impulse * 0.12;
                    s.angVel.y += (Math.random() - 0.5) * impulse * 0.15;
                    s.angVel.z += (Math.random() - 0.5) * impulse * 0.12;
                    s.sleeping = false;
                    s.cooldown = 0.25;
                }
            }
        }

        if (s.sleeping) return;

        s.vel.y -= GRAVITY * dt;
        s.vel.x *= 1 - 0.55 * dt;
        s.vel.z *= 1 - 0.55 * dt;
        s.angVel.multiplyScalar(1 - 1.2 * dt);

        g.position.addScaledVector(s.vel, dt);
        g.rotation.x += s.angVel.x * dt;
        g.rotation.y += s.angVel.y * dt;
        g.rotation.z += s.angVel.z * dt;

        if (g.position.y < restY) {
            g.position.y = restY;
            if (s.vel.y < 0) {
                const bounce = Math.max(0.08, 0.28 - mass * 0.02);
                s.vel.y = -s.vel.y * bounce;
            }
            const friction = 1 - Math.min(0.95, (2.4 / Math.max(mass, 0.3)) * dt * 8);
            s.vel.x *= friction;
            s.vel.z *= friction;
            s.angVel.multiplyScalar(0.65);
            if (Math.abs(s.vel.y) < 0.6) s.vel.y = 0;
        }

        if (
            g.position.y <= restY + 0.02 &&
            s.vel.lengthSq() < 0.03 &&
            s.angVel.lengthSq() < 0.03
        ) {
            s.vel.set(0, 0, 0);
            s.angVel.set(0, 0, 0);
            s.sleeping = true;
        }

        g.position.x = THREE.MathUtils.clamp(g.position.x, -42, 42);
        g.position.z = THREE.MathUtils.clamp(g.position.z, -42, 42);
    });

    return (
        <group ref={ref} position={position}>
            {children}
        </group>
    );
}

export function KnockTireBarriers({ carRef, samples, width, every = 5 }) {
    const items = useMemo(() => {
        const out = [];
        for (let i = 0; i < samples.length; i += every) {
            const p = samples[i];
            const next = samples[(i + 1) % samples.length];
            const tx = next.x - p.x, tz = next.z - p.z;
            const len = Math.hypot(tx, tz) || 1;
            const nx = -tz / len, nz = tx / len;
            const off = width / 2 + 0.55;
            out.push([p.x + nx * off, p.z + nz * off]);
            if (i % (every * 2) === 0) out.push([p.x - nx * off, p.z - nz * off]);
        }
        return out;
    }, [samples, width, every]);

    return (
        <>
            {items.map(([x, z], i) => (
                <KnockBody key={i} carRef={carRef} position={[x, 0.35, z]} mass={1.6} hitRadius={1.35} restY={0.35}>
                    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <torusGeometry args={[0.3, 0.11, 7, 12]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                        <torusGeometry args={[0.3, 0.11, 7, 12]} />
                        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
                    </mesh>
                </KnockBody>
            ))}
        </>
    );
}
