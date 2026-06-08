/**
 * commands.js — Member 1 (Voice Engine Lead)
 * Parses transcript text and fires the matching voice command action.
 */

const COMMANDS = [
  {
    id: 'stop',
    triggers: ['stop', 'done', 'finish', 'end recording'],
    description: 'Stop the current recording',
  },
  {
    id: 'send_email',
    triggers: ['send email', 'email', 'send message', 'compose email'],
    description: 'Open email draft with transcript',
  },
  {
    id: 'paste_document',
    triggers: ['paste to document', 'paste', 'open word', 'document'],
    description: 'Copy transcript to clipboard for pasting',
  },
  {
    id: 'read_transcript',
    triggers: ['read transcript', 'read', 'play back', 'read it back'],
    description: 'Read the transcript aloud via TTS',
  },
  {
    id: 'record_again',
    triggers: ['record again', 'start over', 'new recording', 'restart'],
    description: 'Start a fresh recording session',
  },
  {
    id: 'schedule_now',
    triggers: ['send now', 'now'],
    description: 'Send email immediately',
  },
  {
    id: 'schedule_1hour',
    triggers: ['in one hour', 'in 1 hour', 'one hour', '1 hour'],
    description: 'Schedule email in 1 hour',
  },
  {
    id: 'schedule_tomorrow',
    triggers: ['tomorrow', 'tomorrow morning', 'tomorrow 9'],
    description: 'Schedule email for tomorrow 9am',
  },
];

export class CommandParser {
  constructor(handlers = {}) {
    this.handlers = handlers;
  }

  parse(text) {
    const lower = text.toLowerCase().trim();
    for (const cmd of COMMANDS) {
      for (const trigger of cmd.triggers) {
        if (lower.includes(trigger)) {
          if (this.handlers[cmd.id]) {
            this.handlers[cmd.id](text);
          }
          return cmd.id;
        }
      }
    }
    return null;
  }

  register(commandId, handler) {
    this.handlers[commandId] = handler;
  }

  listCommands() {
    return COMMANDS.map(c => ({ id: c.id, say: c.triggers[0], description: c.description }));
  }
}
