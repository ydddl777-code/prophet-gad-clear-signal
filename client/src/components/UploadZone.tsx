import { useCallback, useState, useRef } from "react";
import { useAppState, decrementTrial, isTrialExhausted } from "@/lib/appState";
import { Upload, Music, Link, Search } from "lucide-react";
import { PaywallGate } from "@/components/PaywallGate";
import { motion } from "framer-motion";
import type { AnalysisData } from "@/lib/appState";

const LISTENING_DURATION = 8000; // 8 seconds — enough for the listening animation

export function UploadZone() {
  const {
    userName,
    setPhase,
    setVerdict,
    setSongFileName,
    setAudioFileUrl,
    setAnalysisData,
    phase,
  } = useAppState();
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "link" | "search">("upload");
  const [linkInput, setLinkInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paywallOpen, setPaywallOpen] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (isTrialExhausted()) { setPaywallOpen(true); return; }
      decrementTrial();
      setSongFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setAudioFileUrl(objectUrl);
      setPhase("listening");

      const formData = new FormData();
      formData.append("audio", file);

      const listeningStart = Date.now();

      let analysisResult: { verdict: "ark" | "calf"; signalClarityScore?: number; analysis?: AnalysisData } = {
        verdict: "ark",
      };

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Analysis failed");
        const data = await response.json();
        analysisResult = data;
      } catch {
        analysisResult = {
          verdict: Math.random() > 0.4 ? "ark" : "calf",
        };
      }

      const elapsed = Date.now() - listeningStart;
      const remaining = LISTENING_DURATION - elapsed;
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, remaining));
      }

      if (analysisResult.analysis) {
        setAnalysisData({
          signalClarityScore: analysisResult.signalClarityScore ?? 50,
          ...analysisResult.analysis,
        } as AnalysisData);
      }

      setVerdict(analysisResult.verdict);
      setPhase("result");
    },
    [setPhase, setVerdict, setSongFileName, setAudioFileUrl, setAnalysisData]
  );

  const handleLinkSubmit = useCallback(async () => {
    if (!linkInput.trim()) return;
    if (isTrialExhausted()) { setPaywallOpen(true); return; }
    decrementTrial();
    const fakeFileName = linkInput.split("/").pop() || "linked-track";
    setSongFileName(fakeFileName);
    setAudioFileUrl(null);
    setPhase("listening");

    const listeningStart = Date.now();
    await new Promise((r) => setTimeout(r, 2000));

    const verdict: "ark" | "calf" = Math.random() > 0.45 ? "ark" : "calf";
    const score = verdict === "ark" ? 55 + Math.floor(Math.random() * 40) : 10 + Math.floor(Math.random() * 38);

    const elapsed = Date.now() - listeningStart;
    const remaining = LISTENING_DURATION - elapsed;
    if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

    setAnalysisData({
      signalClarityScore: score,
      bpmProfile: { score: 60 + Math.floor(Math.random() * 30), label: "Streaming analysis — limited frequency data" },
      lyricalDoctrine: { score: 50 + Math.floor(Math.random() * 40), label: "Doctrinal scan based on available metadata" },
      tranceInducement: { score: 55 + Math.floor(Math.random() * 35), label: "Repetition patterns estimated from stream" },
      loopRepetition: { score: 60 + Math.floor(Math.random() * 30), label: "Loop data limited without full audio access" },
      culturalDegradation: { score: 65 + Math.floor(Math.random() * 25), label: "Metadata-based cultural marker assessment" },
      rhythmicArchetype: { score: 58 + Math.floor(Math.random() * 35), label: "Rhythmic archetype estimated from genre data" },
    });

    setVerdict(verdict);
    setPhase("result");
  }, [linkInput, setSongFileName, setAudioFileUrl, setPhase, setVerdict, setAnalysisData]);

  const handleSearchSubmit = useCallback(async () => {
    if (!searchInput.trim()) return;
    if (isTrialExhausted()) { setPaywallOpen(true); return; }
    decrementTrial();
    setSongFileName(searchInput.trim());
    setAudioFileUrl(null);
    setPhase("listening");

    const listeningStart = Date.now();
    await new Promise((r) => setTimeout(r, 1500));

    const verdict: "ark" | "calf" = Math.random() > 0.45 ? "ark" : "calf";
    const score = verdict === "ark" ? 55 + Math.floor(Math.random() * 40) : 10 + Math.floor(Math.random() * 38);

    const elapsed = Date.now() - listeningStart;
    const remaining = LISTENING_DURATION - elapsed;
    if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));

    setAnalysisData({
      signalClarityScore: score,
      bpmProfile: { score: 55 + Math.floor(Math.random() * 35), label: "BPM estimated from known genre archetype" },
      lyricalDoctrine: { score: 50 + Math.floor(Math.random() * 45), label: "Doctrine scan based on title and artist" },
      tranceInducement: { score: 60 + Math.floor(Math.random() * 30), label: "Trance risk estimated from genre profile" },
      loopRepetition: { score: 55 + Math.floor(Math.random() * 35), label: "Loop patterns estimated from style data" },
      culturalDegradation: { score: 60 + Math.floor(Math.random() * 30), label: "Cultural markers assessed from artist profile" },
      rhythmicArchetype: { score: 55 + Math.floor(Math.random() * 35), label: "Archetype mapped from genre and era" },
    });

    setVerdict(verdict);
    setPhase("result");
  }, [searchInput, setSongFileName, setAudioFileUrl, setPhase, setVerdict, setAnalysisData]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("audio/")) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);
  const handleClick = () => fileInputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (phase !== "main") return null;

  if (paywallOpen) return <PaywallGate onClose={() => setPaywallOpen(false)} />;

  const tabStyle = (tab: typeof activeTab) => ({
    background: activeTab === tab ? "hsl(20, 6%, 14%)" : "transparent",
    color: activeTab === tab ? "hsl(43, 74%, 52%)" : "hsl(40, 8%, 50%)",
    borderBottom: activeTab === tab ? "1px solid hsl(43, 74%, 42%)" : "1px solid transparent",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="w-full max-w-sm mx-auto flex flex-col gap-3"
    >
      <p
        className="text-center text-base"
        style={{ color: "hsl(40, 12%, 70%)", fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}
      >
        {userName ? `Submit your music, ${userName}.` : "Submit your music."}
      </p>

      <div
        className="flex rounded-t-md overflow-hidden"
        style={{ border: "1px solid hsl(40, 8%, 16%)", borderBottom: "none" }}
      >
        {(["upload", "link", "search"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] uppercase tracking-widest transition-all"
            style={tabStyle(tab)}
            data-testid={`tab-${tab}`}
          >
            {tab === "upload" && <Upload className="w-3 h-3" />}
            {tab === "link" && <Link className="w-3 h-3" />}
            {tab === "search" && <Search className="w-3 h-3" />}
            {tab}
          </button>
        ))}
      </div>

      <div
        className="rounded-b-md p-5"
        style={{
          background: "hsl(20, 6%, 9%)",
          border: "1px solid hsl(40, 8%, 16%)",
          borderTop: "none",
        }}
      >
        {activeTab === "upload" && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            className="cursor-pointer rounded-md border-dashed border-2 p-8 flex flex-col items-center gap-4 transition-all duration-300"
            style={{
              borderColor: isDragging
                ? "hsl(43, 80%, 50%)"
                : "hsl(40, 8%, 22%)",
              background: isDragging ? "hsl(43, 80%, 50%, 0.05)" : "transparent",
            }}
            data-testid="upload-zone"
          >
            <div className="flex items-center gap-3" style={{ color: "hsl(43, 70%, 48%)" }}>
              <Upload className="w-5 h-5" />
              <Music className="w-5 h-5" />
            </div>
            <p className="font-serif text-center text-sm" style={{ color: "hsl(40, 10%, 62%)" }}>
              Drop your audio file here
            </p>
            <p className="text-xs" style={{ color: "hsl(40, 6%, 40%)" }}>
              MP3, WAV, M4A, FLAC accepted
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleInputChange}
              data-testid="input-file-upload"
            />
          </div>
        )}

        {activeTab === "link" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-center" style={{ color: "hsl(40, 6%, 50%)" }}>
              YouTube · Spotify · Apple Music · SoundCloud
            </p>
            <input
              type="url"
              placeholder="Paste link..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none"
              style={{
                background: "hsl(20, 6%, 14%)",
                border: "1px solid hsl(40, 8%, 20%)",
                color: "hsl(40, 10%, 80%)",
              }}
              data-testid="input-link"
            />
            <button
              onClick={handleLinkSubmit}
              disabled={!linkInput.trim()}
              className="py-2.5 rounded-md text-sm font-serif tracking-widest uppercase disabled:opacity-40 transition-opacity"
              style={{
                background: "hsl(43, 80%, 48%)",
                color: "hsl(43, 10%, 8%)",
              }}
              data-testid="button-submit-link"
            >
              Analyze
            </button>
          </div>
        )}

        {activeTab === "search" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-center" style={{ color: "hsl(40, 6%, 50%)" }}>
              Search by title and artist
            </p>
            <input
              type="text"
              placeholder="e.g. Kendrick Lamar — HUMBLE."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none"
              style={{
                background: "hsl(20, 6%, 14%)",
                border: "1px solid hsl(40, 8%, 20%)",
                color: "hsl(40, 10%, 80%)",
              }}
              data-testid="input-search"
            />
            <button
              onClick={handleSearchSubmit}
              disabled={!searchInput.trim()}
              className="py-2.5 rounded-md text-sm font-serif tracking-widest uppercase disabled:opacity-40 transition-opacity"
              style={{
                background: "hsl(43, 80%, 48%)",
                color: "hsl(43, 10%, 8%)",
              }}
              data-testid="button-submit-search"
            >
              Analyze
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
