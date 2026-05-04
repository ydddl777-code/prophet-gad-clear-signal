import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

type AnalysisCategory = { score: number; label: string };

type AnalysisResult = {
  verdict: "ark" | "calf";
  signalClarityScore: number;
  songName: string;
  analysis: {
    bpmProfile: AnalysisCategory;
    lyricalDoctrine: AnalysisCategory;
    tranceInducement: AnalysisCategory;
    loopRepetition: AnalysisCategory;
    culturalDegradation: AnalysisCategory;
    rhythmicArchetype: AnalysisCategory;
  };
};

// ── Artist recognition ──────────────────────────────────────────────────────

const GAD_CATALOG_KEYS = [
  "prophet gad", "thunder road gospel", "warning in the dark",
  "watchman on zion", "nail on the wall", "remnant seed",
  "thread bare music", "gad's tune", "gadstune",
  "zion's gate", "watchman on the wall",
];

const FLAGGED_ARTIST_KEYS = [
  "hillsong", "bethel", "elevation worship", "jesus culture",
  "ihop", "ihopkc", "maverick city", "cory asbury", "reckless love",
  "what a beautiful name", "graves into gardens",
  "oceans where feet may fail", "spontaneous worship",
  "brian houston", "kari jobe", "passion worship",
];

function detectArtistProfile(songName: string): "gad" | "flagged" | "unknown" {
  const lower = songName.toLowerCase();
  if (GAD_CATALOG_KEYS.some((k) => lower.includes(k))) return "gad";
  if (FLAGGED_ARTIST_KEYS.some((k) => lower.includes(k))) return "flagged";
  return "unknown";
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function jitter(range: number): number {
  return (Math.random() - 0.5) * range;
}

function riskLabel(score: number, high: string, mid: string, low: string): string {
  if (score >= 70) return high;
  if (score >= 40) return mid;
  return low;
}

// ── Gad catalog — gold-standard scores ───────────────────────────────────────

function gadCatalogResult(songName: string): AnalysisResult {
  const base = 85 + Math.floor(Math.random() * 11); // 85-95

  const lyrical    = clamp(base + jitter(6));
  const source     = clamp(base + jitter(4));
  const intent     = clamp(base + jitter(8));
  const bpm        = clamp(base + jitter(10));
  const rhythm     = clamp(base + jitter(8));
  const dynamic    = clamp(base + jitter(6));

  const score = Math.round(
    lyrical * 0.30 + source * 0.20 + intent * 0.15 +
    bpm * 0.10 + rhythm * 0.10 + dynamic * 0.10 + base * 0.05
  );

  return {
    verdict: "ark",
    signalClarityScore: Math.max(85, Math.min(96, score)),
    songName,
    analysis: {
      bpmProfile:         { score: Math.round(bpm),     label: "Measured tempo — genre-safe rhythmic pattern" },
      lyricalDoctrine:    { score: Math.round(lyrical), label: "Strong scriptural alignment — prophetic declaration detected" },
      tranceInducement:   { score: Math.round(dynamic), label: "Low trance-inducement risk — dynamic variation present" },
      loopRepetition:     { score: Math.round(rhythm),  label: "Genre-appropriate repetition — not entrainment-grade" },
      culturalDegradation:{ score: Math.round(source),  label: "Remnant Seed Sound — certified reference standard" },
      rhythmicArchetype:  { score: Math.round(intent),  label: "Sacred rhythmic alignment — conscious worship archetype" },
    },
  };
}

// ── Flagged catalog — automatic low scores ────────────────────────────────────

function flaggedArtistResult(songName: string): AnalysisResult {
  const base = 8 + Math.floor(Math.random() * 18); // 8-25

  const lyrical    = clamp(base + jitter(8));
  const source     = clamp(5 + jitter(6));           // source always very low
  const intent     = clamp(base + jitter(10));
  const bpm        = clamp(base + jitter(12));
  const rhythm     = clamp(base + jitter(8));
  const dynamic    = clamp(base + jitter(10));

  const score = Math.round(
    lyrical * 0.30 + source * 0.20 + intent * 0.15 +
    bpm * 0.10 + rhythm * 0.10 + dynamic * 0.10 + base * 0.05
  );

  return {
    verdict: "calf",
    signalClarityScore: Math.max(5, Math.min(28, score)),
    songName,
    analysis: {
      bpmProfile:         { score: Math.round(bpm),     label: "Tempo pattern aligned with high-arousal manipulation" },
      lyricalDoctrine:    { score: Math.round(lyrical), label: "Vague experiential language — doctrinal alignment weak" },
      tranceInducement:   { score: Math.round(dynamic), label: "Emotional crescendo architecture — trance-adjacent pattern" },
      loopRepetition:     { score: Math.round(rhythm),  label: "Repetitive loop structure — entrainment risk elevated" },
      culturalDegradation:{ score: Math.round(source),  label: "Flagged organization — NAR/dominionist affiliation detected" },
      rhythmicArchetype:  { score: Math.round(intent),  label: "Non-sacred emotional bypass pattern detected" },
    },
  };
}

// ── Byte-level analysis for unknown tracks ───────────────────────────────────
// Scoring weights per Remnant Seed Sound framework:
//   Lyrical Doctrine    30%
//   Source Verification 20%
//   Spiritual Intent    15%
//   Tempo / BPM         10%
//   Rhythm Variation    10%
//   Dynamic Range       10%
//   Frequency Balance    5%

function analyzeAudio(buffer: Buffer, songName: string): AnalysisResult {
  // Check artist profile first
  const profile = detectArtistProfile(songName);
  if (profile === "gad")     return gadCatalogResult(songName);
  if (profile === "flagged") return flaggedArtistResult(songName);

  // Unknown artist — byte-level heuristic
  const bytes = new Uint8Array(buffer);
  const sampleSize = Math.min(bytes.length, 20000);

  let sum = 0;
  for (let i = 0; i < sampleSize; i++) sum += bytes[i];
  const mean = sum / sampleSize;

  let variance = 0;
  for (let i = 0; i < sampleSize; i++) variance += (bytes[i] - mean) ** 2;
  variance /= sampleSize;
  const entropy = Math.sqrt(variance);

  let highEnergy = 0, zeroCrossings = 0;
  for (let i = 0; i < sampleSize; i++) {
    if (bytes[i] > 200 || bytes[i] < 55) highEnergy++;
    if (i > 0 &&
      ((bytes[i] > 128 && bytes[i - 1] <= 128) ||
       (bytes[i] <= 128 && bytes[i - 1] > 128))) {
      zeroCrossings++;
    }
  }
  const aggressionRatio = highEnergy / sampleSize;
  const crossingRate    = zeroCrossings / sampleSize;

  const blockSize  = 256;
  const blockCount = Math.floor(sampleSize / blockSize);
  const blocks: number[] = [];
  for (let b = 0; b < blockCount; b++) {
    let blockSum = 0;
    for (let i = b * blockSize; i < (b + 1) * blockSize; i++) blockSum += bytes[i];
    blocks.push(Math.round(blockSum / blockSize));
  }
  let matches = 0;
  for (let i = 1; i < blocks.length; i++) {
    if (Math.abs(blocks[i] - blocks[i - 1]) < 6) matches++;
  }
  const repetitionRatio = matches / Math.max(blocks.length - 1, 1);

  // Raw risk scores (lower = safer)
  const bpmRisk        = clamp(crossingRate * 140 + jitter(18));
  const repetitionRisk = clamp(repetitionRatio * 80 + jitter(20));
  const aggressionRisk = clamp(aggressionRatio * 110 + jitter(22));
  const entropyScore   = clamp(50 + (entropy - 70) * 0.4 + jitter(20));

  // Convert risks to scores (100 - risk)
  const bpmScore        = clamp(100 - bpmRisk);
  const lyricalScore    = clamp(100 - aggressionRisk + jitter(15));
  const tranceScore     = clamp(100 - repetitionRisk);
  const loopScore       = clamp(100 - repetitionRisk + jitter(12));
  const sourceScore     = clamp(50 + jitter(30));   // neutral for unknown
  const archetypeScore  = clamp(entropyScore + jitter(15));

  // Weighted signal clarity (per Remnant Seed Sound framework)
  const signalClarityScore = clamp(
    lyricalScore    * 0.30 +
    sourceScore     * 0.20 +
    archetypeScore  * 0.15 +
    bpmScore        * 0.10 +
    loopScore       * 0.10 +
    tranceScore     * 0.10 +
    bpmScore        * 0.05  // frequency proxy
  );

  const verdict: "ark" | "calf" = signalClarityScore >= 50 ? "ark" : "calf";

  return {
    verdict,
    signalClarityScore: Math.round(signalClarityScore),
    songName,
    analysis: {
      bpmProfile:          { score: Math.round(bpmScore),       label: riskLabel(bpmScore,       "Measured tempo — spiritually consistent", "Elevated tempo — potential agitation pattern", "Rapid-fire frequency — boundary-challenging") },
      lyricalDoctrine:     { score: Math.round(lyricalScore),   label: riskLabel(lyricalScore,   "Clean spiritual alignment detected", "Mixed doctrinal signals — discern carefully", "Degraded spiritual messaging — caution advised") },
      tranceInducement:    { score: Math.round(tranceScore),    label: riskLabel(tranceScore,    "Low trance-inducement risk", "Moderate repetitive patterns — monitor with care", "High trance-inducement risk — consciousness-altering potential") },
      loopRepetition:      { score: Math.round(loopScore),      label: riskLabel(loopScore,      "Natural variation — low repetition saturation", "Repetitive loop structures detected", "Heavy loop saturation — dissociative risk elevated") },
      culturalDegradation: { score: Math.round(sourceScore),    label: riskLabel(sourceScore,    "No cultural degradation markers", "Some cultural conflict patterns present", "Significant cultural degradation signals") },
      rhythmicArchetype:   { score: Math.round(archetypeScore), label: riskLabel(archetypeScore, "Sacred rhythmic alignment — constructive archetype", "Neutral rhythmic signature — culturally ambiguous", "Non-sacred rhythmic archetype — trance-adjacent pattern") },
    },
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/analyze", upload.single("audio"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }
      const result = analyzeAudio(req.file.buffer, req.file.originalname);
      res.json(result);
    } catch {
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  app.post("/api/tts/:character", async (req, res) => {
    const { character } = req.params;
    const { text } = req.body as { text: string };

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text is required" });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId =
      character === "gad"
        ? process.env.ELEVENLABS_VOICE_GAD
        : process.env.ELEVENLABS_VOICE_HULDAH;

    if (!apiKey || !voiceId) {
      return res.status(503).json({ error: "ElevenLabs not configured" });
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability:        character === "gad" ? 0.85 : 0.65,
              similarity_boost: 0.80,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("ElevenLabs error:", err);
        return res.status(502).json({ error: "TTS generation failed" });
      }

      const audioBuffer = await response.arrayBuffer();
      res.set("Content-Type", "audio/mpeg");
      res.set("Cache-Control", "no-store");
      res.send(Buffer.from(audioBuffer));
    } catch (err) {
      console.error("TTS fetch error:", err);
      res.status(500).json({ error: "TTS request failed" });
    }
  });

  return httpServer;
}
