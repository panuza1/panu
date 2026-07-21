import * as THREE from "three";

// Compact winding loop — closer buildings, less empty space
// About (-14,-12), Projects (14,-12), Blog (0,16), spawn (0,0)
const POINTS = [
    [0, 0], [7, 3], [11, 8], [9, 14], [0, 13],
    [-9, 14], [-11, 8], [-13, 1], [-11, -8],
    [-7, -12], [0, -13], [7, -12], [12, -8], [11, -2],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

export const trackCurve = new THREE.CatmullRomCurve3(POINTS, true, "catmullrom", 0.55);
export const trackSamples = trackCurve.getSpacedPoints(180);
export const ROAD_WIDTH = 4.2;

export function isOnRoad(x, z, margin = ROAD_WIDTH / 2 + 1.6) {
    const m2 = margin * margin;
    for (const p of trackSamples) {
        const dx = p.x - x;
        const dz = p.z - z;
        if (dx * dx + dz * dz < m2) return true;
    }
    return false;
}
