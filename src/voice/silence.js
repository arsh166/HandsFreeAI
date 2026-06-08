/**
 * silence.js — Member 1 (Voice Engine Lead)
 * Tracks silence duration and fires a callback when threshold is reached.
 */

export class SilenceDetector {
  constructor({ thresholdSeconds = 20, onTick, onSilenceReached }) {
    this.threshold = thresholdSeconds;
    this.onTick = onTick;
    this.onSilenceReached = onSilenceReached;
    this.silenceSec = 0;
    this.timer = null;
  }

  start() {
    this.silenceSec = 0;
    this.timer = setInterval(() => {
      this.silenceSec++;
      const remaining = this.threshold - this.silenceSec;
      this.onTick(remaining, this.silenceSec / this.threshold);
      if (this.silenceSec >= this.threshold) {
        this.stop();
        this.onSilenceReached();
      }
    }, 1000);
  }

  reset() {
    this.silenceSec = 0;
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
}
