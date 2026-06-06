import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const ACCENT = '#d97706';
const ACCENT_COLOR = new THREE.Color(ACCENT);

function spherePt(i: number, total: number, r: number) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return new THREE.Vector3(Math.sin(phi)*Math.cos(theta)*r, Math.cos(phi)*r, Math.sin(phi)*Math.sin(theta)*r);
}

const GLYPHS = ['</', '{}', '/>', '()', '[]', '//'];

export default function SystemGraph() {
  const groupRef  = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const edgesRef  = useRef<THREE.LineSegments>(null!);
  const gearRef   = useRef<THREE.Mesh>(null!);
  const glyphRefs = useRef<THREE.Group[]>([]);

  const quality = useStore((s) => s.quality);
  const activeSection  = useStore((s) => s.activeSection);
  const sectionProgress = useStore((s) => s.sectionProgress);
  const reducedMotion  = useStore((s) => s.reducedMotion);
  const isActive = activeSection === 'software';

  const R = 2.2;
  const N = quality === 'high' ? 80 : quality === 'med' ? 40 : 20;

  const spherePts = useMemo(() => Array.from({ length: N }, (_, i) => spherePt(i, N, R)), [N]);
  const chaosPts  = useMemo(() => Array.from({ length: N }, () =>
    new THREE.Vector3((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10)), [N]);

  const pointsGeo = useMemo(() => {
    const buf = new Float32Array(N * 3);
    chaosPts.forEach((p, i) => { buf[i*3]=p.x; buf[i*3+1]=p.y; buf[i*3+2]=p.z; });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(buf, 3));
    return g;
  }, [N, chaosPts]);

  const edgesGeo = useMemo(() => {
    const pairs: number[] = [];
    for (let i = 0; i < N; i++) for (let j = i+1; j < N; j++) {
      if (spherePts[i].distanceTo(spherePts[j]) < R * 0.7)
        pairs.push(spherePts[i].x,spherePts[i].y,spherePts[i].z, spherePts[j].x,spherePts[j].y,spherePts[j].z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pairs), 3));
    return g;
  }, [N, spherePts]);

  const pointMat = useMemo(() => new THREE.PointsMaterial({
    size: 0.08, color: ACCENT_COLOR, transparent: true, opacity: 0, sizeAttenuation: true,
  }), []);
  const edgeMat = useMemo(() => new THREE.LineBasicMaterial({
    color: ACCENT_COLOR, transparent: true, opacity: 0,
  }), []);
  const gearMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: ACCENT_COLOR, emissive: ACCENT_COLOR, emissiveIntensity: 0.4,
    roughness: 0.4, metalness: 0.9, transparent: true, opacity: 0, wireframe: true,
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

    const convergeT = Math.max(0, Math.min(1, (prog - 0.1) / 0.7));
    if (pointsRef.current) {
      const pa = pointsRef.current.geometry.attributes.position;
      const arr = pa.array as Float32Array;
      for (let i = 0; i < N; i++) {
        const i3 = i*3;
        arr[i3]   = THREE.MathUtils.lerp(chaosPts[i].x, spherePts[i].x, convergeT);
        arr[i3+1] = THREE.MathUtils.lerp(chaosPts[i].y, spherePts[i].y, convergeT);
        arr[i3+2] = THREE.MathUtils.lerp(chaosPts[i].z, spherePts[i].z, convergeT);
      }
      pa.needsUpdate = true;
      pointMat.opacity = opacity;
    }

    const edgeT = Math.max(0, Math.min(1, (prog - 0.5) / 0.3));
    edgeMat.opacity = opacity * edgeT * 0.6;

    if (!reducedMotion) groupRef.current.rotation.y += 0.003;
    if (gearRef.current) {
      gearMat.opacity = opacity * edgeT;
      if (!reducedMotion) gearRef.current.rotation.z -= 0.005;
    }

    glyphRefs.current.forEach((g, i) => {
      if (!g) return;
      const angle = (i / GLYPHS.length) * Math.PI * 2 + time * 0.3;
      g.position.set(Math.cos(angle) * (R+0.8), Math.sin(angle*0.7)*0.6, Math.sin(angle)*(R+0.8));
      g.rotation.y = -angle;
      const gT = Math.max(0, Math.min(1, (prog - 0.6) / 0.2));
      g.scale.setScalar(opacity * gT * (reducedMotion ? 0 : 1));
    });
  });

  useEffect(() => () => { pointMat.dispose(); edgeMat.dispose(); gearMat.dispose(); pointsGeo.dispose(); edgesGeo.dispose(); }, []);

  return (
    <group ref={groupRef} position={[1.5, 0, 0]}>
      <points ref={pointsRef} geometry={pointsGeo} material={pointMat} />
      <lineSegments ref={edgesRef} geometry={edgesGeo} material={edgeMat} />
      <mesh ref={gearRef} material={gearMat}>
        <torusGeometry args={[R + 0.4, 0.04, 6, 64]} />
      </mesh>
      {GLYPHS.map((label, i) => (
        <group key={label+i} ref={(el) => { if (el) glyphRefs.current[i] = el; }}>
          <Text fontSize={0.22} color={ACCENT} anchorX="center" anchorY="middle">{label}</Text>
        </group>
      ))}
    </group>
  );
}
