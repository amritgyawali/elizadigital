import { useStore } from '../../store/useStore';

/**
 * Custom cursor disabled — system default cursor is used.
 */
export default function CustomCursor() {
  useStore((s) => s.reducedMotion); // keep store subscription intact
  return null;
}

