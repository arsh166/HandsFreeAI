/**
 * recorder.js — Member 1 (Voice Engine Lead)
 * Handles microphone access, speech recognition, and transcript building.
 */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class VoiceRecorder {
  constructor({ onTranscript, onInterim, onError, onEnd }) {
    this.onTranscript = onTranscript;
    this.onInterim = onInterim;
    this.onError = onError;
    this.onEnd = onEnd;
    this.recognition = null;
    this.isRecording = false;
    this.finalText = '';
  }

  start() {
    if (!SpeechRecognition) {
      this.onError('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.isRecording = true;
    this.finalText = '';

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalText += transcript + ' ';
          this.onTranscript(this.finalText, transcript);
        } else {
          interim = transcript;
        }
      }
      if (interim) this.onInterim(interim);
    };

    this.recognition.onerror = (e) => {
      if (e.error !== 'no-speech') this.onError(e.error);
    };

    this.recognition.onend = () => {
      if (this.isRecording) this.recognition.start();
      else this.onEnd(this.finalText);
    };

    this.recognition.start();
  }

  stop() {
    this.isRecording = false;
    if (this.recognition) this.recognition.stop();
    return this.finalText.trim();
  }

  getTranscript() {
    return this.finalText.trim();
  }

  setLanguage(lang) {
    if (this.recognition) this.recognition.lang = lang;
  }
}
