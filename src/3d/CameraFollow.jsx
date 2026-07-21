import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Bruno-style isometric follow:
 // camera stays on a fixed diagonal angle (doesn't spin with the car),
 // high above, looking down ~45°, smoothly tracking the car.
const OFFSET = new THREE.Vector3(16, 18, 16);
const LOOK_AHEAD = new THREE.Vector3(0, 0.3, 0);

export function CameraFollow({ carRef }) {
    const { camera } = useThree();
    const camPos = useRef(new THREE.Vector3(16, 18, 16));
    const lookAt = useRef(new THREE.Vector3(0, 0, 0));
    const ready = useRef(false);

    useFrame(() => {
        if (!carRef?.current) return;
        const pos = carRef.current.position();
        if (!pos) return;

        const target = new THREE.Vector3(pos.x, pos.y, pos.z).add(LOOK_AHEAD);
        const desired = target.clone().add(OFFSET);

        if (!ready.current) {
            camPos.current.copy(desired);
            lookAt.current.copy(target);
            ready.current = true;
        } else {
            camPos.current.lerp(desired, 0.06);
            lookAt.current.lerp(target, 0.1);
        }

        camera.position.copy(camPos.current);
        camera.lookAt(lookAt.current);
    });

    return null;
}
