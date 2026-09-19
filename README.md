# Marriage Scorer

A points calculator for the card game **Marriage** (3-deck variant, with
Tunnela/Dublee), built for tables of 5–8 players. Originally a single
self-contained HTML file (see `marriage-scorer-handoff.md` for the full
spec — scoring formula, rules, UI flow); this repo wraps that app for both
Android (native, via Capacitor) and iPhone/web (installable from Safari).

## Two ways to run it

### 1. iPhone / any browser — no build needed
Open `docs/index.html` via GitHub Pages once enabled (Settings → Pages →
Deploy from branch → `main` → folder `/docs`), then on iPhone: Safari →
Share → **Add to Home Screen**. Installs like a real app, works offline,
saves your players/rounds locally on-device.

### 2. Android — native app via Android Studio
`android/app/src/main/assets/public` already contains a synced, ready-to-
build copy of the app — **no Node.js needed** just to build and sideload:
1. Install [Android Studio](https://developer.android.com/studio).
2. **Open** the `android/` folder as a project, let Gradle sync finish.
3. Plug in your phone (USB debugging on), hit **Run**.

No developer account, Play Store, or root needed.

## What's here

```
marriageapplication/
├── www/index.html           the app source (HTML/CSS/vanilla JS,
│                              persists state via Capacitor Preferences,
│                              falls back to localStorage in a browser)
├── src/native-bridge.js      bundled into www/capacitor-bridge.js; exposes
│                              the Preferences plugin as window.CapacitorPreferences
├── docs/                     copy of www/ served via GitHub Pages for iPhone/web
├── resources/                 source icon art (green/gold/cream "M" mark)
├── android/                   generated native Android project + full icon set
├── capacitor.config.json
└── scripts/generate-icons.js  regenerates resources/icon-*.png from the mark
```

Persistence: the whole in-memory `state` (players, rules, rounds, current
round draft, theme) saves immediately after every screen transition and
debounced (~250ms) on every keystroke, and restores on launch before the
first render.

App icon: generated from the app's green `#0f3d2e` / gold `#c9a24b` / cream
`#f4ecd8` "M" mark. Full Android icon set (legacy, round, adaptive
foreground/background, every density) is under `android/app/src/main/res/mipmap-*`.
Re-run `npm run gen:icons && npx capacitor-assets generate --android` if
the mark ever changes.

## If you want to edit the app itself

`www/index.html` is the real source; `android/app/src/main/assets/public`
and `docs/` are synced/copied outputs, not regenerated automatically. After
changing `www/index.html` or `src/native-bridge.js`:

```bash
npm install        # one-time
npm run sync        # rebuilds capacitor-bridge.js, re-copies www/ into android/
cp www/index.html docs/index.html
cp www/capacitor-bridge.js docs/capacitor-bridge.js
```
Then rebuild in Android Studio (or `cd android && ./gradlew assembleDebug`).

## Build status note

The Android Gradle build itself has not been run to completion from this
tooling session: outbound network here is proxied and blocks
`dl.google.com` (where the Android Gradle Plugin / AndroidX dependencies
live), and no Android SDK is installed. That's a sandbox limitation, not a
project issue — `android/app/src/main/assets/public` is already synced and
ready, so opening `android/` in Android Studio on your own machine and
letting Gradle sync (which needs that network access) is the remaining
step.

## Notes

- **"Point ko Daam"** field on the setup screen is intentionally decorative
  — stored but not read by the scoring formula.
- iOS native wrapping (`npx cap add ios`) needs a Mac + Xcode and hasn't
  been set up — the `docs/` GitHub Pages route above is the no-Mac path
  to get this on an iPhone today.
