import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { PARTICLE_COUNTS } from '../../lib/quality';

const PALETTE = ['#6c42ed','#0891b2','#e11d5a','#0d9488','#d97706','#a78bfa'];

/** Fibonacci sphere point */
function eTargets(count: number): THREE.Vector3[] {
  const targets: THREE.Vector3[] = [];
  const cellW = 0.28, cellH = 0.28;
  const rows: [number, number][] = [
    [0,5],[0,1],[0,1],[0,1],[0,4],[0,1],[0,1],[0,1],[0,5],
  ];
  for (let row = 0; row < rows.length; row++) {
    const [cs, ce] = rows[row];
    for (let col = cs; col < ce; col++)
      targets.push(new THREE.Vector3((col-2)*cellW, (row-4)*cellH, 0));
  }
  while (targets.length < count) {
    const a = Math.random()*Math.PI*2, r = 1.5 + Math.random()*1.2;
    targets.push(new THREE.Vector3(Math.cos(a)*r*0.5+(Math.random()-0.5), Math.sin(a)*r, (Math.random()-0.5)*0.5));
  }
  return targets.slice(0, count);
}

export default function BrandParticles() {
  const groupRef  = useRef<THREE.Group>(null!);
  const partRef   = useRef<THREE.Points>(null!);
  const sphRefs   = useRef<THREE.Mesh[]>([]);

  const quality = useStore((s) => s.quality);
  const activeSection  = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);
  const reducedMotion  = useStore((s) => s.reducedMotion);
  const isActive = activeSection === 'branding';

  const COUNT = PARTICLE_COUNTS[quality];

  const { chaosPts, targetPts, colorArr } = useMemo(() => {
    const chaosPts = Array.from({ length: COUNT }, () =>
      new THREE.Vector3((Math.random()-0.5)*12, (Math.random()-0.5)*12, (Math.random()-0.5)*8));
    const targetPts = eTargets(COUNT);
    const colorArr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const c = new THREE.Color(PALETTE[i % PALETTE.length]);
      colorArr[i*3]=c.r; colorArr[i*3+1]=c.g; colorArr[i*3+2]=c.b;
    }
    return { chaosPts, targetPts, colorArr };
  }, [COUNT]);

  const geo = useMemo(() => {
    const buf = new Float32Array(COUNT * 3);
    chaosPts.forEach((p, i) => { buf[i*3]=p.x; buf[i*3+1]=p.y; buf[i*3+2]=p.z; });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(buf, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));
    return g;
  }, [COUNT, chaosPts, colorArr]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: quality === 'high' ? 0.05 : 0.07, vertexColors: true,
    transparent: true, opacity: 0, sizeAttenuation: true, depthWrite: false,
  }), [quality]);

  const sphMats = useMemo(() =>
    PALETTE.map(hex => new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: 0.6,
      roughness: 0.15, metalness: 0.5, transparent: true, opacity: 0,
    })), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const prog = isActive ? sectionProgress : 0;
    const time = state.clock.elapsedTime;

    let opacity = 0, scale = 0.88;
    if (prog < 0.15)      { opacity = prog/0.15;        scale = 0.88 + 0.12*(prog/0.15); }
    else if (prog < 0.85) { opacity = 1;                scale = 1; }
    else                  { opacity = 1-(prog-0.85)/0.15; scale = 1-0.08*((prog-0.85)/0.15); }
    if (reducedMotion)    { opacity = isActive ? 1 : 0; scale = 1; }

    groupRef.current.visible = opacity > 0.01;
    groupRef.current.scale.setScalar(scale);
    mat.opacity = opacity * 0.9;

    const morphT = Math.max(0, Math.min(1, (prog - 0.1) / 0.75));
    // Cubic ease in-out
    const eased = morphT < 0.5 ? 4*morphT*morphT*morphT : 1 - Math.pow(-2*morphT+2,3)/2;

    if (partRef.current) {
      const pa = partRef.current.geometry.attributes.position;
      const arr = pa.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i*3;
        arr[i3]   = THREE.MathUtils.lerp(chaosPts[i].x, targetPts[i].x, eased);
        arr[i3+1] = THREE.MathUtils.lerp(chaosPts[i].y, targetPts[i].y, eased);
        arr[i3+2] = THREE.MathUtils.lerp(chaosPts[i].z, targetPts[i].z, eased);
      }
      pa.needsUpdate = true;
    }

    sphRefs.current.forEach((sph, i) => {
      if (!sph) return;
      const settleT = Math.max(0, Math.min(1, (prog - 0.5) / 0.35));
      const angle = (i / PALETTE.length) * Math.PI * 2 + time * 0.4;
      sph.position.set(
        THREE.MathUtils.lerp(Math.cos(angle)*3.5, (i - PALETTE.length/2 + 0.5)*0.7, settleT),
        THREE.MathUtils.lerp(Math.sin(angle)*1.5, -1.8 + (reducedMotion ? 0 : Math.sin(time*0.8+i*0.9)*0.04), settleT),
        THREE.MathUtils.lerp(Math.sin(angle*0.7), 0, settleT),
      );
      sphMats[i].opacity = opacity * Math.max(0, morphT - 0.2);
    });
  });

  useEffect(() => () => { mat.dispose(); geo.dispose(); sphMats.forEach(m => m.dispose()); }, []);

  return (
    <group ref={groupRef} position={[-2, 0, 0]}>
      <points ref={partRef} geometry={geo} material={mat} />
      {PALETTE.map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) sphRefs.current[i] = el as THREE.Mesh; }} material={sphMats[i]}>
          <sphereGeometry args={[0.18, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
}
