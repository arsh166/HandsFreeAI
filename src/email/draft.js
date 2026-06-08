/**
 * draft.js — Member 2 (Email & Scheduler Lead)
 * Builds email drafts from voice transcript.
 */

export class EmailDraft {
  constructor() {
    this.to = '';
    this.subject = 'Voice message';
    this.body = '';
    this.scheduleTime = null;
  }

  fromTranscript(transcript) {
    this.body = transcript.trim();
    this.subject = this._generateSubject(transcript);
    return this;
  }

  _generateSubject(text) {
    const words = text.trim().split(' ').slice(0, 6).join(' ');
    return words.length > 0 ? words + '…' : 'Voice message';
  }

  setRecipient(email) {
    this.to = email;
    return this;
  }

  setSchedule(time) {
    this.scheduleTime = time;
    return this;
  }

  toJSON() {
    return {
      to: this.to,
      subject: this.subject,
      body: this.body,
      scheduleTime: this.scheduleTime,
    };
  }

  isValid() {
    return this.to.includes('@') && this.body.length > 0;
  }
}
