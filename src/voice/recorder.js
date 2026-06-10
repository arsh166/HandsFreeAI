/**
 * recorder.js — zeweriah (Voice Engine Lead)
 * Week 1 Sprint: Complete voice engine
 * 
 * HOW TO TEST:
 * 1. Open index.html in Chrome or Edge
 * 2. Allow microphone when asked
 * 3. Watch it auto-start and transcribe your speech
 */

// ─── TEXT TO SPEECH ──────────────────────────────────────────────
export class TTSFeedback {
  speak(message) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(message);
    u.rate = 0.93;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }

  announceStart()         { this.speak('Recording started. Speak now.'); }
  announceCountdown(n)    { this.speak(String(n)); }
  announceStop(wordCount) { this.speak(`Recording stopped. ${wordCount} words captured. Say send email or paste to document.`); }
  announceEmail()         { this.speak('Email draft is ready. Say send now or choose a schedule time.'); }
  announcePaste()         { this.speak('Text copied. Press Control V to paste into your document.'); }
  announceEmailSent(time) { this.speak(time === 'now' ? 'Email sent.' : `Email scheduled for ${time}.`); }
}

// ─── SILENCE DETECTOR ────────────────────────────────────────────
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
      const percent = this.silenceSec / this.threshold;
      this.onTick(remaining, percent);
      if (this.silenceSec >= this.threshold) {
        this.stop();
        this.onSilenceReached();
      }
    }, 1000);
  }

  reset() {
    // Call this every time speech is detected — resets the 20s counter
    this.silenceSec = 0;
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
}

// ─── VOICE COMMAND PARSER ────────────────────────────────────────
export class CommandParser {
  constructor(handlers = {}) {
    this.handlers = handlers;
  }

  // Commands the user can say
  COMMANDS = [
    { id: 'stop',           triggers: ['stop', 'done', 'finish', 'end recording'] },
    { id: 'send_email',     triggers: ['send email', 'email', 'send message'] },
    { id: 'paste_document', triggers: ['paste', 'paste to document', 'open word'] },
    { id: 'read_back',      triggers: ['read', 'read transcript', 'play back'] },
    { id: 'record_again',   triggers: ['record again', 'start over', 'new recording'] },
  ];

  parse(text) {
    const lower = text.toLowerCase().trim();
    for (const cmd of this.COMMANDS) {
      for (const trigger of cmd.triggers) {
        if (lower.includes(trigger)) {
          if (this.handlers[cmd.id]) this.handlers[cmd.id](text);
          return cmd.id;
        }
      }
    }
    return null;
  }
}

// ─── MAIN VOICE RECORDER ─────────────────────────────────────────
export class VoiceRecorder {
  constructor({ onTranscript, onInterim, onCommand, onStop, onError }) {
    this.onTranscript = onTranscript;
    this.onInterim   = onInterim;
    this.onCommand   = onCommand;
    this.onStop      = onStop;
    this.onError     = onError;

    this.recognition  = null;
    this.isRecording  = false;
    this.finalText    = '';

    this.tts      = new TTSFeedback();
    this.silence  = new SilenceDetector({
      thresholdSeconds: 20,
      onTick: (remaining, percent) => {
        // Update UI silence bar — handled in renderer.js
        document.dispatchEvent(new CustomEvent('silence-tick', {
          detail: { remaining, percent }
        }));
      },
      onSilenceReached: () => {
        this.stop();
        this.tts.announceStop(this._wordCount());
        document.dispatchEvent(new CustomEvent('recording-stopped', {
          detail: { reason: 'silence', transcript: this.finalText }
        }));
      }
    });

    this.commands = new CommandParser({
      stop:           () => { this.stop(); this.tts.announceStop(this._wordCount()); },
      send_email:     () => { this.stop(); document.dispatchEvent(new CustomEvent('cmd-email')); },
      paste_document: () => { this.tts.announcePaste(); navigator.clipboard?.writeText(this.finalText); },
      read_back:      () => { this.tts.speak(this.finalText || 'No transcript yet.'); },
      record_again:   () => { this.stop(); setTimeout(() => this.startWithCountdown(), 500); },
    });
  }

  // ── Start with 3-second countdown ──
  startWithCountdown() {
    this.tts.speak('Recording starts in 3.');
    let n = 3;
    this.tts.announceCountdown(n);

    const interval = setInterval(() => {
      n--;
      if (n > 0) {
        this.tts.announceCountdown(n);
        document.dispatchEvent(new CustomEvent('countdown', { detail: { count: n } }));
      } else {
        clearInterval(interval);
        document.dispatchEvent(new CustomEvent('countdown', { detail: { count: 0 } }));
        this._startRecording();
      }
    }, 1000);
  }

  // ── Internal: actually start mic ──
  _startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      this.onError('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }

    this.isRecording = true;
    this.finalText   = '';
    this.recognition = new SR();
    this.recognition.continuous     = true;
    this.recognition.interimResults = true;
    this.recognition.lang           = 'en-US';

    this.recognition.onresult = (event) => {
      this.silence.reset(); // reset silence counter every time speech is heard
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalText += text + ' ';
          this.commands.parse(text);          // check for voice commands
          this.onTranscript(this.finalText);  // send to UI
        } else {
          interim = text;
        }
      }
      if (interim) this.onInterim(interim);
    };

    this.recognition.onerror = (e) => {
      if (e.error !== 'no-speech') this.onError(e.error);
    };

    this.recognition.onend = () => {
      if (this.isRecording) this.recognition.start(); // keep listening
    };

    this.recognition.start();
    this.silence.start();
    this.tts.announceStart();
    document.dispatchEvent(new CustomEvent('recording-started'));
  }

  stop() {
    this.isRecording = false;
    this.silence.stop();
    if (this.recognition) { this.recognition.stop(); this.recognition = null; }
    this.onStop(this.finalText.trim());
  }

  getTranscript() { return this.finalText.trim(); }
  _wordCount()    { return this.finalText.trim().split(/\s+/).filter(Boolean).length; }
}
