import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const ACCENT = '#0d9488';
const ACCENT_COLOR = new THREE.Color(ACCENT);

/* ── Screen shader ── */
const vert = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const frag = /* glsl */`
uniform float uMix;
uniform float uTime;
uniform vec3  uAccent;
varying vec2 vUv;

float grid(vec2 uv, float lines) {
  vec2 g = abs(fract(uv * lines) - 0.5);
  return 1.0 - step(0.04, min(g.x, g.y));
}

vec3 ui(vec2 uv) {
  vec3 col = vec3(0.06, 0.06, 0.10);
  if (uv.y > 0.85) col = vec3(0.08,0.08,0.14);
  if (uv.y > 0.86 && uv.y < 0.92 && mod(uv.x*4.0,1.0) > 0.15 && mod(uv.x*4.0,1.0) < 0.75) col = uAccent * 0.6;
  if (uv.y > 0.55 && uv.y < 0.82 && uv.x > 0.06 && uv.x < 0.94) col = vec3(0.12,0.10,0.20);
  if (uv.y > 0.72 && uv.y < 0.77 && uv.x > 0.12 && uv.x < 0.6) col = uAccent * 0.9;
  if (uv.y > 0.64 && uv.y < 0.68 && uv.x > 0.12 && uv.x < 0.45) col = vec3(0.5,0.5,0.6);
  if (uv.y > 0.3 && uv.y < 0.5) {
    float cx = mod(uv.x*3.0,1.0);
    if (cx > 0.08 && cx < 0.92) col = vec3(0.1,0.09,0.17);
  }
  if (uv.y > 0.35 && uv.y < 0.42 && uv.x > 0.12 && uv.x < 0.38) col = uAccent;
  return col;
}

void main() {
  float g = grid(vUv, 8.0);
  vec3 wireColor = uAccent * (0.5 + g * 0.5);
  vec3 uiColor = ui(vUv);
  float scan = sin(vUv.y * 80.0 + uTime * 2.0) * 0.015;
  vec3 final = mix(wireColor, uiColor + scan, uMix);
  float alpha = mix(g * 0.85, 0.95, uMix);
  gl_FragColor = vec4(final, alpha);
}
`;

const DEVS = [
  { w:2.8, h:1.8, d:0.08, bezel:0.08, fX:-2.2, fY:0.4, fZ:-0.5, rX:0, rY:0.35, rZ:0.05, stand:true, home:false },
  { w:1.2, h:1.7, d:0.07, bezel:0.07, fX:0,   fY:0,   fZ:0.3,  rX:0, rY:0,    rZ:0,    stand:false, home:false },
  { w:0.65,h:1.35,d:0.065,bezel:0.05, fX:2.0, fY:-0.3,fZ:-0.4, rX:0, rY:-0.3, rZ:-0.05,stand:false, home:true  },
];

export default function DeviceFan() {
  const groupRef   = useRef<THREE.Group>(null!);
  const devRefs    = useRef<THREE.Group[]>([]);
  const uniforms   = useRef(DEVS.map(() => ({
    uMix: { value: 0 }, uTime: { value: 0 }, uAccent: { value: ACCENT_COLOR },
  })));

  const activeSection  = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);
  const reducedMotion  = useStore((s) => s.reducedMotion);
  const isActive = activeSection === 'websites';

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1a2530), roughness: 0.4, metalness: 0.75, transparent: true, opacity: 0,
  }), []);

  const screenMats = useMemo(() =>
    DEVS.map((_, i) => new THREE.ShaderMaterial({
      uniforms: uniforms.current[i], vertexShader: vert, fragmentShader: frag, transparent: true,
    })), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const prog = isActive ? sectionProgress : 0;
    const time = state.clock.elapsedTime;

    let opacity = 0, scale = 0.88;
    if (prog < 0.15)      { opacity = prog/0.15;        scale = 0.88 + 0.12*(prog/0.15); }
    else if (prog < 0.85) { opacity = 1;                scale = 1; }
    else                  { opacity = 1-(prog-0.85)/0.15; scale = 1-0.1*((prog-0.85)/0.15); }
    if (reducedMotion)    { opacity = isActive ? 1 : 0; scale = 1; }

    groupRef.current.visible = opacity > 0.01;
    groupRef.current.scale.setScalar(scale);
    bodyMat.opacity = opacity;

    const fanT    = Math.max(0, Math.min(1, (prog - 0.15) / 0.55));
    const shaderT = Math.max(0, Math.min(1, (prog - 0.4)  / 0.45));

    devRefs.current.forEach((dg, i) => {
      if (!dg) return;
      const d = DEVS[i];
      dg.position.x = THREE.MathUtils.lerp(0, d.fX, fanT);
      dg.position.y = THREE.MathUtils.lerp(0, d.fY, fanT);
      dg.position.z = THREE.MathUtils.lerp(i * 0.02, d.fZ, fanT);
      dg.rotation.x = THREE.MathUtils.lerp(0, d.rX, fanT);
      dg.rotation.y = THREE.MathUtils.lerp(0, d.rY, fanT);
      dg.rotation.z = THREE.MathUtils.lerp(0, d.rZ, fanT);
      uniforms.current[i].uMix.value  = shaderT;
      uniforms.current[i].uTime.value = time;
      if (!reducedMotion && isActive && scale === 1)
        dg.rotation.y += Math.sin(time * 0.4) * 0.001;
    });
  });

  useEffect(() => () => { bodyMat.dispose(); screenMats.forEach(m => m.dispose()); }, []);

  return (
    <group ref={groupRef} position={[-1, 0, 0]}>
      {DEVS.map((d, i) => (
        <group key={i} ref={(el) => { if (el) devRefs.current[i] = el; }}>
          <mesh material={bodyMat}><boxGeometry args={[d.w, d.h, d.d]} /></mesh>
          <mesh position={[0, 0, d.d/2 + 0.001]} material={screenMats[i]}>
            <planeGeometry args={[d.w - d.bezel*2, d.h - d.bezel*2]} />
          </mesh>
          <mesh position={[0, -d.h/2 + d.bezel/2, d.d/2]}>
            <boxGeometry args={[d.w, 0.025, 0.01]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.5} />
          </mesh>
          {d.stand && <>
            <mesh material={bodyMat} position={[0,-1.05,0]}><cylinderGeometry args={[0.06,0.06,0.45,8]} /></mesh>
            <mesh material={bodyMat} position={[0,-1.3,0]}><cylinderGeometry args={[0.55,0.55,0.06,12]} /></mesh>
          </>}
          {d.home && (
            <mesh position={[0, -d.h/2 + d.bezel*0.6, d.d/2]}>
              <circleGeometry args={[0.055, 12]} />
              <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.5} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
