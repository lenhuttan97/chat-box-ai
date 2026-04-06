# UI/UX Redesign Tasks

## Overview
Update current UI/UX to match premium design specifications from `stitch_home_chat_page`:
- Dark-first, Emerald accent (#61dbb4)
- Glassmorphism effects
- Inter typography
- Noise overlay texture

## Priority: HIGH

| # | Task | GitHub Issue | Status |
|---|------|--------------|--------|
| T001 | Update Tailwind config với premium design tokens | #20 | ✅ done |
| T002 | Add global styles (noise, glassmorphism, glow) | #21 | ⏳ |
| T003 | Create premium Sidebar component | #22 | ⏳ |
| T004 | Create premium Header component | #23 | ⏳ |
| T005 | Update ChatLayout - migrate MUI → Tailwind | #24 | ⏳ |
| T006 | Create premium LoginPage | #25 | ⏳ |
| T007 | Update ChatWindow | #26 | ⏳ |
| T008 | Update InputBar - rounded-full | #27 | ⏳ |
| T009 | Update MessageList | #28 | ⏳ |
| T010 | Update ConversationList | #29 | ⏳ |

## Priority: MEDIUM

| # | Task | GitHub Issue | Status |
|---|------|--------------|--------|
| T011 | Create SettingsPage | #30 | ⏳ |
| T012 | Update ChatSettingsModal | #31 | ⏳ |
| T013 | Create HomePage empty state | #32 | ⏳ |

## Priority: LOW

| # | Task | GitHub Issue | Status |
|---|------|--------------|--------|
| T014 | Add mobile bottom navigation | #33 | ⏳ |
| T015 | Final testing & verification | #34 | ⏳ |

---

## Design Reference

**Colors:**
- Surface: `#131315`
- Primary: `#61dbb4` (Emerald)
- On-surface: `#e5e1e4`

**Layout:**
- Sidebar: 260px fixed
- Header: 56px

**Effects:**
- Glassmorphism: `backdrop-filter: blur(16px)`
- Noise overlay: 2% SVG turbulence
- Glow orbs: Radial gradient with primary color
