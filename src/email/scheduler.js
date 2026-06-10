/**
 * scheduler.js — amulyaachari18 (Email & Scheduler Lead)
 * Week 1 Task: Parse voice schedule phrases into real Date objects
 * 
 * HOW TO TEST:
 * console.log(EmailScheduler.parse('tomorrow'));
 * console.log(EmailScheduler.parse('monday'));
 * console.log(EmailScheduler.format(EmailScheduler.parse('in 1 hour')));
 */

export class EmailScheduler {

  // Turn a voice phrase into a Date object
  static parse(phrase) {
    const p = phrase.toLowerCase().trim();
    const now = new Date();

    // Send immediately
    if (p === 'now' || p === 'send now') return null;

    // In 1 hour
    if (p.includes('1 hour') || p.includes('one hour')) {
      return new Date(now.getTime() + 60 * 60 * 1000);
    }

    // In 2 hours
    if (p.includes('2 hour') || p.includes('two hour')) {
      return new Date(now.getTime() + 2 * 60 * 60 * 1000);
    }

    // Tomorrow morning
    if (p.includes('tomorrow')) {
      const tom = new Date(now);
      tom.setDate(tom.getDate() + 1);
      tom.setHours(9, 0, 0, 0);
      return tom;
    }

    // Specific weekdays
    if (p.includes('monday'))    return EmailScheduler._nextWeekday(1);
    if (p.includes('tuesday'))   return EmailScheduler._nextWeekday(2);
    if (p.includes('wednesday')) return EmailScheduler._nextWeekday(3);
    if (p.includes('thursday'))  return EmailScheduler._nextWeekday(4);
    if (p.includes('friday'))    return EmailScheduler._nextWeekday(5);
    if (p.includes('saturday'))  return EmailScheduler._nextWeekday(6);
    if (p.includes('sunday'))    return EmailScheduler._nextWeekday(0);

    return null; // default: send now
  }

  // Get next occurrence of a weekday at 9am
  static _nextWeekday(dayOfWeek) {
    const now = new Date();
    const result = new Date(now);
    const diff = (dayOfWeek - now.getDay() + 7) % 7 || 7;
    result.setDate(now.getDate() + diff);
    result.setHours(9, 0, 0, 0);
    return result;
  }

  // Format a Date into readable text
  static format(date) {
    if (!date) return 'Sending now';
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  // All schedule options shown in the UI
  static scheduleOptions() {
    return [
      { label: 'Now',           phrase: 'now' },
      { label: 'In 1 hour',     phrase: '1 hour' },
      { label: 'Tomorrow 9am',  phrase: 'tomorrow' },
      { label: 'Monday 9am',    phrase: 'monday' },
    ];
  }
}
