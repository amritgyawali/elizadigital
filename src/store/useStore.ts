import { create } from 'zustand';
import { ServiceKey } from '../data/services';

export type QualityTier = 'high' | 'med' | 'low';
export type ActiveSection = 'hero' | ServiceKey | 'process' | 'proof' | 'contact' | null;

interface StoreState {
  // Scroll
  scrollProgress: number; // 0–1 entire page
  activeSection: ActiveSection;
  sectionProgress: number; // 0–1 within active service scene

  // 3D / Quality
  quality: QualityTier;
  reducedMotion: boolean;
  webGLAvailable: boolean;

  // UI
  menuOpen: boolean;
  loaderDone: boolean;

  // Actions
  setScrollProgress: (v: number) => void;
  setActiveSection: (s: ActiveSection) => void;
  setSectionProgress: (v: number) => void;
  setQuality: (q: QualityTier) => void;
  setReducedMotion: (v: boolean) => void;
  setWebGLAvailable: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setLoaderDone: (v: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  scrollProgress: 0,
  activeSection: null,
  sectionProgress: 0,
  quality: 'high',
  reducedMotion: false,
  webGLAvailable: true,
  menuOpen: false,
  loaderDone: false,

  setScrollProgress: (v) => set({ scrollProgress: v }),
  setActiveSection: (s) => set({ activeSection: s }),
  setSectionProgress: (v) => set({ sectionProgress: v }),
  setQuality: (q) => set({ quality: q }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setWebGLAvailable: (v) => set({ webGLAvailable: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  setLoaderDone: (v) => set({ loaderDone: v }),
}));
