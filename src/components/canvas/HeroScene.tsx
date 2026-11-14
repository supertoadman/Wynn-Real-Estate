"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { MousePosition } from "@/hooks";
import {
  CONSTRUCTION_LINES,
  RESIDENCE,
  RESIDENCE_CENTER,
  seededRandom,
  type VolumeSpec,
} from "./residence";

/**
 * The hero's WebGL scene: an architectural model of a cantilevered
 * residence, drawn as dark masses with gold wireframe edges and lit from
 * opposite sides in crimson and gold.
 *
 *  - On load the storeys settle into place from an exploded stack.
 *  - The pointer orbits the model and swings the gold light.
 *  - Scrolling lifts the storeys apart again and dissolves the masses,
 *    leaving a blueprint-style exploded axonometric.
 *
 * This module touches `window` (WebGL), so it is only ever loaded through
 * `HeroCanvas`, which imports it dynamically with SSR disabled.
 */

const COLOR = {
  obsidian: "#09090b",
  mass: "#2e2e37",
  gold: "#f5b700",
  goldBright: "#ffd000",
  crimson: "#e61938",
} as const;

/** Camera orbit around the model, in spherical terms. */
const CAMERA = {
  azimuth: 0.72,
  elevation: 0.25,
  distance: 18.5,
};

const INTRO_SECONDS = 2.8;
/** How far apart the storeys start (intro) and travel (scroll). */
const INTRO_EXPLODE = 1.7;
const SCROLL_EXPLODE = 1.15;
/** Metres of lift per storey at an explode factor of 1. */
const STOREY_LIFT = 0.5;

const { damp, clamp, smoothstep } = THREE.MathUtils;

/** Per-frame values shared by every volume. */
interface AnimationState {
  /** 0 = assembled; higher lifts the storeys apart. */
  explode: number;
  /** 0 = solid model; 1 = wireframe blueprint. */
  blueprint: number;
  /** 0 → 1 intro fade. */
  reveal: number;
}

export interface HeroSceneProps {
  /** Normalised pointer position (see `useMousePosition`). */
  pointer: RefObject<MousePosition>;
  /** Scroll progress through the hero, 0 → 1. */
  progress: RefObject<number>;
  /** Render continuously only while the hero is on screen. */
  active: boolean;
  /** Render a single composed still instead of animating. */
  reducedMotion: boolean;
  onReady?: () => void;
}

