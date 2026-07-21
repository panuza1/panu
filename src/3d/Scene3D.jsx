import { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Ground } from "./Ground.jsx";
import { Car } from "./Car.jsx";
import { CameraFollow } from "./CameraFollow.jsx";
import { Buildings } from "./Buildings.jsx";
import { Props } from "./Props.jsx";
import { RacePark } from "./RacePark.jsx";
import { AmbientDetails } from "./AmbientDetails.jsx";
import { JengLetters } from "./JengLetters.jsx";
import { AboutPanel, ProjectsPanel, BlogPanel } from "./InfoPanel.jsx";
import { ControlsHint, Speedometer, AreaPrompt, TopBar, TouchControls } from "./HUD.jsx";

const DAY_SKY = "#b9cfe0";
const NIGHT_SKY = "#121824";

function ToneExposure({ night }) {
    const gl = useThree((s) => s.gl);
    useEffect(() => {
        gl.toneMappingExposure = night ? 0.85 : 1.15;
    }, [gl, night]);
    return null;
}

function WorldLights({ night }) {
    if (night) {
        return (
            <>
                <ambientLight intensity={0.14} color="#6a7a9a" />
                <hemisphereLight args={["#1e2a40", "#0a0c10", 0.35]} />
                {/* Moon */}
                <directionalLight
                    position={[18, 32, -12]}
                    intensity={0.35}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    shadow-camera-near={1}
                    shadow-camera-far={90}
                    shadow-camera-left={-40}
                    shadow-camera-right={40}
                    shadow-camera-top={40}
                    shadow-camera-bottom={-40}
                    shadow-bias={-0.00015}
                    shadow-normalBias={0.04}
                    color="#c8d4f0"
                />
                <directionalLight position={[-16, 10, 8]} intensity={0.12} color="#4a6080" />
            </>
        );
    }

    return (
        <>
            <ambientLight intensity={0.65} color="#eef4f8" />
            <hemisphereLight args={["#dceaf5", "#8a7355", 0.55]} />
            <directionalLight
                position={[30, 28, 10]}
                intensity={1.45}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={90}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
                shadow-bias={-0.00015}
                shadow-normalBias={0.04}
                color="#fff1d6"
            />
            <directionalLight position={[-20, 12, -15]} intensity={0.3} color="#a8c4e0" />
        </>
    );
}

export function Scene3D() {
    const carRef = useRef(null);
    const [currentArea, setCurrentArea] = useState(null);
    const [openPanel, setOpenPanel] = useState(null);
    const [speed, setSpeed] = useState(0);
    const [night, setNight] = useState(false);

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
            if (e.code === "KeyN") setNight((n) => !n);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [currentArea]);

    const sky = night ? NIGHT_SKY : DAY_SKY;
    const fogNear = night ? 28 : 45;
    const fogFar = night ? 78 : 95;

    return (
        <div style={{
            width: "100vw", height: "100vh", background: sky, overflow: "hidden",
            transition: "background 0.6s ease",
        }}>
            <Canvas
                shadows
                camera={{ fov: 32, near: 0.5, far: 160, position: [16, 18, 16] }}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: night ? 0.85 : 1.15,
                }}
                dpr={[1, 1.75]}
                onCreated={({ gl }) => {
                    gl.shadowMap.type = THREE.PCFSoftShadowMap;
                }}
            >
                <color attach="background" args={[sky]} />
                <fog attach="fog" args={[sky, fogNear, fogFar]} />
                <ToneExposure night={night} />
                <WorldLights night={night} />

                <Ground />
                <RacePark carRef={carRef} />
                <AmbientDetails carRef={carRef} night={night} />
                <Car ref={carRef} />
                <JengLetters carRef={carRef} />
                <Props carRef={carRef} />
                <Buildings carRef={carRef} onEnterArea={setCurrentArea} />
                <CameraFollow carRef={carRef} />
            </Canvas>

            <TopBar onOpen={setOpenPanel} night={night} onToggleNight={() => setNight((n) => !n)} />
            <ControlsHint />
            <TouchControls />
            <Speedometer speed={speed} />
            <AreaPrompt area={openPanel ? null : currentArea} onOpen={setOpenPanel} />

            {openPanel === "about" && <AboutPanel onClose={() => setOpenPanel(null)} />}
            {openPanel === "projects" && <ProjectsPanel onClose={() => setOpenPanel(null)} />}
            {openPanel === "blog" && <BlogPanel onClose={() => setOpenPanel(null)} />}

            <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800&display=swap" rel="stylesheet" />
        </div>
    );
}
