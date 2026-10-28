import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { sceneBus } from "../scene-bus";

const TARGETS: Record<string, THREE.Vector3> = {
  calc: new THREE.Vector3(0, 0.2, 18),
  graph: new THREE.Vector3(5.2, 0.8, 16),
  solve: new THREE.Vector3(-5, -0.4, 16.5),
  matrix: new THREE.Vector3(3.4, -1.2, 15.5),
  stats: new THREE.Vector3(-2.4, 2.2, 18),
  units: new THREE.Vector3(0.4, -1.6, 19),
  calculus: new THREE.Vector3(4, 2.1, 16.2),
  formulas: new THREE.Vector3(-3.6, 1.1, 17.4),
  history: new THREE.Vector3(0.2, 3.1, 20),
  insights: new THREE.Vector3(1.5, 1.2, 17),
};

const particleVert = `
uniform float uTime;
uniform float uPulse;
uniform float uIntro;
uniform vec2 uPointer;
attribute float seed;
varying float vAlpha;
void main() {
  vec3 p = position;
  float s = seed * 6.2831853;
  float drift = uTime * (0.12 + seed * 0.2);
  p.x += sin(drift + s) * 1.8;
  p.y += cos(drift * 0.8 + s * 1.3) * 1.5;
  p.z += sin(uTime * 0.1 + p.x * 0.08) * 1.2;
  vec2 pull = p.xy - uPointer * vec2(16.0, -9.0);
  float kick = exp(-dot(pull, pull) * 0.012);
  p.xy += normalize(pull + 0.0001) * kick * (1.4 + uPulse * 3.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vAlpha = clamp(1.0 - (-mv.z) / 78.0, 0.12, 1.0) * uIntro;
  gl_PointSize = (1.1 + seed * 2.2) * (1.0 + uPulse * 1.4) * (300.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const particleFrag = `
