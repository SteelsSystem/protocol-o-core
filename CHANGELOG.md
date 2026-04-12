# CHANGELOG — Protocol O: Integrity Core 2026

> External alignment record. All entries verified against commit history.
> Format: `[DATE] [TYPE] — description | commit`

---

## [2026-04-12] SESSION — Audius API Reconnaissance

### 🎵 RECON — Audius REST API Integration Candidate
**status:** Confirmed live · Pending implementation signal

- **Source:** https://docs.audius.co
- **Type:** Fully keyless, permissionless REST API — same zero-gate model as Pollinations.
- **Proposed integration point:** `_engine.audius(query)` — third provider in engine layer, no gate required, no key exposure.
- **UI target:** Network Probe C (section 06) — new optgroup `── AUDIUS · KEYLESS ──` OR dedicated new sublayer function.

#### Available API surface confirmed

| Layer | Method | Notes |
|---|---|---|
| REST API | `GET` tracks / users / playlists | Keyless, permissionless |
| JS SDK | `npx create-audius-app` | Full SDK, stream-native |
| Auth | Log in with Audius | OAuth-style user identity |
| Protocol layer | `docs.openaudio.org` | DDEX + storage + transaction — lower sublayer |

#### Security model alignment
- Zero key requirement → no forward hole risk.
- Fits cleanly inside sealed IIFE as `_engine.audius()`.
- No `localStorage`, no DOM serialization — volatile by default.
- Implementation held pending explicit signal from architect.

---

## [2026-04-12] SESSION — Security & Architecture Realignment

### 🔒 SECURITY — API Key Forward Hole Eliminated
**commit:** `9fe2e76`

- **BUG FIXED:** API key was stored in `localStorage` and echoed into the DOM (first 6 chars visible in a persistent `#key-panel` div — a forward hole by definition.
- **FIX:** Key now lives exclusively in `let _key = ''` inside a sealed IIFE. Zero persistence. Zero DOM serialization. Zero URL exposure.
- Removed: `#key-panel` floating div, `localStorage.setItem/getItem` for key, any DOM `dataset` or attribute containing key material.
- Added: `#sublayer-gate` — a stealth full-screen modal accessible only via nav `◈` orb or `Ctrl+G`. Input field is `type="password"`, cleared on commit or close, `data-lpignore="true"` to suppress password managers.
- Orb status: 6px dot — red (no key) / green (key active). No label that reveals function.
- Key purge: wipes `_key` from memory immediately.

---

### 🏗️ ARCHITECTURE — Full Sublayer Consolidation
**commit:** `ab124cf`

- **BUG FIXED:** All functions were loose globals on `window`, callable from console or injected scripts. All HTML buttons used `onclick=""` inline attributes — a forward exposure surface.
- **FIX:** Entire JS wrapped in one sealed `(function () { 'use strict'; ... })()`. Nothing exported to `window`.

#### Sub-function layer map (post-realignment)

| Layer | Object | Responsibility |
|---|---|---|
| Credential gate | `_gate` | open / close / commit / purge / orb sync / feedback |
| Certificate | `_cert` | generate / close / download / volatile `_data` |
| Engine | `_engine` | `apiRequest` (Gemini) · `pollinations` (free) · `smart` (auto-fallback) |
| Utility | `_util` | `shortHash` · `extractStructure` — pure, side-effect-free |
| Locale | `_locale` | language data · chart instance · `init` / `set` |
| Functions | `_fn` | probe · semanticAnalyze · multiTranslate · visualAudit · bodyScanner · networkProbe · voiceBriefing |
| Wiring | `_wire()` | single binding point — all `addEventListener` calls, zero inline HTML handlers |

- All `onclick` / `onchange` / `onkeydown` attributes stripped from HTML markup.
- `_wire()` runs at `load` — one place to reroute any function.
- `_engine.smart()` is the single API traffic choke point for all feature functions. Gemini first, Pollinations fallback, one path.
- `_fn.visualAudit` is the only direct `_engine.apiRequest` caller (Gemini multimodal required — no Pollinations equivalent).

---

### 🧩 PREVIOUS — Certificate Sublayer
**commit:** `9fe2e76` (same session, pre-consolidation)

- Added `#cert-sublayer`: full-screen backdrop modal rendered on demand.
- Certificate content injected via `smartRequest()` — AI-generated seal statement.
- `_certData` is volatile — `null`-ed on dismiss, never persisted.
- Download action creates a Blob URL, revokes after 5s.
- Engine badge shown on certificate (Pollinations.AI · FREE or Gemini · O-Gate).
- Confidence bar animated via CSS transition on `setTimeout` tick.

---

### 🌐 NETWORK PROBE — Sublayer Options
**commit:** prior session

- FREE group (keyless): Pollinations text ping, Pollinations models list, Hugging Face inference ping, Cohere trial ping.
- GEMINI group (key required): list models, ping generateContent — both gate-check `_key` before firing, throw with ◈ prompt if empty.
- CUSTOM group: arbitrary GET endpoint, CORS-dependent.
- `extractStructure()` utility renders response key tree before raw JSON dump.

---

### 📋 KNOWN — Not Bugs, By Design

- **Voice briefing** shows `alert()` — server-side TTS not available in static HTML context. Intentional placeholder.
- **Visual audit** hard-requires Gemini multimodal. No Pollinations fallback exists for image input. Inline message directs user to `◈`.
- **`localStorage` fully removed** — sandbox iframe constraints make it unreliable anyway. All state is session-volatile.

---

*Protocol O — externally aligned. Last update: 2026-04-12T08:59 CEST*
