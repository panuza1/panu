import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CameraFollow({ carRef }) {
    const { camera } = useThree();
    const camPos = useRef(new THREE.Vector3(0, 10, -18));
    const lookAt = useRef(new THREE.Vector3(0, 0, 0));

    useFrame(() => {
        if (!carRef?.current) return;
        const pos = carRef.current.position();
        const vel = carRef.current.velocity();
        if (!pos) return;

        // Camera offset in car's local space (behind and above)
        const heading = carRef.current.heading?.() ?? 0;
        const dist = 14;
        const height = 8;
        const tx = pos.x - Math.sin(heading) * dist;
        const tz = pos.z - Math.cos(heading) * dist;

        camPos.current.lerp(new THREE.Vector3(tx, pos.y + height, tz), 0.07);
        camera.position.copy(camPos.current);

        lookAt.current.lerp(new THREE.Vector3(pos.x, pos.y + 1, pos.z), 0.1);
        camera.lookAt(lookAt.current);
    });

    return null;
}
