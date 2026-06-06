import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { PARTICLE_COUNTS } from '../../lib/quality';

const ACCENT = '#6c42ed';
const ACCENT_COLOR = new THREE.Color(ACCENT);

const METRICS = [
  { label: 'ROAS', value: '4.2x', orbitRadius: 2.8, orbitPhase: 0, orbitSpeed: 0.4 },
  { label: 'CTR', value: '+127%', orbitRadius: 2.8, orbitPhase: (Math.PI * 2) / 3, orbitSpeed: 0.4 },
  { label: 'Reach', value: '12M+', orbitRadius: 2.8, orbitPhase: (Math.PI * 4) / 3, orbitSpeed: 0.4 },
];

function buildCurve() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.5, -1.5, 0),
    new THREE.Vector3(-2, -0.5, 0.5),
    new THREE.Vector3(-0.5, 0.3, 0),
    new THREE.Vector3(1, 1.2, 0.3),
    new THREE.Vector3(2.5, 2.0, 0),
    new THREE.Vector3(3.5, 2.8, -0.2),
  ]);
}

export default function MarketingConstellation() {
  const groupRef = useRef<THREE.Group>(null!);
  const tubeRef = useRef<THREE.Mesh>(null!);
  const particleRef = useRef<THREE.Points>(null!);
  const cardRefs = useRef<THREE.Group[]>([]);

  const quality = useStore((s) => s.quality);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const activeSection = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);

  const curve = useMemo(buildCurve, []);
  const particleCount = PARTICLE_COUNTS[quality];

  const chaosPos = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 2;
      arr.push(new THREE.Vector3(Math.cos(angle) * r - 1, Math.sin(angle) * r, (Math.random() - 0.5) * 2));
    }
    return arr;
  }, [particleCount]);

  const particleGeo = useMemo(() => {
    const buf = new Float32Array(particleCount * 3);
    chaosPos.forEach((p, i) => { buf[i*3]=p.x; buf[i*3+1]=p.y; buf[i*3+2]=p.z; });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(buf, 3));
    return g;
  }, [particleCount, chaosPos]);

  const tubeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT_COLOR, emissive: ACCENT_COLOR, emissiveIntensity: 0.8,
    roughness: 0.2, metalness: 0.5, transparent: true, opacity: 0,
  }), []);

  const particleMat = useMemo(() => new THREE.PointsMaterial({
    size: quality === 'high' ? 0.045 : 0.065, color: ACCENT_COLOR,
    transparent: true, opacity: 0, sizeAttenuation: true, depthWrite: false,
  }), [quality]);

  const cardMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1e1b3a), emissive: ACCENT_COLOR, emissiveIntensity: 0.3,
    transparent: true, opacity: 0, roughness: 0.2, metalness: 0.5,
  }), []);

  const isActive = activeSection === 'marketing';

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
    tubeMat.opacity = opacity * 0.9;
    cardMat.opacity = opacity;
    particleMat.opacity = opacity * 0.6;

    const drawT = Math.max(0, Math.min(1, (prog - 0.15) / 0.7));

    // Rebuild tube geometry based on draw progress
    if (tubeRef.current && drawT > 0.02) {
      const seg = Math.max(4, Math.floor(64 * drawT));
      const pts = curve.getPoints(seg);
      const partialCurve = new THREE.CatmullRomCurve3(pts.slice(0, Math.max(2, Math.floor(pts.length * drawT))));
      if (partialCurve.points.length >= 2) {
        tubeRef.current.geometry.dispose();
        tubeRef.current.geometry = new THREE.TubeGeometry(partialCurve, seg, 0.04, 8, false);
      }
    }

    // Metric card orbits
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const m = METRICS[i];
      const snapT = Math.max(0, (drawT - 0.6) / 0.4);
      const angle = m.orbitPhase + time * m.orbitSpeed * (reducedMotion ? 0 : 1);
      card.position.set(
        Math.cos(angle) * m.orbitRadius * (1 - snapT * 0.3),
        Math.sin(angle) * m.orbitRadius * 0.5,
        Math.sin(angle) * m.orbitRadius * 0.3,
      );
      card.rotation.y = THREE.MathUtils.lerp(card.rotation.y, 0, 0.05 + snapT * 0.1);
      card.scale.setScalar(opacity * drawT);
    });

    // Particle flow toward curve end
    if (particleRef.current && !reducedMotion && drawT > 0.1) {
      const tgt = curve.getPoint(1);
      const pos = particleRef.current.geometry.attributes.position;
      const arr = pos.array as Float32Array;
      const flow = 0.003 * (0.3 + drawT * 0.5);
      for (let i = 0; i < Math.min(particleCount, 300); i++) {
        const i3 = i * 3;
        arr[i3]   += (tgt.x - arr[i3])   * flow;
        arr[i3+1] += (tgt.y - arr[i3+1]) * flow;
        arr[i3+2] += (tgt.z - arr[i3+2]) * flow * 1.5;
        if (Math.abs(arr[i3] - tgt.x) < 0.4 && Math.abs(arr[i3+1] - tgt.y) < 0.4) {
          const a = Math.random() * Math.PI * 2;
          const r = 2 + Math.random() * 2;
          arr[i3] = Math.cos(a) * r - 1;
          arr[i3+1] = Math.sin(a) * r;
          arr[i3+2] = (Math.random() - 0.5) * 2;
        }
      }
      pos.needsUpdate = true;
    }

    if (!reducedMotion && isActive && scale === 1) {
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.08;
    }
  });

  useEffect(() => () => {
    tubeMat.dispose(); cardMat.dispose();
    particleMat.dispose(); particleGeo.dispose();
  }, []);

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      <mesh ref={tubeRef} material={tubeMat}>
        <tubeGeometry args={[curve, 8, 0.04, 8, false]} />
      </mesh>
      <points ref={particleRef} geometry={particleGeo} material={particleMat} />

      {METRICS.map((m, i) => (
        <group key={m.label} ref={(el) => { if (el) cardRefs.current[i] = el; }}>
          <mesh material={cardMat}><boxGeometry args={[1.1, 0.55, 0.04]} /></mesh>
          <mesh position={[-0.55, 0, 0.025]}>
            <boxGeometry args={[0.04, 0.55, 0.04]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1} />
          </mesh>
          <Text position={[0.05, 0.06, 0.05]} fontSize={0.2} color="#f4f4f6" anchorX="center" anchorY="middle">{m.value}</Text>
          <Text position={[0.05, -0.1, 0.05]} fontSize={0.1} color="#c0bcc8" anchorX="center" anchorY="middle">{m.label}</Text>
        </group>
      ))}

      <mesh position={[-3.5, -1.5, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      <mesh position={[3.5, 2.8, -0.2]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2.5} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
