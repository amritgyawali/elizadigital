import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { SERVICES } from '../data/services';

/**
 * Scene lighting: ambient + key directional + rim + accent point light.
 * Accent color transitions per active service.
 */
export default function Lighting() {
  const accentRef = useRef<THREE.PointLight>(null!);
  const current = useRef(new THREE.Color(SERVICES[0].accentHex));
  const target = useRef(new THREE.Color(SERVICES[0].accentHex));
  const scrollProgress = useStore((s) => s.scrollProgress);

  useFrame((_, delta) => {
    // Map scroll to service index
    const svcStart = 0.1;
    const svcSpan = 0.12;
    const rawIdx = (scrollProgress - svcStart) / svcSpan;
    const idx = Math.max(0, Math.min(SERVICES.length - 1, Math.floor(rawIdx)));
    target.current.set(SERVICES[idx].accentHex);
    current.current.lerp(target.current, delta * 2);
    if (accentRef.current) accentRef.current.color.copy(current.current);
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#c0c0d8" />
      <directionalLight position={[6, 8, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, -2, -6]} intensity={0.5} color="#8090c0" />
      <pointLight
        ref={accentRef}
        position={[3, 2, 4]}
        intensity={2.5}
        distance={20}
        decay={2}
        color={SERVICES[0].accentHex}
      />
    </>
  );
}
