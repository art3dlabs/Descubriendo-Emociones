/**
 * KokoVoice: Intelligent Speech Engine with Latina/Spanish voice picker,
 * Chrome garbage-collection protection, watchdog safety timeout,
 * and dynamic mouth animation callbacks for synchronized lip flapping.
 */

type MouthListener = (state: 'open' | 'half' | 'closed' | 'wide') => void;

class KokoVoice {
  private synth: SpeechSynthesis | null = null;
  public enabled: boolean = true;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private mouthListeners: Set<MouthListener> = new Set();
  private mouthAnimTimer: any = null;
  private watchdogTimer: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null; // Prevents GC bug in Chromium
  public isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;
      // Prioritize natural Latin American Spanish voices, then European Spanish, then generic Spanish
      this.selectedVoice =
        voices.find((v) => v.lang.includes('es-AR')) ||
        voices.find((v) => v.lang.includes('es-MX')) ||
        voices.find((v) => v.lang.includes('es-US')) ||
        voices.find((v) => v.lang.includes('es-ES')) ||
        voices.find((v) => v.lang.startsWith('es')) ||
        voices[0] ||
        null;
    } catch {
      // Ignore voice error
    }
  }

  public onMouth(listener: MouthListener) {
    this.mouthListeners.add(listener);
    return () => {
      this.mouthListeners.delete(listener);
    };
  }

  private notifyMouth(state: 'open' | 'half' | 'closed' | 'wide') {
    this.mouthListeners.forEach((fn) => {
      try {
        fn(state);
      } catch {
        // ignore
      }
    });
  }

  speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.enabled || !text) {
      if (onEnd) onEnd();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    // Always stop and unfreeze any pending state before speaking
    this.stop();

    try {
      // Resume if browser paused speechSynthesis
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance; // Prevent GC mid-speech

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.lang = this.selectedVoice ? this.selectedVoice.lang : 'es-AR';
      utterance.rate = 1.08;
      utterance.pitch = 1.15;

      const finish = () => {
        this.isSpeaking = false;
        clearInterval(this.mouthAnimTimer);
        clearTimeout(this.watchdogTimer);
        this.currentUtterance = null;
        this.notifyMouth('closed');
        if (onEnd) onEnd();
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (onStart) onStart();

        // Start dynamic mouth lip-sync flapping animation
        let step = 0;
        const mouthSequence: ('open' | 'half' | 'closed' | 'wide')[] = ['open', 'half', 'wide', 'open', 'closed', 'half'];
        clearInterval(this.mouthAnimTimer);
        this.mouthAnimTimer = setInterval(() => {
          step = (step + 1) % mouthSequence.length;
          this.notifyMouth(mouthSequence[step]);
        }, 130);
      };

      utterance.onend = () => {
        finish();
      };

      utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        // 'canceled' or 'interrupted' is normal when a user clicks next or toggles mute
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.debug('SpeechSynthesis notice:', e.error);
        }
        finish();
      };

      // Watchdog safety: Ensure speech doesn't lock up if browser fails to trigger onend
      const safeDuration = Math.max(3000, text.length * 85);
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = setTimeout(() => {
        if (this.isSpeaking) {
          finish();
        }
      }, safeDuration);

      this.synth.speak(utterance);
    } catch (e) {
      console.debug('SpeechSynthesis invocation notice:', e);
      this.isSpeaking = false;
      clearInterval(this.mouthAnimTimer);
      clearTimeout(this.watchdogTimer);
      this.notifyMouth('closed');
      if (onEnd) onEnd();
    }
  }

  stop() {
    this.isSpeaking = false;
    clearInterval(this.mouthAnimTimer);
    clearTimeout(this.watchdogTimer);
    this.notifyMouth('closed');
    this.currentUtterance = null;

    if (this.synth) {
      try {
        if (this.synth.speaking || this.synth.pending) {
          this.synth.cancel();
        }
      } catch {
        // ignore
      }
    }
  }
}

export const kokoVoice = new KokoVoice();
