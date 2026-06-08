# Architecture

## How the modules connect

```
App opens
    │
    ▼
[ui/renderer.js]  ←── orchestrates everything
    │
    ├──▶ [voice/recorder.js]   starts mic, streams transcript
    │         │
    │         ├──▶ [voice/silence.js]   monitors silence, fires auto-stop
    │         ├──▶ [voice/commands.js]  parses commands from speech
    │         └──▶ [voice/tts.js]       speaks feedback to user
    │
    └──▶ [email/draft.js]      builds email from transcript
              │
              ├──▶ [email/recipients.js]  resolves "send to John" → email
              ├──▶ [email/scheduler.js]   parses "tomorrow 9am" → Date
              └──▶ [email/gmail.js]       sends via Gmail API
```

## Data flow

1. `recorder.js` streams final + interim transcript text
2. Each final chunk is passed to `commands.js`
3. `commands.js` fires the matching handler in `renderer.js`
4. `renderer.js` calls the right module (email, paste, TTS)
5. `tts.js` announces the result to the user

## State machine

```
IDLE → COUNTDOWN (3s) → RECORDING → STOPPED
                                        │
                              ┌─────────┴─────────┐
                              ▼                   ▼
                         EMAIL_COMPOSE       PASTE_READY
                              │
                         EMAIL_SCHEDULED/SENT
```
