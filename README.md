# Adaptive Student Life Assistant (STITCH)
### Playful Neo-Pop & Soft Neubrutalism Study Sanctuary

A gamified, friendly, and stress-free student companion website crafted from the Stitch UI/UX design specifications found in `stitch_adaptive_student_life_assistant`.

---

## 🌟 Overview & Philosophy

The **Adaptive Student Life Assistant** combines the visual delight of **Neo-Pop** with the tactile clarity of **Soft Neubrutalism**. It removes academic anxiety through:
- **Zero Guilt Guarantee**: No jarring alarms or panic alerts; automatic bedtime protection past 10:30 PM.
- **Micro-Chunking**: Big papers and complex coding projects are sliced into bite-sized 20–25 minute sprints.
- **Warm Aesthetic**: Earthy paper cream canvas (`#FCF9F3`), crisp card surfaces, energetic coral accents (`#B71326` / `#FF4D52`), stadium pill buttons, and cloud speech bubbles.
- **Companion Mascots**:
  - **Pomi the Bunny**: High-energy cheer, gentle guidance, and encouragement.
  - **Barnaby the Bear**: Calm pacing, deep sleep protection, and guilt-free rest.

---

## 🚀 How to Run the Website

### Option 1: Direct File Launch
Double-click or open either of the following in any web browser:
- `C:\Users\LENOVO\OneDrive\Documents\Student 2\index.html`
- `C:\Users\LENOVO\.gemini\antigravity-ide\scratch\student_life_assistant\index.html`

### Option 2: Local HTTP Server (Already active!)
The local Node.js server is currently running at:
**[http://127.0.0.1:3000/](http://127.0.0.1:3000/)**

To run manually at any time:
```powershell
node "C:\Users\LENOVO\.gemini\antigravity-ide\scratch\student_life_assistant\server.js"
```

---

## 🖥️ Screen Views & Features

### 1. 📅 My Day (Daily Schedule & Rhythm)
- **Dynamic Header & Mascot**: Live greeting with Pomi status and daily quote.
- **Hydration Tracker**: Interactive "+ Sip 250ml" logger with animated refill and celebration.
- **Daily Summary Cards**: Classes Today, Planned Study Time (paced with progress bar), and Bedtime Curfew (10:30 PM with Barnaby).
- **Hour-by-Hour Timeline**: Filter by *All*, *Classes*, *Focus*, and *Downtime*. Check off items or launch focus sessions directly.
- **Quick Actions**: Add custom events and "Feeling Tired? Push Study to Tomorrow" without stress.
- **Campus Bag Checklist**: Track essential equipment with instant toggles.

### 2. 📚 Homework Hub (Assignments & Micro-Sprints)
- **Status Filter Tabs**: *To Do*, *Working On*, and *Completed* counters.
- **Featured Priority Card**: Shows the active assignment (e.g. Database ER Diagram) broken into 3 bite-sized steps with live progress percentage.
- **Direct Focus Transition**: "Start 25m Focus Block" jumps straight into the Cozy Focus Room with that assignment queued.
- **Auto-Chunker Modal**: Add any new homework with 3 quick fields; the assistant automatically generates 3 manageable micro-sprints.
- **Zero Guilt Postpone**: Safe rescheduling that preserves your streak.

### 3. ⏱️ Cozy Focus Room (Timer & Soundscapes)
- **Circular SVG Countdown**: Smooth, animated progress ring with Anton condensed typography.
- **Pace Presets**: 15m Quick, 25m Classic, 45m Deep, and 60m Surge.
- **Synthesized Ambient Soundscapes**: Powered by the Web Audio API (no external MP3s required!):
  - 🌧️ *Gentle Rain* (filtered pink/brown noise)
  - ☕ *Cozy Cafe* (acoustic ambient murmur)
  - 🪵 *Fireplace* (crackling warm hearth)
  - 🎵 *Calm Chimes* (soothing pentatonic notes)
- **Interactive Checklist**: Synced with your active assignment steps.
- **Barnaby's Care Corner**: Safe exit modal giving presence points with zero streak penalty.
- **Box Breathing Guide**: Interactive expanding visual guide (4s Inhale • 4s Hold • 4s Exhale).

### 4. 👤 Student Sign In & Desk
- **SSO Fast Login**: University Google / Canvas integration simulation.
- **1-Click Demo Profiles**: Instant testing for *Jishnu (CS Major)* and *Aanya (Pre-Med)*.
- **Security & Privacy**: Passcode visibility toggle and persistent session storage.

### 5. 📝 Student Registration (Sign Up)
- **Profile Customization**: Major, academic year, and study rhythm preferences (Morning Lark, Steady Flow, Evening Focus).
- **Companion Mascot Selection**: Choose Pomi, Barnaby, or both as your desk buddy!
- **Celebratory Onboarding**: Instant desk activation with confetti burst.

---

## 🎨 Design System Tokens

- **Fonts**: `Anton` (Display & Headlines), `Questrial` (Body Copy), `Atkinson Hyperlegible Next` (Labels & Buttons)
- **Icons**: `Material Symbols Outlined`
- **Surface**: `#FCF9F3`
- **Primary Coral**: `#B71326` / `#FF4D52`
- **Charcoal**: `#1C1C18` / `#31302D`
- **Pastel Pink**: `#FFDAD8`
- **Pastel Blue**: `#D4E3FF`
- **Butter Yellow**: `#FEF3C7`
- **Hairline Border**: `#E2E0D8`
