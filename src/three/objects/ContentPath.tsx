import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const ACCENT = '#0891b2';
const ACCENT_COLOR = new THREE.Color(ACCENT);

const CARDS = [
  { label: 'Blog',    t: 0.2,  off: [0.5,  0.8,  0] as [number,number,number] },
  { label: 'Caption', t: 0.4,  off: [-0.6, 0.5,  0.3] as [number,number,number] },
  { label: 'Script',  t: 0.62, off: [0.7, -0.4,  0] as [number,number,number] },
  { label: 'Post',    t: 0.82, off: [-0.5,-0.7,  0.2] as [number,number,number] },
];

const CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4, -2, 0),
  new THREE.Vector3(-2, 0.5, 0.5),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(2, 0, -0.3),
  new THREE.Vector3(3.5, 1.5, 0),
]);

export default function ContentPath() {
  const groupRef  = useRef<THREE.Group>(null!);
  const nibRef    = useRef<THREE.Group>(null!);
  const trailRef  = useRef<THREE.Mesh>(null!);
  const cardRefs  = useRef<THREE.Group[]>([]);

  const activeSection  = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);
  const reducedMotion  = useStore((s) => s.reducedMotion);
  const isActive = activeSection === 'content';

  const nibMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xd0e8ff), emissive: ACCENT_COLOR, emissiveIntensity: 0.5,
    metalness: 0.8, roughness: 0.15, transparent: true, opacity: 0,
  }), []);

  const trailMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x0891b2), emissive: new THREE.Color(0x0891b2),
    emissiveIntensity: 0.9, transparent: true, opacity: 0,
  }), []);

  const cardMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x082c3a), emissive: ACCENT_COLOR, emissiveIntensity: 0.2,
    transparent: true, opacity: 0, roughness: 0.3, metalness: 0.4,
  }), []);

  useFrame((state) => {
    if (!groupRef.current || !nibRef.current) return;
    const prog = isActive ? sectionProgress : 0;
    const time = state.clock.elapsedTime;

    let opacity = 0, scale = 0.9;
    if (prog < 0.15)      { opacity = prog/0.15;        scale = 0.9 + 0.1*(prog/0.15); }
    else if (prog < 0.85) { opacity = 1;                scale = 1; }
    else                  { opacity = 1-(prog-0.85)/0.15; scale = 1-0.08*((prog-0.85)/0.15); }
    if (reducedMotion)    { opacity = isActive ? 1 : 0; scale = 1; }

    groupRef.current.visible = opacity > 0.01;
    groupRef.current.scale.setScalar(scale);
    nibMat.opacity  = opacity;
    cardMat.opacity = opacity;

    const nibT = Math.max(0, Math.min(1, (prog - 0.1) / 0.75));
    const nibPt  = CURVE.getPoint(nibT);
    const nibTan = CURVE.getTangent(nibT).normalize();
    nibRef.current.position.copy(nibPt);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), nibTan);
    nibRef.current.quaternion.slerp(q, 0.15);

    // Rebuild trail based on nib progress
    if (trailRef.current && nibT > 0.02) {
      const pts = CURVE.getPoints(Math.max(2, Math.floor(20 * nibT)));
      if (pts.length >= 2) {
        const tc = new THREE.CatmullRomCurve3(pts);
        trailRef.current.geometry.dispose();
        trailRef.current.geometry = new THREE.TubeGeometry(tc, Math.max(3, Math.floor(40*nibT)), 0.025, 6, false);
        trailMat.opacity = opacity * 0.85;
      }
    }

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const c = CARDS[i];
      const spawnT = Math.max(0, Math.min(1, (nibT - c.t) / 0.12));
      const cardPt = CURVE.getPoint(c.t);
      card.position.set(cardPt.x + c.off[0], cardPt.y + c.off[1], cardPt.z + c.off[2]);
      card.scale.setScalar(spawnT * opacity);
      if (!reducedMotion && spawnT > 0.9) {
        card.position.y += Math.sin(time * 0.8 + i * 1.5) * 0.05;
        card.rotation.y  = Math.sin(time * 0.3 + i * 0.7) * 0.15;
      }
    });

    if (!reducedMotion && isActive && scale === 1)
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.06;
  });

  useEffect(() => () => { nibMat.dispose(); trailMat.dispose(); cardMat.dispose(); }, []);

  return (
    <group ref={groupRef} position={[-1.5, 0, 0]}>
      <mesh ref={trailRef} material={trailMat}>
        <tubeGeometry args={[CURVE, 4, 0.025, 6, false]} />
      </mesh>

      <group ref={nibRef}>
        <mesh material={nibMat} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.06, 0.4, 6]} />
        </mesh>
        <mesh material={nibMat} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 6]} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={3} transparent opacity={0.9} />
        </mesh>
      </group>

      {CARDS.map((c, i) => (
        <group key={c.label} ref={(el) => { if (el) cardRefs.current[i] = el; }}>
          <mesh material={cardMat}><boxGeometry args={[1.2, 0.5, 0.04]} /></mesh>
          <mesh position={[0, 0.26, 0.025]}>
            <boxGeometry args={[1.2, 0.04, 0.04]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.5} />
          </mesh>
          <Text position={[0, 0, 0.05]} fontSize={0.18} color="#f4f4f6" anchorX="center" anchorY="middle">{c.label}</Text>
        </group>
      ))}
    </group>
  );
}
