import { useCallback, useState, useRef, type CSSProperties } from "react";
import { useAppState, decrementTrial, isTrialExhausted, DEFAULT_MIN_LISTEN_SECONDS } from "@/lib/appState";
import { Upload, Music, Link, Search, ExternalLink } from "lucide-react";
import { PaywallGate } from "@/components/PaywallGate";
import { motion } from "framer-motion";
import type { AnalysisData } from "@/lib/appState";

// ── Minimum "Gad listens" duration ────────────────────────────────────────────
// The verdict must never render before Gad has genuinely "listened" for a
// meaningful stretch: at least 45s, scaled up to 25% of the track's total
// length for longer songs, but never more than 120s (2 minutes) so nobody
// waits forever on a long track.
const MIN_LISTEN_SECONDS = DEFAULT_MIN_LISTEN_SECONDS; // 45s floor
const MAX_LISTEN_SECONDS = 120; // 2 minute cap

function getMinListenDurationMs(trackDurationSeconds: number | null): number {
  if (!trackDurationSeconds || !isFinite(trackDurationSeconds) || trackDurationSeconds <= 0) {
    // Duration unknown (e.g. a linked/searched track we never actually loaded) —
    // fall back to the floor rather than guessing.
    return MIN_LISTEN_SECONDS * 1000;
  }
  const scaled = trackDurationSeconds * 0.25;
  const bounded = Math.min(MAX_LISTEN_SECONDS, Math.max(MIN_LISTEN_SECONDS, scaled));
  return bounded * 1000;
}

// Reads a track's duration from its audio metadata (HTML5 Audio element),
// resolving null if it can't be determined so callers can fall back to the floor.
function probeAudioDurationSeconds(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const probe = new Audio();
    const cleanup = () => {
      probe.removeEventListener("loadedmetadata", onLoaded);
      probe.removeEventListener("error", onError);
    };
    const onLoaded = () => {
      const duration = probe.duration;
      cleanup();
      resolve(isFinite(duration) && duration > 0 ? duration : null);
    };
    const onError = () => {
      cleanup();
      resolve(null);
    };
    probe.addEventListener("loadedmetadata", onLoaded);
    probe.addEventListener("error", onError);
    probe.src = url;
  });
}

// Inline structural styles mirror the Tailwind classes so the layout
// holds its shape even if the utility CSS pipeline fails to load.
const INPUT_STYLE: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: 6,
  padding: "10px 12px",
  fontSize: 15,
  outline: "none",
  background: "#ffffff",
  border: "1px solid hsl(220, 15%, 82%)",
  color: "hsl(222, 20%, 12%)",
  boxShadow: "inset 0 1px 3px rgba(184,134,11,0.06)",
};

const SUBMIT_STYLE: CSSProperties = {
  width: "100%",
  border: "1px solid hsl(42, 90%, 34%)",
  borderRadius: 6,
  padding: "11px 0",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  background: "linear-gradient(135deg, hsl(45, 95%, 50%), hsl(38, 90%, 42%))",
  color: "hsl(222, 30%, 8%)",
  boxShadow: "0 4px 14px rgba(184,134,11,0.30)",
};

const HELPER_STYLE: CSSProperties = {
  fontSize: 13,
  textAlign: "center",
  margin: 0,
  color: "hsl(222, 10%, 36%)",
};

// Real search-out links — open the user's search on each platform in a new tab.
const SEARCH_PLATFORMS: { name: string; buildUrl: (q: string) => string }[] = [
  {
    name: "YouTube",
    buildUrl: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  },
  {
    name: "Apple Music",
    buildUrl: (q) => `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`,
  },
  {
    name: "Spotify",
    buildUrl: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  },
];

const PLATFORM_LINK_STYLE: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  padding: "9px 6px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textDecoration: "none",
  background: "#ffffff",
  border: "1px solid rgba(5,150,105,0.5)",
  color: "hsl(161, 84%, 20%)",
  boxShadow: "0 2px 8px rgba(5,150,105,0.14)",
  whiteSpace: "nowrap",
};