uniform vec3 uColor;
uniform float uDim;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.05, d) * vAlpha * uDim);
}
`;

const waveVert = `
uniform float uTime;
uniform float uPulse;
uniform float uIntro;
varying vec2 vUv;
varying float vH;
void main() {
  vUv = uv;
  vec3 p = position;
  float w = sin(p.x * 0.28 + uTime * 0.7) + cos(p.y * 0.22 - uTime * 0.45);
  vH = w * 0.35;
  p.z += vH * (1.0 + uPulse) * uIntro * 2.2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const waveFrag = `
uniform float uTime;
uniform float uPulse;
uniform float uDim;
uniform float uIntro;
uniform vec3 uA;
uniform vec3 uB;
varying vec2 vUv;
varying float vH;
void main() {
  vec2 q = vUv * 36.0;
  vec2 f = abs(fract(q) - 0.5);
  float grid = smoothstep(0.06, 0.0, min(f.x, f.y));
  float band = smoothstep(0.72, 1.0, sin(vUv.y * 24.0 - uTime * 1.4) * 0.5 + 0.5);
  float scan = 0.82 + 0.18 * sin(vUv.y * 420.0);
  float edge = smoothstep(0.72, 0.12, length(vUv - 0.5));
  vec3 col = mix(uA, uB, clamp(vH * 0.5 + 0.5, 0.0, 1.0));
  float alpha = (grid * 0.55 + band * 0.28 + uPulse * 0.18) * edge * uDim * uIntro * scan;
  gl_FragColor = vec4(col, alpha);
}
`;

function Particles({ count, color, spread }: { count: number; color: string; spread: number }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uIntro: { value: 1 },
      uPointer: { value: new THREE.Vector2() },
      uDim: { value: 1 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color],
  );
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread - 8;
      seeds[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
    return geometry;
  }, [count, spread]);

  useFrame((_, dt) => {
    const speed = sceneBus.reduced ? 0.05 : sceneBus.focus ? 0.35 : 1;
    uniforms.uTime.value += dt * speed;
    uniforms.uPulse.value = sceneBus.pulse;
    uniforms.uIntro.value = sceneBus.intro;
    uniforms.uPointer.value.set(sceneBus.pointer.x, sceneBus.pointer.y);
    uniforms.uDim.value = sceneBus.theme === "light" ? 0.38 : sceneBus.focus ? 0.45 : 1;
  });

  return (
    <points geometry={geo}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Waves() {
  const indigo = useMemo(() => new THREE.Color("#6366f1"), []);
  const cyan = useMemo(() => new THREE.Color("#22d3ee"), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uDim: { value: 1 },
      uIntro: { value: 1 },
      uA: { value: cyan.clone() },
      uB: { value: new THREE.Color("#8b5cf6") },
    }),
    [cyan],
  );
  useFrame((_, dt) => {
    uniforms.uTime.value += dt * (sceneBus.reduced ? 0 : 1);
    uniforms.uPulse.value = sceneBus.pulse;
    uniforms.uIntro.value = sceneBus.intro;
    uniforms.uDim.value = sceneBus.theme === "light" ? 0.28 : sceneBus.focus ? 0.3 : 0.85;
    const hue = sceneBus.mode === "graph" ? 0.45 : sceneBus.mode === "solve" ? 0.75 : 0.12;
    uniforms.uA.value.copy(cyan).lerp(indigo, hue);
  });
  return (
    <mesh rotation={[-1.15, 0, 0]} position={[0, -10, -16]}>
      <planeGeometry args={[96, 96, 70, 70]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={waveVert}
        fragmentShader={waveFrag}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Crystal({ geo, position, color }: { geo: ReactNode; position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      {geo}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.4} depthWrite={false} />
    </mesh>
  );
}

function Structures({ detail }: { detail: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const root = group.current;
    if (!root) return;
    const speed = (sceneBus.reduced ? 0 : 1) * (sceneBus.focus ? 0.25 : 1);
    root.children.forEach((child, index) => {
      child.rotation.x += dt * speed * (0.04 + index * 0.008);
      child.rotation.y += dt * speed * (0.07 + (index % 3) * 0.018);
      const scale = (0.2 + 0.8 * sceneBus.intro) * (1 + sceneBus.pulse * 0.05);
      child.scale.setScalar(scale);
    });
  });
  return (
    <group ref={group}>
      <Crystal geo={<icosahedronGeometry args={[6.2, detail ? 2 : 1]} />} position={[15, 3.2, -18]} color="#8b5cf6" />
      <Crystal geo={<octahedronGeometry args={[4.4, detail ? 2 : 0]} />} position={[13, -5.5, -12]} color="#22d3ee" />
      <Crystal geo={<torusGeometry args={[8.5, 0.08, 12, detail ? 140 : 64]} />} position={[-15, -2, -18]} color="#67e8f9" />
      <Crystal geo={<torusGeometry args={[12, 0.045, 8, detail ? 160 : 72]} />} position={[5, 8, -26]} color="#e0f2fe" />
      <Crystal geo={<torusKnotGeometry args={[3.4, 0.72, detail ? 120 : 60, 12, 2, 3]} />} position={[-13, 6.5, -14]} color="#6366f1" />
      <Crystal geo={<sphereGeometry args={[9, detail ? 24 : 12, detail ? 16 : 8]} />} position={[-2, 0, -32]} color="#312e81" />
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 0, -8), []);
  const dest = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 2.1);
    const base = TARGETS[sceneBus.mode] ?? TARGETS.calc;
    dest.copy(base);
    dest.x += sceneBus.pointer.x * 3.2;
    dest.y += -sceneBus.pointer.y * 2.1;
    camera.position.lerp(dest, sceneBus.reduced ? 1 : k);
    camera.lookAt(look);
    sceneBus.pulse = Math.max(0, sceneBus.pulse - dt * 1.15);
  });
  return null;
}

export function NexusScene({ quality }: { quality: "high" | "low" }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      sceneBus.pointer.x = event.clientX / Math.max(1, window.innerWidth) - 0.5;
      sceneBus.pointer.y = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    };
    const onVis = () => setHidden(document.hidden);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      frameloop={hidden ? "never" : "always"}
      dpr={quality === "low" ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, 0.2, 18], fov: 58, near: 0.1, far: 200 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Rig />
      <Particles count={quality === "high" ? 4200 : 1300} color="#67e8f9" spread={72} />
      <Particles count={quality === "high" ? 1500 : 420} color="#c4b5fd" spread={48} />
      <Waves />
      <Structures detail={quality === "high"} />
    </Canvas>
  );
}
