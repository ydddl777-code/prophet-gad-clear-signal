# Clear Signal — Music Discernment App

## Brand
- **Brand**: Clear Signal — Music Discernment App
- **Tagline**: Test the sound. Protect the mind.
- **Scripture anchor**: "Prove all things; hold fast that which is good." — 1 Thessalonians 5:21
- **Footer attribution**: "A product of Prophet Gad — Remnant Seed LLC · Thread Bear Studio."
- **Universal positioning**: For anyone, any culture, any faith. Doctrinal foundation in secondary attribution layer only.

## Overview
A music discernment app. Users submit songs (upload, link, or search). A 2-minute listening phase plays the audio with brainwave visualization while AI analysis runs. Prophetess Huldah greets and narrates the experience. Prophet Gad speaks the final verdict. An 8-category Signal Clarity Score (0–100) is displayed along with a full breakdown PDF. Approved songs receive a Seal of Approval certificate.

**No data saved. No ads. No paywall.**

## Key Features
- **Landing / Greeting**: Huldah greets by voice (ElevenLabs or browser speech fallback), name input, age selection
- **Three input methods**: File upload (MP3/WAV), link (YouTube/Spotify/Apple Music/SoundCloud), song search (title + artist)
- **2-minute listening phase**: Full-volume audio playback, brainwave canvas visualization (green alpha / red theta), 14 rotating analysis status messages, Huldah light commentary at 45s
- **Signal Clarity Score**: 0–100 gauge. 6 analysis categories: BPM Profile, Lyrical Doctrine, Trance Inducement, Loop Repetition, Cultural Degradation, Rhythmic Archetype
- **Gad speaks the verdict**: ElevenLabs "Prophet Gad voice 12" (ELEVENLABS_VOICE_GAD secret), fallback to gad-voice.mp3
- **Universal warning framework**: Flags trance-inducing patterns across all traditions equally (EDM, worship vamps, Sufi qawwali, mantric kirtan, Caribbean drumming, subliminal pop)
- **PDF Seal of Approval certificate** for Ark verdicts
- **10-page PDF ebook**: "Gad's Tune – The Prophet Who Tuned Heaven"
- **Background music player**: Thunder Road Gospel
- TTT framework (Tabernacle · Temple · Tone) in secondary attribution layer
- Kid mode: gentler language
- Voice toggle

## Voice Characters
- **Prophetess Huldah** — Greeter & narrator. Warm, empathetic. Uses `ELEVENLABS_VOICE_HULDAH` secret. Falls back to browser speech (female voice preferred).
- **Prophet Gad** — Pronouncer. Authoritative, weighty. Uses `ELEVENLABS_VOICE_GAD` secret. Falls back to `/audio/gad-voice.mp3`.

## Required Secrets (add via Replit Secrets panel)
- `ELEVENLABS_API_KEY` — your ElevenLabs API key
- `ELEVENLABS_VOICE_GAD` — voice ID for "Prophet Gad voice 12"
- `ELEVENLABS_VOICE_HULDAH` — voice ID (pending selection)
- `HUME_API_KEY` — (future: emotional listening)
- `HUME_SECRET_KEY` — (future: emotional listening)

## Palette (Dark Cinematic — matches prophetgad.com / prophetgadspeaks.com)
- Background: near-black `hsl(20, 8%, 6%)`
- Foreground: warm cream `hsl(40, 15%, 88%)`
- Gold (primary): `hsl(43, 80%, 50%)`
- Crimson (accent): `hsl(0, 72%, 42%)`
- Purple shadow (accent only): `hsl(270, 22%, 18%)`
- Card surface: `hsl(20, 6%, 10%)`
- Always dark — no light mode

## Architecture
- **Frontend**: React + Vite + Zustand + Framer Motion
- **Backend**: Express + Multer for audio upload
- **No database**: Nothing persisted
- **PDF**: jsPDF (certificate + ebook, client-side)
- **TTS**: `/api/tts/gad` and `/api/tts/huldah` endpoints → ElevenLabs API

## Project Structure
- `client/src/pages/Home.tsx` — Main page, crimson top bar, Clear Signal title, hero copy, footer
- `client/src/components/GreetingFlow.tsx` — Huldah greeter, name/age flow, Clear Signal branding, no tribal imagery on main face
- `client/src/components/GadCharacter.tsx` — Gad avatar + 4 orbital thumbnail images (geometric diamond layout)
- `client/src/components/TTTBanner.tsx` — Secondary TTT attribution banner
- `client/src/components/UploadZone.tsx` — 3-tab upload (file / link / search), 2-min listening duration
- `client/src/components/ListeningState.tsx` — Canvas brainwave viz, 14 rotating status messages, Huldah commentary at 45s
- `client/src/components/VerdictDisplay.tsx` — Signal Clarity Score gauge, 6-category breakdown, ElevenLabs Gad voice
- `client/src/components/BackgroundPlayer.tsx` — Thunder Road Gospel player
- `client/src/components/ScriptureDialog.tsx` — Info dialog
- `client/src/components/ControlToggles.tsx` — Voice + kid-mode toggles
- `client/src/components/ShofarElement.tsx` — Animated shofar
- `client/src/lib/appState.ts` — Zustand state (phase, verdict, analysisData, userName, etc.)
- `client/src/lib/tts.ts` — ElevenLabs + browser speech fallback utilities
- `client/src/lib/certificate.ts` — jsPDF Seal of Approval
- `client/src/lib/ebook.ts` — 10-page PDF ebook
- `server/routes.ts` — POST /api/analyze (6-category analysis), POST /api/tts/:character (ElevenLabs TTS)

## Avatar Images (all in attached_assets, imported via @assets alias)
- Main (center): `Superhero_poised_in_elegant_dining_room_1773061244988.png` — armor, hands open, dining room
- Orbital TL: `Prophet_Gad_in_black_suit._Upscale._1773061244987.jpg` — black suit
- Orbital TR: `Prophet_Gad_in_uniform,_upscale._1773061244987.jpg` — full armor with spear
- Orbital BL: `Prophet_gad_trains_young_prophets_90390a5f07_1773061244986.jpeg` — training scene
- Orbital BR: `Master_prompt_prophet_gad_is_an_ancient_israelite__delpmaspu_1773061244987.png` — ancient scene

## Fonts
- Body: Lora (serif)
- Headers: Playfair Display (serif)
