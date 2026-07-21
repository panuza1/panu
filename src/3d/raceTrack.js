import * as THREE from "three";

export const RACE_WIDTH = 4.0;

/**
 * Irregular circuit: long straights, hairpins, esses — not a round oval.
 * Stays outside the village core (buildings ~|xz| < 18).
 */
const CONTROL = [
    // Start / finish — east straight
    [30, -1],
    [31, 7],
    // NE sweep into esses
    [28, 15],
    [22, 23],
    [14, 29],
    [5, 32],
    // North hairpin (tight inward)
    [-3, 30],
    [-7, 24],
    [-2, 20],
    [-9, 22],
    // NW bulge out
    [-17, 29],
    [-26, 31],
    [-33, 24],
    // West — long with mid kink
    [-36, 14],
    [-37, 4],
    [-34, -4],
    [-37, -12],
    [-31, -20],
    // SW chicane
    [-23, -28],
    [-13, -33],
    [-4, -30],
    [3, -35],
    [12, -33],
    // South esses
    [18, -26],
    [24, -31],
    [30, -24],
    [32, -15],
    [29, -7],
].map(([x, z]) => new THREE.Vector3(x, 0, z));

export const raceCurve = new THREE.CatmullRomCurve3(CONTROL, true, "catmullrom", 0.38);
export const raceSamples = raceCurve.getSpacedPoints(220);

export function isOnRaceTrack(x, z, margin = RACE_WIDTH / 2 + 0.9) {
    const m2 = margin * margin;
    for (const p of raceSamples) {
        const dx = p.x - x;
        const dz = p.z - z;
        if (dx * dx + dz * dz < m2) return true;
    }
    return false;
}

export const RACE_RADIUS = Math.max(...CONTROL.map((p) => Math.hypot(p.x, p.z))) + 3;

export function pointAt(t) {
    return raceCurve.getPointAt(((t % 1) + 1) % 1);
}

export function tangentAt(t) {
    return raceCurve.getTangentAt(((t % 1) + 1) % 1).normalize();
}

/** Points along the outside of the circuit (for edge trees / fill). */
export function raceOuterSamples(offset = 4, every = 4) {
    const out = [];
    for (let i = 0; i < raceSamples.length; i += every) {
        const p = raceSamples[i];
        const next = raceSamples[(i + 1) % raceSamples.length];
        const tx = next.x - p.x;
        const tz = next.z - p.z;
        const len = Math.hypot(tx, tz) || 1;
        const nx = -tz / len;
        const nz = tx / len;
        // Outward = away from origin-ish (race is around village)
        const cx = p.x + nx * offset;
        const cz = p.z + nz * offset;
        const ox = p.x - nx * offset;
        const oz = p.z - nz * offset;
        // Prefer farther from center as "outer"
        if (cx * cx + cz * cz >= ox * ox + oz * oz) out.push(new THREE.Vector3(cx, 0, cz));
        else out.push(new THREE.Vector3(ox, 0, oz));
    }
    return out;
}
