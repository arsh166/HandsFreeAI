# 🎙️ HandsFreeAI

> A fully hands-free, voice-controlled AI assistant built for blind and physically disabled users. No buttons. No touch. Just speak.

![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-active-brightgreen) ![Team](https://img.shields.io/badge/team-3%20members-blue)

---

## 🌟 What It Does

HandsFreeAI opens, listens, transcribes, and acts — all by voice. Designed for people who cannot see or use their hands.

| Feature | Description |
|---|---|
| 🎙️ Auto-recording | Starts recording 3 seconds after app opens — no button needed |
| 🔇 Silence detection | Auto-stops after 20 seconds of silence |
| 🗣️ Voice commands | Say "send email", "paste to document", "read transcript" |
| 📢 Audio feedback | Every action is announced via text-to-speech |
| 📧 Email scheduling | Schedule emails by voice: "send tomorrow 9am" |
| 📋 Auto-paste | Transcript auto-copied to clipboard on stop |

---

## 👥 Team & Work Split

| Member | Role | Folder | Responsibilities |
|---|---|---|---|
| **Member 1** | Voice Engine Lead | `src/voice/` | Speech recognition, silence detection, voice command parser, audio feedback (TTS) |
| **Member 2** | Email & Scheduler Lead | `src/email/` | Email drafting, Gmail API, schedule logic, recipient detection by voice |
| **Member 3** | UI & Accessibility Lead | `src/ui/` | Visual interface (for sighted helpers/developers), screen reader support, Electron desktop packaging |

> Each member owns their folder end-to-end: code, tests, and documentation.

---

## 🗂️ Project Structure

```
HandsFreeAI/
├── src/
│   ├── voice/              ← Member 1
│   │   ├── recorder.js         Speech recording engine
│   │   ├── silence.js          Silence detection logic
│   │   ├── commands.js         Voice command parser
│   │   └── tts.js              Text-to-speech feedback
│   ├── email/              ← Member 2
│   │   ├── draft.js            Email draft builder
│   │   ├── scheduler.js        Schedule send logic
│   │   ├── gmail.js            Gmail API integration
│   │   └── recipients.js       Voice-based recipient lookup
│   └── ui/                 ← Member 3
│       ├── app.html            Main app interface
│       ├── styles.css          Accessible styles
│       ├── renderer.js         UI state & rendering
│       └── electron-main.js    Desktop app entry point
├── tests/
│   ├── voice.test.js
│   ├── email.test.js
│   └── ui.test.js
├── docs/
│   ├── ARCHITECTURE.md         How all modules connect
│   ├── VOICE_COMMANDS.md       Full list of voice commands
│   └── SETUP_GMAIL.md          Gmail API setup guide
├── .github/
│   ├── workflows/
│   │   └── ci.yml              Auto-run tests on every push
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Chrome or Edge (for Web Speech API)
- Gmail API credentials (for email features — see `docs/SETUP_GMAIL.md`)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/HandsFreeAI.git
cd HandsFreeAI

# 2. Install dependencies
npm install

# 3. Run in browser (development)
npm run dev

# 4. Build desktop app (Electron)
npm run build:desktop
```

---

## 🎤 Voice Commands

| Say | Action |
|---|---|
| *"stop"* | Stop recording |
| *"send email"* | Open email draft |
| *"send to [name]"* | Set email recipient |
| *"schedule tomorrow 9am"* | Schedule the email |
| *"paste to document"* | Copy transcript to clipboard |
| *"read transcript"* | Reads transcript aloud |
| *"record again"* | Start a new recording |

Full list → [`docs/VOICE_COMMANDS.md`](docs/VOICE_COMMANDS.md)

---

## 🌿 Branching Strategy

```
main                  ← stable, production-ready
├── dev               ← integration branch (merge here first)
│   ├── voice/feat-*  ← Member 1 branches
│   ├── email/feat-*  ← Member 2 branches
│   └── ui/feat-*     ← Member 3 branches
```

**Rules:**
1. Never push directly to `main`
2. Always branch from `dev`
3. Name branches like: `voice/silence-detection`, `email/gmail-api`, `ui/electron-packaging`
4. Open a Pull Request → get 1 review → merge to `dev`
5. `dev` → `main` only when a milestone is complete

---

## 📋 Milestones

- [ ] **v0.1** — Core voice recorder + transcript (browser)
- [ ] **v0.2** — Voice commands + TTS feedback
- [ ] **v0.3** — Email draft + scheduling
- [ ] **v0.4** — Gmail API integration
- [ ] **v0.5** — Electron desktop app
- [ ] **v1.0** — Full release with multi-language support

---

## 🤝 Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for coding standards, PR guidelines, and commit message format.

---

## 📄 License

MIT — free to use, modify, and share.
