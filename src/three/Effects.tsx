import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/**
 * Postprocessing — high quality tier only.
 * Bloom on emissive objects, subtle vignette, nearly imperceptible CA.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.6} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette offset={0.4} darkness={0.5} blendFunction={BlendFunction.NORMAL} />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0005, 0.0005)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}
