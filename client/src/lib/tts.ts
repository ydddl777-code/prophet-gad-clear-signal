import { audioManager } from "./audioManager";

export async function speakElevenLabs(
  text: string,
  character: "gad" | "huldah"
): Promise<HTMLAudioElement | null> {
  try {
    const response = await fetch(`/api/tts/${character}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = 1.0;

    // Pause background before speaking
    audioManager.pauseBackground();

    audio.onended = () => audioManager.resumeBackground();
    audio.onerror = () => audioManager.resumeBackground();

    audio.play().catch(() => audioManager.resumeBackground());
    return audio;
  } catch {
    return null;
  }
}

export function speakBrowser(
  text: string,
  opts?: { rate?: number; pitch?: number; onEnd?: () => void }
): void {
  if (!("speechSynthesis" in window)) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();

  // Pause background before speaking
  audioManager.pauseBackground();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = opts?.rate ?? 0.85;
  utterance.pitch = opts?.pitch ?? 0.65;
  utterance.volume = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const female = voices.find(
    (v) =>
      v.name.toLowerCase().includes("samantha") ||
      v.name.toLowerCase().includes("karen") ||
      v.name.toLowerCase().includes("victoria") ||
      v.name.toLowerCase().includes("zira") ||
      v.name.toLowerCase().includes("female")
  );
  if (female) utterance.voice = female;

  let ended = false;
  const finish = () => {
    if (!ended) {
      ended = true;
      audioManager.resumeBackground();
      opts?.onEnd?.();
    }
  };
  utterance.onend = finish;
  utterance.onerror = finish;
  if (opts?.onEnd) {
    const fallbackMs = Math.max(text.length * 75, 2500);
    setTimeout(finish, fallbackMs);
  }
  window.speechSynthesis.speak(utterance);
}

export async function speakHuldah(
  text: string,
  onEnd?: () => void
): Promise<void> {
  const audio = await speakElevenLabs(text, "huldah");
  if (audio) {
    if (onEnd) {
      const fallback = setTimeout(() => {
        audioManager.resumeBackground();
        onEnd();
      }, Math.max(text.length * 80, 3000));
      audio.onended = () => {
        clearTimeout(fallback);
        audioManager.resumeBackground();
        onEnd();
      };
    }
    return;
  }
  speakBrowser(text, { rate: 0.9, pitch: 0.75, onEnd });
}

export async function speakGad(text: string, onEnd?: () => void): Promise<void> {
  const audio = await speakElevenLabs(text, "gad");
  if (audio) {
    if (onEnd) {
      const fallback = setTimeout(() => {
        audioManager.resumeBackground();
        onEnd();
      }, Math.max(text.length * 80, 3000));
      audio.onended = () => {
        clearTimeout(fallback);
        audioManager.resumeBackground();
        onEnd();
      };
    }
    return;
  }
  speakBrowser(text, { rate: 0.75, pitch: 0.6, onEnd });
}
