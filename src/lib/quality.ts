import { QualityTier } from '../store/useStore';

/**
 * Detect GPU/device quality tier by probing:
 * - navigator.hardwareConcurrency (CPU cores proxy)
 * - devicePixelRatio
 * - GPU renderer string via WebGL debug extension
 * - isMobile heuristic
 *
 * Returns 'high' | 'med' | 'low'
 */
export function detectQualityTier(): QualityTier {
  // Fast mobile check
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency ?? 4;
  const dpr = window.devicePixelRatio ?? 1;

  // Try to get GPU renderer
  let gpuRenderer = '';
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        gpuRenderer = gl
          .getParameter(ext.UNMASKED_RENDERER_WEBGL)
          .toLowerCase();
      }
    }
  } catch {
    // silently ignore
  }

  // Low-end GPU heuristics
  const isLowGPU =
    gpuRenderer.includes('intel') ||
    gpuRenderer.includes('swiftshader') ||
    gpuRenderer.includes('llvmpipe') ||
    gpuRenderer.includes('mali-4') ||
    gpuRenderer.includes('mali-t');

  if (isMobile || isLowGPU || cores <= 2) return 'low';
  if (cores <= 4 || dpr < 1.5) return 'med';
  return 'high';
}

/** Check if WebGL is available at all */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    );
  } catch {
    return false;
  }
}

/** Particle count by quality tier */
export const PARTICLE_COUNTS: Record<QualityTier, number> = {
  high: 1200,
  med: 600,
  low: 200,
};

/** Whether postprocessing should run */
export function shouldRunPostFX(quality: QualityTier): boolean {
  return quality === 'high';
}
