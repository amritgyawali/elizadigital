import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { useStore } from '../store/useStore';
import CameraRig from './CameraRig';
import Lighting from './Lighting';
import Effects from './Effects';
import MarketingConstellation from './objects/MarketingConstellation';
import ContentPath from './objects/ContentPath';
import VideoReel from './objects/VideoReel';
import DeviceFan from './objects/DeviceFan';
import SystemGraph from './objects/SystemGraph';
import BrandParticles from './objects/BrandParticles';

/**
 * Single persistent <Canvas> fixed behind all DOM content.
 * One WebGL context for the entire page.
 */
export default function Scene() {
  const quality = useStore((s) => s.quality);
  const setQuality = useStore((s) => s.setQuality);
  const reducedMotion = useStore((s) => s.reducedMotion);

  return (
    <div
      id="canvas-root"
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, quality === 'low' ? 1.5 : 2]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: 60, near: 0.1, far: 200, position: [0, 0, 14] }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onDecline={() => setQuality('med')}
          onIncline={() => {
            if (quality === 'low') setQuality('med');
          }}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <CameraRig />
        <Lighting />

        <Suspense fallback={null}>
          <MarketingConstellation />
          <ContentPath />
          <VideoReel />
          <DeviceFan />
          <SystemGraph />
          <BrandParticles />
        </Suspense>

        {quality === 'high' && !reducedMotion && <Effects />}
      </Canvas>
    </div>
  );
}
