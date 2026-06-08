/**
 * recipients.js — Member 2 (Email & Scheduler Lead)
 * Maps spoken names to email addresses from a contacts list.
 * Say "send to John" → looks up john@example.com
 */

export class RecipientResolver {
  constructor(contacts = []) {
    // contacts: [{ name: 'John', email: 'john@example.com' }, ...]
    this.contacts = contacts;
  }

  /**
   * Parse a voice phrase like "send to John" and return the email.
   */
  resolveFromPhrase(phrase) {
    const lower = phrase.toLowerCase();
    const match = lower.match(/send to (.+)|email (.+)|message (.+)/);
    if (!match) return null;
    const spoken = (match[1] || match[2] || match[3]).trim();
    return this.findByName(spoken);
  }

  findByName(name) {
    const lower = name.toLowerCase();
    const contact = this.contacts.find(c =>
      c.name.toLowerCase().includes(lower)
    );
    return contact ? contact.email : null;
  }

  addContact(name, email) {
    this.contacts.push({ name, email });
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('handsfreedai_contacts');
      if (saved) this.contacts = JSON.parse(saved);
    } catch (_) {}
  }

  saveToLocalStorage() {
    localStorage.setItem('handsfreedai_contacts', JSON.stringify(this.contacts));
  }

  // Default demo contacts — replace with real user contacts
  static defaultContacts() {
    return [
      { name: 'Doctor', email: 'doctor@clinic.com' },
      { name: 'Family', email: 'family@home.com' },
      { name: 'Assistant', email: 'assistant@work.com' },
    ];
  }
}
