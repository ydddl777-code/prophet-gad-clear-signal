import { create } from "zustand";

export type AgeMode = "kid" | "teen" | "adult" | null;
export type AppPhase = "greeting" | "name" | "main" | "listening" | "result";
export type Verdict = "ark" | "calf" | null;

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
  setUserName: (name: string) => void;
  setAgeMode: (mode: AgeMode) => void;
  setPhase: (phase: AppPhase) => void;
  setVerdict: (verdict: Verdict) => void;
  setIsKidMode: (kid: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setSongFileName: (name: string) => void;
  setAudioFileUrl: (url: string | null) => void;
  setAnalysisData: (data: AnalysisData | null) => void;
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
  setUserName: (name) => set({ userName: name }),
  setAgeMode: (mode) => set({ ageMode: mode, isKidMode: mode === "kid" }),
  setPhase: (phase) => set({ phase }),
  setVerdict: (verdict) => set({ verdict }),
  setIsKidMode: (kid) => set({ isKidMode: kid }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setSongFileName: (name) => set({ songFileName: name }),
  setAudioFileUrl: (url) => set({ audioFileUrl: url }),
  setAnalysisData: (data) => set({ analysisData: data }),
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
    }),
}));
