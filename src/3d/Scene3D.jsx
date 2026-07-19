import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { Ground } from "./Ground.jsx";
import { Car } from "./Car.jsx";
import { CameraFollow } from "./CameraFollow.jsx";
import { Buildings } from "./Buildings.jsx";
import { AboutPanel, ProjectsPanel, BlogPanel } from "./InfoPanel.jsx";
import { ControlsHint, Speedometer, AreaPrompt, TopBar } from "./HUD.jsx";

export function Scene3D() {
    const carRef = useRef(null);
    const [currentArea, setCurrentArea] = useState(null);
    const [openPanel, setOpenPanel] = useState(null);
    const [speed, setSpeed] = useState(0);

    useEffect(() => {
        let raf;
        const tick = () => {
            if (carRef.current?.velocity) setSpeed(carRef.current.velocity());
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.code === "Enter" && currentArea) setOpenPanel(currentArea);
            if (e.code === "Escape") setOpenPanel(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [currentArea]);

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#5bc8f5", overflow: "hidden" }}>
            <Canvas
                shadows
                camera={{ fov: 55, near: 0.5, far: 400, position: [0, 10, -18] }}
                gl={{ antialias: false, toneMapping: THREE.NoToneMapping }}
                dpr={[1, 1.5]}
            >
                {/* Pixel-sky blue background */}
                <color attach="background" args={["#5bc8f5"]} />
                <fog attach="fog" args={["#5bc8f5", 80, 160]} />

                {/* Flat cartoon lighting */}
                <ambientLight intensity={1.4} color="#f0f4e8" />
                <directionalLight
                    position={[20, 40, 10]}
                    intensity={1.6}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    shadow-camera-near={0.5}
                    shadow-camera-far={150}
                    shadow-camera-left={-70}
                    shadow-camera-right={70}
                    shadow-camera-top={70}
                    shadow-camera-bottom={-70}
                    color="#fff8e1"
                />

                <Ground />
                <Car ref={carRef} />
                <Buildings carRef={carRef} onEnterArea={setCurrentArea} />
                <CameraFollow carRef={carRef} />
            </Canvas>

            <TopBar onOpen={setOpenPanel} />
            <ControlsHint />
            <Speedometer speed={speed} />
            <AreaPrompt area={openPanel ? null : currentArea} />

            {openPanel === "about"    && <AboutPanel    onClose={() => setOpenPanel(null)} />}
            {openPanel === "projects" && <ProjectsPanel onClose={() => setOpenPanel(null)} />}
            {openPanel === "blog"     && <BlogPanel     onClose={() => setOpenPanel(null)} />}

            <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
    );
}
