import { create } from "zustand";

export type AgeMode = "kid" | "teen" | "adult" | null;
export type AppPhase = "greeting" | "name" | "main" | "listening" | "result";
export type Verdict = "ark" | "calf" | null;

// ── Free trial tracking ───────────────────────────────────────────────────────
const TRIAL_KEY        = "cs_trial_uses";
export const TRIAL_LIMIT = 5;

export function getTrialUsesLeft(): number {
  try {
    const val = localStorage.getItem(TRIAL_KEY);
    if (val === null) return TRIAL_LIMIT;
    const n = parseInt(val, 10);
    return isNaN(n) ? TRIAL_LIMIT : Math.max(0, n);
  } catch { return TRIAL_LIMIT; }
}

export function decrementTrial(): number {
  const left = getTrialUsesLeft();
  const next = Math.max(0, left - 1);
  try { localStorage.setItem(TRIAL_KEY, String(next)); } catch {}
  return next;
}

export function isTrialExhausted(): boolean {
  return getTrialUsesLeft() <= 0;
}

export function resetTrial(): void {
  try { localStorage.setItem(TRIAL_KEY, String(TRIAL_LIMIT)); } catch {}
}

export type AnalysisCategory = {
  score: number;
  label: string;
};

export type AnalysisData = {
  signalClarityScore: number;
  bpmProfile: AnalysisCategory;
  lyricalDoctrine: AnalysisCategory;
  tranceInducement: AnalysisCategory;
  loopRepetition: AnalysisCategory;
  culturalDegradation: AnalysisCategory;
  rhythmicArchetype: AnalysisCategory;
};

// ── Minimum "Gad listens" duration ────────────────────────────────────────────
// Enforced floor so the verdict never feels perfunctory: at least 45s, scaled
// to 25% of the track's length for longer songs, capped at 120s so nobody
// waits more than two minutes. Default (45) covers flows where the track's
// duration isn't known yet (e.g. before audio metadata loads).
export const DEFAULT_MIN_LISTEN_SECONDS = 45;

interface AppState {
  userName: string;
  ageMode: AgeMode;
  phase: AppPhase;
  verdict: Verdict;
  isKidMode: boolean;
  voiceEnabled: boolean;
  songFileName: string;
  audioFileUrl: string | null;
  analysisData: AnalysisData | null;
  minListenSeconds: number;
  setUserName: (name: string) => void;
  setAgeMode: (mode: AgeMode) => void;
  setPhase: (phase: AppPhase) => void;
  setVerdict: (verdict: Verdict) => void;
  setIsKidMode: (kid: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setSongFileName: (name: string) => void;
  setAudioFileUrl: (url: string | null) => void;
  setAnalysisData: (data: AnalysisData | null) => void;
  setMinListenSeconds: (seconds: number) => void;
  reset: () => void;
}

export const useAppState = create<AppState>((set) => ({
  userName: "",
  ageMode: null,
  phase: "greeting",
  verdict: null,
  isKidMode: false,
  voiceEnabled: true,
  songFileName: "",
  audioFileUrl: null,
  analysisData: null,
  minListenSeconds: DEFAULT_MIN_LISTEN_SECONDS,
  setUserName: (name) => set({ userName: name }),
  setAgeMode: (mode) => set({ ageMode: mode, isKidMode: mode === "kid" }),
  setPhase: (phase) => set({ phase }),
  setVerdict: (verdict) => set({ verdict }),
  setIsKidMode: (kid) => set({ isKidMode: kid }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setSongFileName: (name) => set({ songFileName: name }),
  setAudioFileUrl: (url) => set({ audioFileUrl: url }),
  setAnalysisData: (data) => set({ analysisData: data }),
  setMinListenSeconds: (seconds) => set({ minListenSeconds: seconds }),
  reset: () =>
    set({
      userName: "",
      ageMode: null,
      phase: "greeting",
      verdict: null,
      isKidMode: false,
      songFileName: "",
      audioFileUrl: null,
      analysisData: null,
      minListenSeconds: DEFAULT_MIN_LISTEN_SECONDS,
    }),
}));
