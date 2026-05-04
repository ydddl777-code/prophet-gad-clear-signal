// Global audio coordinator — ensures only one source plays at a time

let _bgAudio: HTMLAudioElement | null = null;
let _pausedBySpeech = false;

export const audioManager = {
  /** BackgroundPlayer registers its <audio> element here */
  register(audio: HTMLAudioElement) {
    _bgAudio = audio;
  },

  unregister() {
    _bgAudio = null;
  },

  /** Called before any TTS or song playback starts */
  pauseBackground() {
    if (_bgAudio && !_bgAudio.paused) {
      _bgAudio.pause();
      _pausedBySpeech = true;
    }
  },

  /** Called when TTS / song ends — resumes background if it was paused by speech */
  resumeBackground() {
    if (_bgAudio && _pausedBySpeech) {
      _bgAudio.play().catch(() => {});
      _pausedBySpeech = false;
    }
  },

  /** Stop background completely (stop button) */
  stopBackground() {
    if (_bgAudio) {
      _bgAudio.pause();
      _bgAudio.currentTime = 0;
      _pausedBySpeech = false;
    }
  },

  /** Call this directly inside a click handler to satisfy browser autoplay policy */
  startBackground(volume = 0.28) {
    if (_bgAudio && _bgAudio.paused) {
      _bgAudio.volume = volume;
      _bgAudio.play().catch(() => {});
    }
  },

  isBackgroundPlaying(): boolean {
    return !!_bgAudio && !_bgAudio.paused;
  },
};
