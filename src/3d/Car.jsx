import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { input } from "./input.js";

const BODY = "#d32f2f";
const BODY_DARK = "#b71c1c";
const GLASS = "#90a4ae";

function Wheel({ position, isFront, steerRef, velRef }) {
    const ref = useRef();
    useFrame((_, dt) => {
        if (!ref.current) return;
        ref.current.rotation.x -= velRef.current * dt * 2.2;
        if (isFront && steerRef) {
            ref.current.rotation.y = THREE.MathUtils.lerp(
                ref.current.rotation.y, steerRef.current * 0.45, 0.18
            );
        }
    });
    return (
        <group ref={ref} position={position}>
            {/* Tire */}
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.34, 0.34, 0.26, 18]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            {/* Rim */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.28, 14]} />
                <meshStandardMaterial color="#cfd8dc" metalness={0.55} roughness={0.3} />
            </mesh>
            {/* Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.07, 0.07, 0.3, 10]} />
                <meshStandardMaterial color="#78909c" metalness={0.6} roughness={0.25} />
            </mesh>
        </group>
    );
}

export const Car = forwardRef(function Car(_, ref) {
    const groupRef = useRef();
    const vel = useRef(0);
    const heading = useRef(0);
    const steer = useRef(0);
    const keys = useRef({});

    useImperativeHandle(ref, () => ({
        position: () => groupRef.current?.position ?? new THREE.Vector3(),
        velocity: () => vel.current,
        heading: () => heading.current,
    }));

    useEffect(() => {
        const dn = (e) => { keys.current[e.code] = true; };
        const up = (e) => { keys.current[e.code] = false; };
        window.addEventListener("keydown", dn);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", dn);
            window.removeEventListener("keyup", up);
        };
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const dt = Math.min(delta, 0.05);
        const k = keys.current;

        const fwd = k.ArrowUp || k.KeyW || input.forward;
        const bwd = k.ArrowDown || k.KeyS || input.backward;
        const lft = k.ArrowLeft || k.KeyA || input.left;
        const rgt = k.ArrowRight || k.KeyD || input.right;
        const brk = k.Space || input.brake;

        if (fwd) vel.current = Math.min(vel.current + 14 * dt, 12);
        else if (bwd) vel.current = Math.max(vel.current - 10 * dt, -5);
        else vel.current *= brk ? 0.82 : (1 - 4 * dt);

        if (Math.abs(vel.current) < 0.05) vel.current = 0;

        const speed01 = Math.abs(vel.current) / 12;
        if (lft) steer.current = Math.min(steer.current + 2.5 * dt, 0.7);
        else if (rgt) steer.current = Math.max(steer.current - 2.5 * dt, -0.7);
        else steer.current *= 0.8;

        if (Math.abs(vel.current) > 0.1) {
            const dir = vel.current > 0 ? 1 : -1;
            heading.current += steer.current * speed01 * dir * 2.0 * dt;
        }

        groupRef.current.position.x += Math.sin(heading.current) * vel.current * dt;
        groupRef.current.position.z += Math.cos(heading.current) * vel.current * dt;
        groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -42, 42);
        groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -42, 42);
        groupRef.current.position.y = 0.34;
        groupRef.current.rotation.y = heading.current;
    });

    return (
        <group ref={groupRef} position={[0, 0.34, 0]}>
            {/* Lower chassis / skirt */}
            <mesh castShadow position={[0, 0.08, 0]}>
                <boxGeometry args={[1.7, 0.18, 2.85]} />
                <meshStandardMaterial color="#2c2c2c" roughness={0.7} />
            </mesh>

            {/* Main body */}
            <mesh castShadow position={[0, 0.32, 0]}>
                <boxGeometry args={[1.62, 0.42, 2.75]} />
                <meshStandardMaterial color={BODY} roughness={0.28} metalness={0.25} />
            </mesh>

            {/* Hood slope */}
            <mesh castShadow position={[0, 0.42, 0.72]} rotation={[0.18, 0, 0]}>
                <boxGeometry args={[1.5, 0.18, 0.9]} />
                <meshStandardMaterial color={BODY} roughness={0.28} metalness={0.25} />
            </mesh>

            {/* Front bumper */}
            <mesh castShadow position={[0, 0.18, 1.42]}>
                <boxGeometry args={[1.55, 0.22, 0.22]} />
                <meshStandardMaterial color="#333" roughness={0.6} />
            </mesh>

            {/* Cabin */}
            <mesh castShadow position={[0, 0.72, -0.12]}>
                <boxGeometry args={[1.28, 0.46, 1.35]} />
                <meshStandardMaterial color={BODY_DARK} roughness={0.32} metalness={0.2} />
            </mesh>

            {/* Roof */}
            <mesh castShadow position={[0, 0.98, -0.18]}>
                <boxGeometry args={[1.18, 0.12, 1.05]} />
                <meshStandardMaterial color={BODY_DARK} roughness={0.3} metalness={0.2} />
            </mesh>

            {/* Windshield */}
            <mesh position={[0, 0.74, 0.55]} rotation={[-0.35, 0, 0]}>
                <boxGeometry args={[1.15, 0.38, 0.06]} />
                <meshStandardMaterial color={GLASS} transparent opacity={0.55} roughness={0.05} metalness={0.3} />
            </mesh>
            {/* Rear window */}
            <mesh position={[0, 0.74, -0.78]} rotation={[0.25, 0, 0]}>
                <boxGeometry args={[1.1, 0.34, 0.06]} />
                <meshStandardMaterial color={GLASS} transparent opacity={0.55} roughness={0.05} metalness={0.3} />
            </mesh>
            {/* Side windows */}
            <mesh position={[0.65, 0.74, -0.1]}>
                <boxGeometry args={[0.05, 0.32, 1.0]} />
                <meshStandardMaterial color={GLASS} transparent opacity={0.5} roughness={0.05} metalness={0.25} />
            </mesh>
            <mesh position={[-0.65, 0.74, -0.1]}>
                <boxGeometry args={[0.05, 0.32, 1.0]} />
                <meshStandardMaterial color={GLASS} transparent opacity={0.5} roughness={0.05} metalness={0.25} />
            </mesh>

            {/* Side mirrors */}
            <mesh castShadow position={[0.78, 0.62, 0.35]}>
                <boxGeometry args={[0.18, 0.1, 0.14]} />
                <meshStandardMaterial color={BODY_DARK} roughness={0.35} metalness={0.2} />
            </mesh>
            <mesh castShadow position={[-0.78, 0.62, 0.35]}>
                <boxGeometry args={[0.18, 0.1, 0.14]} />
                <meshStandardMaterial color={BODY_DARK} roughness={0.35} metalness={0.2} />
            </mesh>

            {/* Headlights */}
            <mesh position={[0.48, 0.28, 1.4]}>
                <boxGeometry args={[0.34, 0.16, 0.08]} />
                <meshStandardMaterial color="#fff8e1" emissive="#fff8e1" emissiveIntensity={1.1} />
            </mesh>
            <mesh position={[-0.48, 0.28, 1.4]}>
                <boxGeometry args={[0.34, 0.16, 0.08]} />
                <meshStandardMaterial color="#fff8e1" emissive="#fff8e1" emissiveIntensity={1.1} />
            </mesh>

            {/* Grill */}
            <mesh position={[0, 0.24, 1.4]}>
                <boxGeometry args={[0.45, 0.12, 0.05]} />
                <meshStandardMaterial color="#212121" roughness={0.5} />
            </mesh>

            {/* Taillights */}
            <mesh position={[0.5, 0.3, -1.4]}>
                <boxGeometry args={[0.32, 0.14, 0.08]} />
                <meshStandardMaterial color="#ff5252" emissive="#ff1744" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[-0.5, 0.3, -1.4]}>
                <boxGeometry args={[0.32, 0.14, 0.08]} />
                <meshStandardMaterial color="#ff5252" emissive="#ff1744" emissiveIntensity={0.7} />
            </mesh>

            {/* Rear bumper */}
            <mesh castShadow position={[0, 0.16, -1.42]}>
                <boxGeometry args={[1.5, 0.18, 0.18]} />
                <meshStandardMaterial color="#333" roughness={0.6} />
            </mesh>

            {/* Small rear spoiler */}
            <mesh castShadow position={[0, 0.92, -0.82]}>
                <boxGeometry args={[1.05, 0.06, 0.22]} />
                <meshStandardMaterial color={BODY_DARK} roughness={0.3} metalness={0.2} />
            </mesh>

            <Wheel position={[0.88, -0.08, 0.95]} isFront steerRef={steer} velRef={vel} />
            <Wheel position={[-0.88, -0.08, 0.95]} isFront steerRef={steer} velRef={vel} />
            <Wheel position={[0.88, -0.08, -0.95]} isFront={false} steerRef={null} velRef={vel} />
            <Wheel position={[-0.88, -0.08, -0.95]} isFront={false} steerRef={null} velRef={vel} />
        </group>
    );
});
