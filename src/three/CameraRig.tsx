import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import type { ActiveSection } from '../store/useStore';

/**
 * Camera rig driven by activeSection (Zustand).
 * Each service section maps directly to a camera station so the 3D
 * object always lands precisely in the blank column regardless of
 * where on the total page scroll we are.
 *
 * Column offset formula at z=11, fov_y=58°, aspect˜16/9:
 *   halfFovX ˜ 44.6°  ?  tan(44.6°) ˜ 0.987
 *   offset = 0.5 × 11 × 0.987 ˜ 5.4 units
 *
 * Object world x-positions:
 *   marketing (right blank): x= 2    ? cam_x =  2   - 5.4 = -3.4
 *   content   (left  blank): x=-1.5  ? cam_x = -1.5 + 5.4 =  3.9
 *   video     (right blank): x= 2    ? cam_x =  2   - 5.4 = -3.4
 *   websites  (left  blank): x=-1    ? cam_x = -1   + 5.4 =  4.4
 *   software  (right blank): x= 1.5  ? cam_x =  1.5 - 5.4 = -3.9
 *   branding  (left  blank): x=-2    ? cam_x = -2   + 5.4 =  3.4
 */
type Station = { pos: THREE.Vector3; tgt: THREE.Vector3; fov: number };

const CAM: Record<NonNullable<ActiveSection>, Station> = {
  hero:     { pos: new THREE.Vector3( 0.0,  0.0, 14), tgt: new THREE.Vector3( 0.0, 0, 0), fov: 60 },
  marketing:{ pos: new THREE.Vector3(-3.4,  0.6, 11), tgt: new THREE.Vector3(-3.4, 0, 0), fov: 58 },
  content:  { pos: new THREE.Vector3( 3.9,  0.4, 11), tgt: new THREE.Vector3( 3.9, 0, 0), fov: 58 },
  video:    { pos: new THREE.Vector3(-3.4,  0.8, 11), tgt: new THREE.Vector3(-3.4, 0, 0), fov: 56 },
  websites: { pos: new THREE.Vector3( 4.4, -0.4, 11), tgt: new THREE.Vector3( 4.4, 0, 0), fov: 57 },
  software: { pos: new THREE.Vector3(-3.9,  0.4, 11), tgt: new THREE.Vector3(-3.9, 0, 0), fov: 57 },
  branding: { pos: new THREE.Vector3( 3.4, -0.4, 11), tgt: new THREE.Vector3( 3.4, 0, 0), fov: 55 },
  process:  { pos: new THREE.Vector3( 0.0,  0.0, 14), tgt: new THREE.Vector3( 0.0, 0, 0), fov: 60 },
  proof:    { pos: new THREE.Vector3( 0.0,  0.0, 14), tgt: new THREE.Vector3( 0.0, 0, 0), fov: 60 },
  contact:  { pos: new THREE.Vector3( 0.0,  0.0, 14), tgt: new THREE.Vector3( 0.0, 0, 0), fov: 60 },
};

const FALLBACK: Station = CAM.hero;

export default function CameraRig() {
  const { camera } = useThree();
  const activeSection = useStore((s) => s.activeSection);
  const reducedMotion = useStore((s) => s.reducedMotion);

  const curPos = useRef(new THREE.Vector3(0, 0, 14));
  const curTgt = useRef(new THREE.Vector3(0, 0, 0));
  const curFov = useRef(60);

  useFrame((_, delta) => {
    const station = (activeSection && CAM[activeSection]) ?? FALLBACK;
    const k = reducedMotion ? 1 : Math.min(1, delta * 2.8);

    curPos.current.lerp(station.pos, k);
    curTgt.current.lerp(station.tgt, k);
    curFov.current += (station.fov - curFov.current) * k;

    camera.position.copy(curPos.current);
    camera.lookAt(curTgt.current);
    (camera as THREE.PerspectiveCamera).fov = curFov.current;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  return null;
}