export default function HeroScene({
  pointer,
  progress,
  active,
  reducedMotion,
  onReady,
}: HeroSceneProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      camera={{ fov: 32, near: 0.1, far: 160 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={[COLOR.obsidian, 22, 58]} />
      <Lighting pointer={pointer} />
      <Model pointer={pointer} progress={progress} reducedMotion={reducedMotion} />
      <Dust />
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */

function Lighting({ pointer }: Pick<HeroSceneProps, "pointer">) {
  const goldLight = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    const light = goldLight.current;
    if (!light) return;
    const dt = Math.min(delta, 0.1);
    light.position.x = damp(light.position.x, 9 + pointer.current.nx * 6, 2.5, dt);
    light.position.y = damp(light.position.y, 7 + pointer.current.ny * 3, 2.5, dt);
  });

  return (
    <>
      <ambientLight color="#9a9ab8" intensity={0.4} />
      {/* Crimson wash raking across the front elevation. */}
      <directionalLight color={COLOR.crimson} intensity={6.5} position={[-10, 3.5, 6]} />
      {/* Gold rim from behind; follows the pointer. */}
      <directionalLight
        ref={goldLight}
        color={COLOR.gold}
        intensity={4.2}
        position={[9, 7, -5]}
      />
      {/* Faint cool fill so unlit faces keep their form. */}
      <directionalLight color="#dfe3ff" intensity={0.7} position={[3, 10, 9]} />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Model({
  pointer,
  progress,
  reducedMotion,
}: Pick<HeroSceneProps, "pointer" | "progress" | "reducedMotion">) {
  const rig = useRef<THREE.Group>(null);
  const intro = useRef(reducedMotion ? 1 : 0);
  const animation = useRef<AnimationState>({
    explode: reducedMotion ? 0 : INTRO_EXPLODE,
    blueprint: 0,
    reveal: reducedMotion ? 1 : 0,
  });
  const framing = useRef({ width: 0, height: 0, distance: 1 });
  const target = useMemo(() => new THREE.Vector3(...RESIDENCE_CENTER), []);

  useFrame((state, delta) => {
    // Clamp the step so a stalled tab cannot fling the animation forward.
    const dt = Math.min(delta, 0.1);
    const { camera, size, clock } = state;
    const scroll = clamp(progress.current, 0, 1);
    const mouse = pointer.current;
    const anim = animation.current;
    const frame = framing.current;

    // Responsive framing: push the model to the right of the headline on
    // wide screens, and up above it on portrait ones.
    if (frame.width !== size.width || frame.height !== size.height) {
      frame.width = size.width;
      frame.height = size.height;
      const aspect = size.width / size.height;
      const shiftX = aspect > 1.5 ? 0.2 : aspect > 1 ? 0.16 : 0;
      const shiftY = aspect > 1 ? -0.02 : 0.2;
      frame.distance = aspect > 1.5 ? 1.08 : aspect > 1 ? 1.2 : 1.8;

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.setViewOffset(
          size.width,
          size.height,
          -shiftX * size.width,
          shiftY * size.height,
          size.width,
          size.height,
        );
      }
    }

    // Intro: storeys settle into place.
    intro.current = Math.min(1, intro.current + Math.min(delta, 0.25) / INTRO_SECONDS);
    const settled = 1 - Math.pow(1 - intro.current, 4);

    anim.reveal = settled;
    anim.explode = damp(
      anim.explode,
      (1 - settled) * INTRO_EXPLODE + smoothstep(scroll, 0, 0.9) * SCROLL_EXPLODE,
      5,
      dt,
    );
    anim.blueprint = damp(anim.blueprint, smoothstep(scroll, 0.08, 0.75), 5, dt);

    // Model: orbit with the pointer, drift at rest, turn with scroll.
    const model = rig.current;
    if (model) {
      const sway = Math.sin(clock.elapsedTime * 0.22) * 0.05;
      model.rotation.y = damp(
        model.rotation.y,
        mouse.nx * 0.24 + sway + scroll * 0.95 + (1 - settled) * -0.5,
        3,
        dt,
      );
    }

    // Camera: slight counter-parallax, then rise toward a plan view on scroll.
    const azimuth = CAMERA.azimuth - mouse.nx * 0.06;
    const elevation = CAMERA.elevation + mouse.ny * -0.05 + scroll * 0.34;
    const distance = CAMERA.distance * frame.distance * (1 - scroll * 0.1);
    const flat = Math.cos(elevation) * distance;

    const x = target.x + Math.sin(azimuth) * flat;
    const y = target.y + Math.sin(elevation) * distance;
    const z = target.z + Math.cos(azimuth) * flat;

    if (intro.current < 0.02 || reducedMotion) {
      camera.position.set(x, y, z);
    } else {
      camera.position.set(
        damp(camera.position.x, x, 3.5, dt),
        damp(camera.position.y, y, 3.5, dt),
        damp(camera.position.z, z, 3.5, dt),
      );
    }
    camera.lookAt(target);
  });

  return (
    <group ref={rig}>
      {RESIDENCE.map((spec) => (
        <Volume key={spec.id} spec={spec} animation={animation} />
      ))}
      <ConstructionLines animation={animation} />
      <SiteGrid />
    </group>
  );
}

/* -------------------------------------------------------------------------- */

function Volume({
  spec,
  animation,
}: {
  spec: VolumeSpec;
  animation: RefObject<AnimationState>;
}) {
  const group = useRef<THREE.Group>(null);
  const surface = useRef<THREE.MeshStandardMaterial>(null);
  const outline = useRef<THREE.LineBasicMaterial>(null);

  const box = useMemo(() => new THREE.BoxGeometry(...spec.size), [spec.size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(box), [box]);

  const isGlass = spec.kind === "glass";

  useFrame(() => {
    const anim = animation.current;
    // Lower storeys fade in first, so the model appears to be built upward.
    const reveal = clamp(anim.reveal * 1.6 - spec.level * 0.09, 0, 1);

    if (group.current) {
      group.current.position.y =
        spec.position[1] + spec.level * anim.explode * STOREY_LIFT;
    }
    if (surface.current) {
      surface.current.opacity = isGlass
        ? reveal * (0.2 - anim.blueprint * 0.12)
        : reveal * (1 - anim.blueprint * 0.9);
    }
    if (outline.current) {
      outline.current.opacity = Math.min(
        1,
        spec.edgeOpacity * reveal * (1 + anim.blueprint * 0.7),
      );
    }
  });

  return (
    <group ref={group} position={spec.position}>
      {spec.kind !== "frame" && (
        <mesh geometry={box}>
          {isGlass ? (
            <meshStandardMaterial
              ref={surface}
              color={COLOR.gold}
              emissive={COLOR.goldBright}
              emissiveIntensity={0.7}
              transparent
              opacity={0}
              depthWrite={false}
            />
          ) : (
            <meshStandardMaterial
              ref={surface}
              color={COLOR.mass}
              roughness={0.62}
              metalness={0.25}
              transparent
              opacity={0}
              // Push faces back a hair so edge lines never z-fight them.
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={1}
            />
          )}
        </mesh>
      )}

      <lineSegments geometry={edges}>
        <lineBasicMaterial
          ref={outline}
          color={spec.edge === "crimson" ? COLOR.crimson : COLOR.gold}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      {/* Lit interiors spill warm light onto the slabs around them. */}
      {isGlass && (
        <pointLight color={COLOR.goldBright} intensity={2.4} distance={7} decay={2} />
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */

const CONSTRUCTION_POSITIONS = new Float32Array(CONSTRUCTION_LINES);

function ConstructionLines({ animation }: { animation: RefObject<AnimationState> }) {
  const material = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    if (!material.current) return;
    const anim = animation.current;
    material.current.opacity = anim.reveal * (0.1 + anim.blueprint * 0.14);
  });

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[CONSTRUCTION_POSITIONS, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={material}
        color={COLOR.gold}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* -------------------------------------------------------------------------- */

const GRID_SHADER = {
  uniforms: {
    uColor: { value: new THREE.Color(COLOR.gold) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vLocal;
    void main() {
      vLocal = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying vec2 vLocal;

    float gridLine(vec2 point, float cell) {
      vec2 coord = point / cell;
      vec2 line = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      return 1.0 - min(min(line.x, line.y), 1.0);
    }

    void main() {
      float minor = gridLine(vLocal, 1.0);
      float major = gridLine(vLocal, 5.0);
      float fade = 1.0 - smoothstep(3.0, 30.0, length(vLocal));
      float alpha = (minor * 0.14 + major * 0.34) * fade;
      gl_FragColor = vec4(uColor, alpha);
    }
  `,
};

/** Surveyor's grid on the ground plane, fading out with distance. */
function SiteGrid() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.002}>
      <planeGeometry args={[90, 90]} />
      <shaderMaterial args={[GRID_SHADER]} transparent depthWrite={false} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */

const DUST_COUNT = 420;

/** Slow-drifting gold motes that give the space depth. */
function Dust() {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const random = seededRandom(20240917);
    const array = new Float32Array(DUST_COUNT * 3);
    for (let index = 0; index < DUST_COUNT; index += 1) {
      array[index * 3] = (random() - 0.5) * 42;
      array[index * 3 + 1] = random() * 16 - 1;
      array[index * 3 + 2] = (random() - 0.5) * 42;
    }
    return array;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * 0.012;
    points.current.position.y = Math.sin(clock.elapsedTime * 0.25) * 0.25;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={COLOR.goldBright}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
