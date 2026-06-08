/**
 * scheduler.js — Member 2 (Email & Scheduler Lead)
 * Parses voice-based schedule phrases and converts to Date objects.
 */

export class EmailScheduler {
  /**
   * Parses a voice phrase like "tomorrow 9am" into a Date.
   * Returns null if "now" or unrecognized.
   */
  static parse(phrase) {
    const p = phrase.toLowerCase().trim();
    const now = new Date();

    if (p === 'now' || p === 'send now') return null;

    if (p.includes('1 hour') || p.includes('one hour')) {
      return new Date(now.getTime() + 60 * 60 * 1000);
    }

    if (p.includes('2 hour') || p.includes('two hour')) {
      return new Date(now.getTime() + 2 * 60 * 60 * 1000);
    }

    if (p.includes('tomorrow')) {
      const tom = new Date(now);
      tom.setDate(tom.getDate() + 1);
      tom.setHours(9, 0, 0, 0);
      return tom;
    }

    if (p.includes('monday')) return EmailScheduler._nextWeekday(1);
    if (p.includes('tuesday')) return EmailScheduler._nextWeekday(2);
    if (p.includes('wednesday')) return EmailScheduler._nextWeekday(3);
    if (p.includes('thursday')) return EmailScheduler._nextWeekday(4);
    if (p.includes('friday')) return EmailScheduler._nextWeekday(5);

    return null;
  }

  static _nextWeekday(dayOfWeek) {
    const now = new Date();
    const result = new Date(now);
    const diff = (dayOfWeek - now.getDay() + 7) % 7 || 7;
    result.setDate(now.getDate() + diff);
    result.setHours(9, 0, 0, 0);
    return result;
  }

  static format(date) {
    if (!date) return 'Now';
    return date.toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  }

  static scheduleOptions() {
    return [
      { label: 'Now', phrase: 'now' },
      { label: 'In 1 hour', phrase: '1 hour' },
      { label: 'Tomorrow 9am', phrase: 'tomorrow' },
      { label: 'Monday 9am', phrase: 'monday' },
    ];
  }
}
