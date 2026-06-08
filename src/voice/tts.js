/**
 * tts.js — Member 1 (Voice Engine Lead)
 * Text-to-speech feedback so blind users hear every action.
 */

export class TTSFeedback {
  constructor({ rate = 0.95, pitch = 1, volume = 1 } = {}) {
    this.rate = rate;
    this.pitch = pitch;
    this.volume = volume;
    this.queue = [];
    this.isSpeaking = false;
  }

  speak(message, priority = false) {
    if (priority) {
      window.speechSynthesis.cancel();
      this.queue = [];
    }
    this.queue.push(message);
    if (!this.isSpeaking) this._next();
  }

  _next() {
    if (!this.queue.length) { this.isSpeaking = false; return; }
    this.isSpeaking = true;
    const msg = this.queue.shift();
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    utterance.onend = () => this._next();
    window.speechSynthesis.speak(utterance);
  }

  stop() {
    this.queue = [];
    this.isSpeaking = false;
    window.speechSynthesis.cancel();
  }

  // Pre-built announcements used throughout the app
  announceStart() {
    this.speak('Recording started. Speak now.', true);
  }

  announceStop(wordCount) {
    this.speak(`Recording stopped. ${wordCount} words captured. Say send email, paste to document, or read transcript.`, true);
  }

  announceCountdown(n) {
    this.speak(String(n));
  }

  announceEmail() {
    this.speak('Email draft is ready. Choose a send time or say send now.', true);
  }

  announceEmailSent(schedule) {
    this.speak(schedule === 'now' ? 'Email sent.' : `Email scheduled for ${schedule}.`, true);
  }

  announcePaste() {
    this.speak('Text copied. Open your document and press Control V to paste.', true);
  }
}
