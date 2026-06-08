/**
 * gmail.js — Member 2 (Email & Scheduler Lead)
 * Gmail API integration using OAuth2.
 * Setup guide: docs/SETUP_GMAIL.md
 */

export class GmailSender {
  constructor(auth) {
    this.auth = auth; // OAuth2 client from Google APIs
  }

  /**
   * Send an email immediately.
   * @param {Object} draft - { to, subject, body }
   */
  async send(draft) {
    const raw = this._buildRaw(draft.to, draft.subject, draft.body);
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.auth.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });
    if (!response.ok) throw new Error('Failed to send email: ' + response.statusText);
    return await response.json();
  }

  /**
   * Schedule an email by storing it and sending at the right time.
   * In production: use a backend cron job or Google Tasks API.
   */
  async schedule(draft, sendAt) {
    const delayMs = sendAt.getTime() - Date.now();
    if (delayMs <= 0) return this.send(draft);
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await this.send(draft);
        resolve(result);
      }, delayMs);
    });
  }

  _buildRaw(to, subject, body) {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\n');
    return btoa(unescape(encodeURIComponent(email)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
