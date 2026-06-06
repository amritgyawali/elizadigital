import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const ACCENT = '#e11d5a';
const ACCENT_COLOR = new THREE.Color(ACCENT);
const DARK = new THREE.Color(0x0d0810);

export default function VideoReel() {
  const groupRef   = useRef<THREE.Group>(null!);
  const clapTopRef = useRef<THREE.Mesh>(null!);
  const stripRef   = useRef<THREE.Group>(null!);
  const torusRef   = useRef<THREE.Mesh>(null!);

  const activeSection  = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);
  const reducedMotion  = useStore((s) => s.reducedMotion);
  const isActive = activeSection === 'video';

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: DARK, emissive: ACCENT_COLOR, emissiveIntensity: 0.05,
    roughness: 0.6, metalness: 0.3, transparent: true, opacity: 0,
  }), []);

  const stripeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf4f4f6), roughness: 0.8, transparent: true, opacity: 0,
  }), []);

  const FRAME_COUNT = 6;
  const frameMats = useMemo(() =>
    Array.from({ length: FRAME_COUNT }, (_, i) => new THREE.MeshStandardMaterial({
      color: DARK, emissive: ACCENT_COLOR, emissiveIntensity: 0.1 + i * 0.12,
      roughness: 0.3, metalness: 0.5, transparent: true, opacity: 0,
    })), []);

  const torusMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT_COLOR, emissive: ACCENT_COLOR, emissiveIntensity: 1,
    transparent: true, opacity: 0, roughness: 0.2, metalness: 0.8,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const prog = isActive ? sectionProgress : 0;
    const time = state.clock.elapsedTime;

    let opacity = 0, scale = 0.85;
    if (prog < 0.15)      { opacity = prog/0.15;        scale = 0.85 + 0.15*(prog/0.15); }
    else if (prog < 0.85) { opacity = 1;                scale = 1; }
    else                  { opacity = 1-(prog-0.85)/0.15; scale = 1-0.1*((prog-0.85)/0.15); }
    if (reducedMotion)    { opacity = isActive ? 1 : 0; scale = 1; }

    groupRef.current.visible = opacity > 0.01;
    groupRef.current.scale.setScalar(scale);
    bodyMat.opacity   = opacity;
    stripeMat.opacity = opacity;

    // Clapper snap at prog ~0.2
    if (clapTopRef.current) {
      const snapT = Math.max(0, Math.min(1, (prog - 0.15) / 0.1));
      clapTopRef.current.rotation.z = THREE.MathUtils.lerp(-Math.PI / 4, 0, snapT);
    }

    // Film strip unroll
    const stripT = Math.max(0, Math.min(1, (prog - 0.25) / 0.6));
    if (stripRef.current) {
      stripRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat  = mesh.material as THREE.MeshStandardMaterial;
        const fT   = Math.max(0, Math.min(1, (stripT - i * 0.14) / 0.15));
        mat.opacity = opacity * fT;
        const angle  = (i - 2.5) * 0.55;
        const radius = 2.2 + fT * 0.8;
        mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, Math.sin(angle) * radius, 0.06);
        mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, Math.cos(angle) * radius * 0.35, 0.06);
        mesh.rotation.z = angle * 0.6;
        if (fT > 0.5 && !reducedMotion)
          mat.emissiveIntensity = 0.1 + Math.abs(Math.sin(time * 3 + i)) * 0.3;
      });
    }

    // Play torus pulse
    if (torusRef.current) {
      torusMat.opacity = opacity * Math.max(0, stripT - 0.3);
      if (!reducedMotion) {
        torusRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.06);
        torusMat.emissiveIntensity = 1 + Math.sin(time * 2) * 0.5;
        torusRef.current.rotation.y += 0.008;
      }
    }

    if (!reducedMotion && isActive && scale === 1)
      groupRef.current.position.y = Math.sin(time * 0.45) * 0.07;
  });

  useEffect(() => () => {
    bodyMat.dispose(); stripeMat.dispose();
    frameMats.forEach(m => m.dispose()); torusMat.dispose();
  }, []);

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Clapperboard */}
      <group position={[0, 0.4, 0]}>
        <mesh material={bodyMat} position={[0, -0.1, 0]}>
          <boxGeometry args={[2.4, 0.8, 0.12]} />
        </mesh>
        <mesh ref={clapTopRef} material={bodyMat} position={[0, 0.5, 0]}>
          <boxGeometry args={[2.4, 0.6, 0.1]} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} material={i % 2 === 0 ? bodyMat : stripeMat}
            position={[-0.8 + i * 0.42, 0.5, 0.06]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.15, 0.65, 0.01]} />
          </mesh>
        ))}
      </group>

      {/* Film frames */}
      <group ref={stripRef}>
        {Array.from({ length: FRAME_COUNT }).map((_, i) => (
          <mesh key={i} material={frameMats[i]}>
            <boxGeometry args={[0.95, 1.3, 0.04]} />
          </mesh>
        ))}
      </group>

      {/* Play torus */}
      <mesh ref={torusRef} material={torusMat} position={[0, -0.2, 0.5]}>
        <torusGeometry args={[0.55, 0.06, 12, 40]} />
      </mesh>
      {/* Triangle */}
      <mesh position={[0.12, -0.2, 0.5]}>
        <coneGeometry args={[0.2, 0.32, 3]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}
