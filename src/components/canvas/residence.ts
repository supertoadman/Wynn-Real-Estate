/**
 * Geometry of the hero's architectural model: a cantilevered modernist
 * residence described as a stack of boxes. Pure data — no Three.js — so the
 * massing can be redesigned without touching the renderer.
 *
 * Units are metres. `level` is the storey a volume belongs to; when the
 * model "explodes" on scroll, each level lifts in proportion to its number,
 * producing an exploded-axonometric drawing.
 */

export type Vec3 = [x: number, y: number, z: number];

export type VolumeKind = "mass" | "glass" | "frame";

export interface VolumeSpec {
  id: string;
  size: Vec3;
  /** Centre of the box. */
  position: Vec3;
  level: number;
  /** `mass` is solid, `glass` is a lit translucent volume, `frame` is edges only. */
  kind: VolumeKind;
  /** Edge-line colour. */
  edge: "gold" | "crimson";
  /** Base edge opacity, 0–1. */
  edgeOpacity: number;
}

function volume(
  id: string,
  size: Vec3,
  position: Vec3,
  level: number,
  options: Partial<Pick<VolumeSpec, "kind" | "edge" | "edgeOpacity">> = {},
): VolumeSpec {
  return {
    id,
    size,
    position,
    level,
    kind: options.kind ?? "mass",
    edge: options.edge ?? "gold",
    edgeOpacity: options.edgeOpacity ?? 0.55,
  };
}

/** Slender vertical louvres screening the upper storey. */
function louvres(): VolumeSpec[] {
  const count = 14;
  return Array.from({ length: count }, (_, index) =>
    volume(
      `louvre-${index}`,
      [0.05, 1.16, 0.3],
      [-1.05 + index * 0.38, 2.42, 1.48],
      3,
      { edgeOpacity: 0.32 },
    ),
  );
}

/** Pilotis carrying the cantilever. */
function columns(): VolumeSpec[] {
  const positions: Array<[number, number]> = [
    [3.9, 1.35],
    [3.9, -1.35],
    [2.1, 1.35],
  ];
  return positions.map(([x, z], index) =>
    volume(`column-${index}`, [0.09, 1.34, 0.09], [x, 0.97, z], 1, {
      edgeOpacity: 0.4,
    }),
  );
}

export const RESIDENCE: VolumeSpec[] = [
  // Site
  volume("plinth", [9.2, 0.3, 5.4], [0.4, 0.15, 0.2], 0, { edgeOpacity: 0.38 }),
  volume("pool", [3.6, 0.05, 1.15], [1.7, 0.33, 2.2], 0, {
    kind: "frame",
    edgeOpacity: 0.85,
  }),
  volume("steps", [1.6, 0.14, 0.9], [-3.3, 0.37, 2.1], 0, { edgeOpacity: 0.3 }),

  // The monolith: a full-height stone core that anchors the composition.
  volume("core", [1.05, 5.1, 1.05], [-2.1, 2.85, -1.0], 0, {
    edge: "crimson",
    edgeOpacity: 0.8,
  }),

  // Ground storey
  volume("base", [3.1, 1.34, 3.2], [-1.2, 0.97, 0.3], 1),
  volume("living-pavilion", [3.9, 1.34, 2.7], [2.3, 0.97, 0], 1, {
    kind: "glass",
    edgeOpacity: 0.75,
  }),
  ...columns(),

  // First-floor slab, cantilevering beyond the pavilion
  volume("slab-1", [8.4, 0.18, 3.9], [1.0, 1.73, 0.1], 2, { edgeOpacity: 0.6 }),

  // Upper storey: a long bar floating over the glass
  volume("bedroom-bar", [6.0, 1.2, 2.6], [1.5, 2.42, 0.05], 3),
  volume("gallery-glass", [1.9, 1.2, 2.2], [-1.75, 2.42, 0.5], 3, {
    kind: "glass",
    edgeOpacity: 0.6,
  }),
  ...louvres(),

  // Roof
  volume("roof", [7.0, 0.14, 3.3], [1.2, 3.09, 0.1], 4, { edgeOpacity: 0.6 }),
  volume("sky-lounge", [2.2, 0.86, 1.8], [0.4, 3.59, 0.2], 5, {
    kind: "glass",
    edgeOpacity: 0.7,
  }),
  volume("canopy", [3.4, 0.08, 2.6], [0.7, 4.06, 0.2], 6, { edgeOpacity: 0.7 }),
];

/** Rough vertical centre of the model, used as the camera's look-at target. */
export const RESIDENCE_CENTER: Vec3 = [0.6, 2.1, 0];

/**
 * Long, faint construction lines — the kind an architect leaves on a
 * drawing — as flat [x1,y1,z1, x2,y2,z2, …] segment pairs.
 */
export const CONSTRUCTION_LINES: number[] = [
  // Datum along the first-floor slab
  -16, 1.82, 2.05, 16, 1.82, 2.05,
  // Roof datum
  -16, 3.16, -1.55, 16, 3.16, -1.55,
  // Core axis
  -2.1, -2, -1.0, -2.1, 11, -1.0,
  // Site axes
  -18, 0.31, 0.2, 18, 0.31, 0.2,
  0.4, 0.31, -14, 0.4, 0.31, 14,
];

/** Deterministic PRNG so the dust field is identical on every render. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
