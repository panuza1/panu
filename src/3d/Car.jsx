import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Voxel block helper
function Box({ pos, size, color }) {
    return (
        <mesh position={pos} castShadow>
            <boxGeometry args={size} />
            <meshLambertMaterial color={color} />
        </mesh>
    );
}

// Wheel voxel - just stacked boxes
function PixelWheel({ position, isFront, steerRef, velRef }) {
    const ref = useRef();
    useFrame((_, dt) => {
        if (!ref.current) return;
        ref.current.rotation.x -= velRef.current * dt * 2;
        if (isFront && steerRef) {
            ref.current.rotation.y = THREE.MathUtils.lerp(
                ref.current.rotation.y, steerRef.current * 0.5, 0.2
            );
        }
    });
    return (
        <group ref={ref} position={position}>
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.22, 8]} />
                <meshLambertMaterial color="#222034" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.24, 8]} />
                <meshLambertMaterial color="#9badb7" />
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
        return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const dt = Math.min(delta, 0.05);
        const k = keys.current;

        const fwd = k.ArrowUp || k.KeyW;
        const bwd = k.ArrowDown || k.KeyS;
        const lft = k.ArrowLeft || k.KeyA;
        const rgt = k.ArrowRight || k.KeyD;
        const brk = k.Space;

        // Accelerate / decelerate
        if (fwd)       vel.current = Math.min(vel.current + 14 * dt, 12);
        else if (bwd)  vel.current = Math.max(vel.current - 10 * dt, -5);
        else           vel.current *= brk ? 0.82 : (1 - 4 * dt);

        if (Math.abs(vel.current) < 0.05) vel.current = 0;

        // Steer
        const speed01 = Math.abs(vel.current) / 12;
        if (lft)      steer.current = Math.min(steer.current + 2.5 * dt, 0.7);
        else if (rgt) steer.current = Math.max(steer.current - 2.5 * dt, -0.7);
        else          steer.current *= 0.80;

        // Turn heading based on speed
        if (Math.abs(vel.current) > 0.1) {
            const dir = vel.current > 0 ? 1 : -1;
            heading.current += steer.current * speed01 * dir * 2.0 * dt;
        }

        // Move
        groupRef.current.position.x += Math.sin(heading.current) * vel.current * dt;
        groupRef.current.position.z += Math.cos(heading.current) * vel.current * dt;
        groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -85, 85);
        groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -85, 85);
        groupRef.current.position.y = 0.3;
        groupRef.current.rotation.y = heading.current;
    });

    return (
        <group ref={groupRef} position={[0, 0.3, 0]}>
            {/* Body */}
            <Box pos={[0, 0.28, 0]}   size={[1.6, 0.56, 2.8]} color="#e63946" />
            {/* Cabin */}
            <Box pos={[0, 0.78, -0.1]} size={[1.2, 0.5, 1.6]} color="#c1121f" />
            {/* Windshield front */}
            <Box pos={[0, 0.78, 0.76]} size={[1.18, 0.48, 0.06]} color="#a8dadc" />
            {/* Windshield back */}
            <Box pos={[0, 0.78, -0.86]} size={[1.18, 0.46, 0.06]} color="#a8dadc" />
            {/* Headlights */}
            <Box pos={[ 0.52, 0.18, 1.42]} size={[0.3, 0.18, 0.06]} color="#fff9c4" />
            <Box pos={[-0.52, 0.18, 1.42]} size={[0.3, 0.18, 0.06]} color="#fff9c4" />
            {/* Taillights */}
            <Box pos={[ 0.52, 0.18, -1.42]} size={[0.3, 0.18, 0.06]} color="#ff1744" />
            <Box pos={[-0.52, 0.18, -1.42]} size={[0.3, 0.18, 0.06]} color="#ff1744" />
            {/* Wheels */}
            <PixelWheel position={[ 0.88, -0.12,  1.0]} isFront steerRef={steer} velRef={vel} />
            <PixelWheel position={[-0.88, -0.12,  1.0]} isFront steerRef={steer} velRef={vel} />
            <PixelWheel position={[ 0.88, -0.12, -1.0]} isFront={false} steerRef={null} velRef={vel} />
            <PixelWheel position={[-0.88, -0.12, -1.0]} isFront={false} steerRef={null} velRef={vel} />
        </group>
    );
});
