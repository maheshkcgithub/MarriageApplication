# Marriage Scorer — Handoff for Claude Code

## What this is
A browser-based points calculator for the card game **Marriage** (3-deck variant, with Tunnela/Dublee), built for tables of 5–6 players. It currently exists as a single self-contained HTML file: **`marriage-scorer.html`** (attached alongside this doc). No frameworks, no build step — plain HTML/CSS/vanilla JS, all state kept in memory via a small hand-rolled `render()` function.

## The task
Wrap `marriage-scorer.html` as a real installable native app using **Capacitor**, so it can be:
1. Built and sideloaded onto a personal Android phone (primary goal, no developer account needed)
2. Optionally built for iOS later if a Mac + Xcode is available
3. Optionally published to Play Store / App Store later (not required now)

Do **not** rewrite the app's UI or logic — just wrap it as-is. The only functional addition needed is **persistent storage** (see below), since right now closing the app loses all data.

## Required change during wrapping: persistent storage
The web version intentionally has no `localStorage`/`sessionStorage` (those don't work reliably in the Claude.ai artifact preview it was built in). Once wrapped in Capacitor, replace the in-memory `state` persistence with **Capacitor's Preferences (Storage) plugin**, so:
- Players, rules, and all rounds survive force-closing the app
- Load saved state on app start; save on every state change (or at least after each `finishRound()` and `render()` call)

## App icon / branding already defined
The HTML's `<head>` already includes an inline SVG mark (a green rounded square, gold border, cream serif "M") used as favicon/apple-touch-icon/manifest icon. Reuse this exact mark (green `#0f3d2e`, gold `#c9a24b`, cream `#f4ecd8`) for the native app icon — generate proper icon sizes (Android adaptive icon + iOS icon set) from it rather than inventing new branding.

## Design tokens (for reference, don't need to change)
- Colors: felt green `#0f3d2e` (background), cream `#f4ecd8` (text), gold `#c9a24b` / `#e0bf6f` (accent), red `#b23a2e`
- Fonts: 'Fraunces' (headings, serif) + 'Inter' (body, sans) via Google Fonts
- Light/dark theme supported via `data-theme` attribute + `prefers-color-scheme`

## App structure (3-step wizard, all in one file)
1. **Setup** — add 2–8 player names; set one rule field, **"Point ko Daam"** (currently unused in scoring math — was originally a Kot multiplier, later repurposed as a point-to-currency idea, but no calculation currently reads it. Leave as-is unless asked to wire it up).
2. **Round entry** — for each round:
   - Pick one player as **Winner** (radio button)
   - Every player (winner included) has a **Maal** field (points that earn them money) and a **Dublee** checkbox (default OFF)
   - Non-winners additionally have a **Points liable** field, which is forced to 0 and disabled in the UI when their Dublee is checked
3. **Scoreboard** — running total per player across all rounds, sorted **highest-first** (positive = winning, unlike traditional point-count games). The ♛ marks whoever has the highest (most positive) total. An expandable "round-by-round breakdown" table shows each round's per-player score plus their Maal amount and Dublee status for that round.

## Exact scoring formula (already implemented in the JS — reference only)
Let `N` = number of players, `totalMaal` = sum of every player's Maal entered that round.

For each **non-winning** player `p`:
```
effectiveLiable = p.dublee ? 0 : p.liable
score[p] = (p.maal * N) - totalMaal - effectiveLiable
if (winner.dublee) score[p] -= 5   // winner's Dublee charges every other player 5 extra
```

For the **winner**:
```
score[winner] = -(sum of all non-winning players' scores)
```

This is intentionally zero-sum-ish by construction (winner's total mirrors what everyone else owes/earns).

## Known non-goals / things intentionally left out
- No card-by-card point calculator — players just enter a total "Points liable" number themselves
- No enforcement that Maal/liable numbers are "valid" per actual card rules — it's a scorekeeping tool, not a rules engine
- "Point ko Daam" field exists but is currently decorative/unused in scoring

## Suggested first Claude Code steps
1. `npm create @capacitor/app` (or add Capacitor to a minimal wrapper project) using `marriage-scorer.html` as the web asset
2. Wire up Capacitor Preferences for persistence as described above
3. Generate app icons from the inline SVG mark
4. Build an Android debug APK and test on a physical device via USB / `adb install`
5. (Later, optional) Set up iOS project if a Mac is available, or prep for Play Store internal testing track