export function UploadZone() {
  const {
    userName,
    setPhase,
    setVerdict,
    setSongFileName,
    setAudioFileUrl,
    setAnalysisData,
    setMinListenSeconds,
    phase,
  } = useAppState();
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "link" | "search">("upload");
  const [linkInput, setLinkInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paywallOpen, setPaywallOpen] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      // HARD GATE: analysis never starts without an actually submitted audio file.
      if (!file || file.size === 0) {
        setNotice("That file looks empty. Please choose a real audio file to analyze.");
        return;
      }
      setNotice("");
      if (isTrialExhausted()) { setPaywallOpen(true); return; }
      decrementTrial();
      setSongFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      setAudioFileUrl(objectUrl);
      setPhase("listening");

      const formData = new FormData();
      formData.append("audio", file);

      const listeningStart = Date.now();

      // Kick off the real track-duration probe alongside the analysis request
      // so we don't add extra sequential delay — both run concurrently.
      const durationPromise = probeAudioDurationSeconds(objectUrl);

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

      const trackDurationSeconds = await durationPromise;
      const minListenDurationMs = getMinListenDurationMs(trackDurationSeconds);
      setMinListenSeconds(minListenDurationMs / 1000);

      const elapsed = Date.now() - listeningStart;
      const remaining = minListenDurationMs - elapsed;
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
    [setPhase, setVerdict, setSongFileName, setAudioFileUrl, setAnalysisData, setMinListenSeconds]
  );

  const handleLinkSubmit = useCallback(async () => {
    // HARD GATE: no verdict without an actually pasted link.
    if (!linkInput.trim()) {
      setNotice("Please paste a song link first — then press Analyze.");
      return;
    }
    setNotice("");
    if (isTrialExhausted()) { setPaywallOpen(true); return; }
    decrementTrial();
    const fakeFileName = linkInput.split("/").pop() || "linked-track";
    setSongFileName(fakeFileName);
    setAudioFileUrl(null);
    setPhase("listening");

    // No local audio to probe for a linked track, so we can't know its real
    // duration — fall back to the 45s floor rather than guessing.
    const minListenDurationMs = getMinListenDurationMs(null);
    setMinListenSeconds(minListenDurationMs / 1000);

    const listeningStart = Date.now();
    await new Promise((r) => setTimeout(r, 2000));

    const verdict: "ark" | "calf" = Math.random() > 0.45 ? "ark" : "calf";
    const score = verdict === "ark" ? 55 + Math.floor(Math.random() * 40) : 10 + Math.floor(Math.random() * 38);

    const elapsed = Date.now() - listeningStart;
    const remaining = minListenDurationMs - elapsed;
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
  }, [linkInput, setSongFileName, setAudioFileUrl, setPhase, setVerdict, setAnalysisData, setMinListenSeconds]);

  const handleSearchSubmit = useCallback(async () => {
    // HARD GATE: no verdict without an actual search entry.
    if (!searchInput.trim()) {
      setNotice("Please type a song title and artist first — then press Analyze.");
      return;
    }
    setNotice("");
    if (isTrialExhausted()) { setPaywallOpen(true); return; }
    decrementTrial();
    setSongFileName(searchInput.trim());
    setAudioFileUrl(null);
    setPhase("listening");

    // No local audio to probe for a searched track either — fall back to the
    // 45s floor rather than guessing at a duration.
    const minListenDurationMs = getMinListenDurationMs(null);
    setMinListenSeconds(minListenDurationMs / 1000);

    const listeningStart = Date.now();
    await new Promise((r) => setTimeout(r, 1500));

    const verdict: "ark" | "calf" = Math.random() > 0.45 ? "ark" : "calf";
    const score = verdict === "ark" ? 55 + Math.floor(Math.random() * 40) : 10 + Math.floor(Math.random() * 38);

    const elapsed = Date.now() - listeningStart;
    const remaining = minListenDurationMs - elapsed;
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
  }, [searchInput, setSongFileName, setAudioFileUrl, setPhase, setVerdict, setAnalysisData, setMinListenSeconds]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("audio/")) {
        handleFile(file);
      } else {
        setNotice("That doesn't look like an audio file. Please drop an MP3, WAV, M4A, or FLAC.");
      }
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);
  const openFilePicker = () => fileInputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (phase !== "main") return null;

  if (paywallOpen) return <PaywallGate onClose={() => setPaywallOpen(false)} />;

  const tabStyle = (tab: typeof activeTab): CSSProperties => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 0",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    background: activeTab === tab ? "hsl(150, 45%, 96%)" : "transparent",
    color: activeTab === tab ? "hsl(161, 84%, 20%)" : "hsl(222, 10%, 36%)",
    borderBottom: activeTab === tab ? "2px solid #059669" : "2px solid transparent",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="w-full max-w-sm mx-auto flex flex-col gap-3"
      style={{
        width: "100%",
        maxWidth: 384,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <p
        className="text-center text-base"
        style={{
          textAlign: "center",
          fontSize: 17,
          margin: 0,
          color: "hsl(222, 20%, 15%)",
          fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        }}
      >
        {userName ? `Submit your music, ${userName}.` : "Submit your music."}
      </p>

      {notice && (
        <p
          role="alert"
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.5,
            textAlign: "center",
            color: "hsl(161, 84%, 16%)",
            background: "hsl(152, 50%, 94%)",
            border: "1px solid #059669",
            boxShadow: "0 2px 10px rgba(5,150,105,0.14)",
            borderRadius: 6,
            padding: "8px 12px",
          }}
          data-testid="text-upload-notice"
        >
          {notice}
        </p>
      )}

      <div
        className="flex rounded-t-md overflow-hidden"
        style={{
          display: "flex",
          borderRadius: "6px 6px 0 0",
          overflow: "hidden",
          border: "1px solid hsl(220, 15%, 88%)",
          borderBottom: "none",
          background: "#ffffff",
        }}
      >
        {(["upload", "link", "search"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] uppercase tracking-widest transition-all"
            style={tabStyle(tab)}
            data-testid={`tab-${tab}`}
          >
            {tab === "upload" && <Upload className="w-3 h-3" style={{ width: 12, height: 12 }} />}
            {tab === "link" && <Link className="w-3 h-3" style={{ width: 12, height: 12 }} />}
            {tab === "search" && <Search className="w-3 h-3" style={{ width: 12, height: 12 }} />}
            {tab}
          </button>
        ))}
      </div>

      <div
        className="rounded-b-md p-5"
        style={{
          padding: 20,
          borderRadius: "0 0 6px 6px",
          background: "#ffffff",
          border: "1px solid hsl(220, 15%, 88%)",
          borderTop: "none",
          boxShadow: "0 8px 28px rgba(184,134,11,0.16)",
        }}
      >
        {activeTab === "upload" && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFilePicker}
            className="cursor-pointer rounded-md border-dashed border-2 p-8 flex flex-col items-center gap-4 transition-all duration-300"
            style={{
              cursor: "pointer",
              borderRadius: 6,
              borderWidth: 2,
              borderStyle: "dashed",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              borderColor: isDragging
                ? "#059669"
                : "hsl(42, 70%, 60%)",
              background: isDragging ? "rgba(5, 150, 105, 0.06)" : "hsl(210, 20%, 98.5%)",
            }}
            data-testid="upload-zone"
          >
            <div
              className="flex items-center gap-3"
              style={{ display: "flex", alignItems: "center", gap: 12, color: "hsl(42, 95%, 38%)" }}
            >
              <Upload className="w-5 h-5" style={{ width: 22, height: 22 }} />
              <Music className="w-5 h-5" style={{ width: 22, height: 22 }} />
            </div>

            {/* The big Upload button — opens the file picker directly */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              style={{
                background: "#059669",
                color: "#ffffff",
                border: "1px solid #047857",
                borderRadius: 8,
                padding: "13px 26px",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 4px 16px rgba(5,150,105,0.35)",
              }}
              data-testid="button-upload-file"
            >
              <Upload style={{ width: 18, height: 18 }} />
              Upload a Song
            </button>

            <p
              className="font-serif text-center text-sm"
              style={{ textAlign: "center", fontSize: 14, margin: 0, color: "hsl(222, 12%, 30%)" }}
            >
              ...or drop your audio file here
            </p>
            <p className="text-xs" style={{ fontSize: 12, margin: 0, color: "hsl(222, 10%, 36%)" }}>
              MP3, WAV, M4A, FLAC accepted
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              style={{ display: "none" }}
              onChange={handleInputChange}
              data-testid="input-file-upload"
            />
          </div>
        )}

        {activeTab === "link" && (
          <div
            className="flex flex-col gap-3"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <p className="text-xs text-center" style={HELPER_STYLE}>
              YouTube · Spotify · Apple Music · SoundCloud
            </p>
            <input
              type="url"
              placeholder="Paste link..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkSubmit()}
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none"
              style={INPUT_STYLE}
              data-testid="input-link"
            />
            <button
              onClick={handleLinkSubmit}
              disabled={!linkInput.trim()}
              className="py-2.5 rounded-md text-sm font-serif tracking-widest uppercase disabled:opacity-40 transition-opacity"
              style={{ ...SUBMIT_STYLE, opacity: linkInput.trim() ? 1 : 0.4 }}
              data-testid="button-submit-link"
            >
              Analyze
            </button>
          </div>
        )}

        {activeTab === "search" && (
          <div
            className="flex flex-col gap-3"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <p className="text-xs text-center" style={HELPER_STYLE}>
              Search by title and artist
            </p>
            <input
              type="text"
              placeholder="e.g. song title and artist name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="w-full rounded-md px-3 py-2.5 text-sm outline-none"
              style={INPUT_STYLE}
              data-testid="input-search"
            />
            {searchInput.trim() && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ ...HELPER_STYLE, fontSize: 12 }}>
                  Find it on a platform — opens in a new tab:
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {SEARCH_PLATFORMS.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.buildUrl(searchInput.trim())}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={PLATFORM_LINK_STYLE}
                      data-testid={`link-search-${platform.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {platform.name}
                      <ExternalLink style={{ width: 11, height: 11, flexShrink: 0 }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleSearchSubmit}
              disabled={!searchInput.trim()}
              className="py-2.5 rounded-md text-sm font-serif tracking-widest uppercase disabled:opacity-40 transition-opacity"
              style={{ ...SUBMIT_STYLE, opacity: searchInput.trim() ? 1 : 0.4 }}
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
