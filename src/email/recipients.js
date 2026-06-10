/**
 * recipients.js — amulyaachari18 (Email & Scheduler Lead)
 * Week 1 Task: Match spoken names to email addresses
 * 
 * HOW TO TEST:
 * const r = new RecipientResolver(RecipientResolver.defaultContacts());
 * console.log(r.resolveFromPhrase('send to doctor'));
 * // Returns: doctor@clinic.com
 */

export class RecipientResolver {
  constructor(contacts = []) {
    // contacts = [{ name: 'Doctor', email: 'doctor@clinic.com' }]
    this.contacts = contacts;
  }

  // Parse "send to John" and return john@email.com
  resolveFromPhrase(phrase) {
    const lower = phrase.toLowerCase();

    // Match patterns like "send to X", "email X", "message X"
    const match = lower.match(
      /(?:send to|email to|message to|send email to|email)\s+(.+)/
    );

    if (!match) return null;
    const spoken = match[1].trim();
    return this.findByName(spoken);
  }

  // Find email by name
  findByName(name) {
    const lower = name.toLowerCase();
    const contact = this.contacts.find(c =>
      c.name.toLowerCase().includes(lower)
    );
    return contact ? contact.email : null;
  }

  // Add a new contact
  addContact(name, email) {
    this.contacts.push({ name, email });
  }

  // Save contacts to browser storage
  save() {
    try {
      localStorage.setItem(
        'handsfreedai_contacts',
        JSON.stringify(this.contacts)
      );
    } catch (_) {}
  }

  // Load contacts from browser storage
  load() {
    try {
      const saved = localStorage.getItem('handsfreedai_contacts');
      if (saved) this.contacts = JSON.parse(saved);
    } catch (_) {}
  }

  // Default contacts for demo
  static defaultContacts() {
    return [
      { name: 'Doctor',    email: 'doctor@clinic.com' },
      { name: 'Family',    email: 'family@home.com' },
      { name: 'Assistant', email: 'assistant@work.com' },
      { name: 'John',      email: 'john@example.com' },
      { name: 'Manager',   email: 'manager@work.com' },
    ];
  }
}
