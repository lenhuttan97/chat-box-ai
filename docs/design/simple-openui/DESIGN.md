# Modern AI Chat Interface — Premium Design Spec

## References

| Product | Style |
|---------|-------|
| Linear | Minimal chrome, dark-first, subtle glows |
| Vercel | Clean, premium, generous whitespace |
| Open WebUI | Chat-focused, functional |
| Raycast | Developer-focused, clean |

---

## Design Philosophy

Based on modern-frontend-design principles:

- **Restraint over excess** — Fewer elements, more impact. Every element earns its place.
- **Rhythm and proportion** — Consistent spacing, proportional typography, balanced whitespace
- **Contextual authenticity** — AI chat app should feel futuristic, clean, premium
- **Emotional first impression** — "This is trustworthy. This is modern."

---

## Product Context

| Aspect | Value |
|--------|-------|
| **Niche** | AI / ML Tools |
| **Target** | Developers, power users, consumers |
| **Primary action** | Chat with AI |
| **Theme** | Dark-first (premium AI standard) |

---

## Visual System

### Color Palette

```css
/* Dark Mode (Default) */
--bg-primary: #09090b        /* Deep black-zinc */
--bg-secondary: #18181b      /* Slightly elevated */
--bg-tertiary: #27272a      /* Cards/surfaces */
--bg-glass: rgba(255,255,255,0.03)

--text-primary: #fafafa     /* Near white */
--text-secondary: #a1a1aa    /* Muted */
--text-tertiary: #71717a     /* Very muted */

--accent-primary: #10a27e   /* Emerald green */
--accent-glow: rgba(16,162,126,0.15)  /* Subtle glow */
--accent-gradient: linear-gradient(135deg, #10a27e 0%, #059669 100%)

--border-subtle: rgba(255,255,255,0.06)
--border-default: rgba(255,255,255,0.1)

--user-bubble: #27272a
--ai-bubble: transparent

/* Light Mode */
--bg-primary: #ffffff
--bg-secondary: #f4f4f5
--bg-tertiary: #e4e4e7
--text-primary: #18181b
--text-secondary: #52525b
--accent-primary: #059669
--border-subtle: rgba(0,0,0,0.06)
```

### Typography

| Element | Font | Size | Weight | Letter-spacing |
|---------|------|------|--------|----------------|
| Display | Inter | 32px | 600 | -0.02em |
| H1 | Inter | 24px | 600 | -0.02em |
| H2 | Inter | 18px | 600 | -0.01em |
| Body | Inter | 15px | 400 | 0 |
| Message | Inter | 15px | 400 | 0 |
| Caption | Inter | 13px | 400 | 0 |
| Input | Inter | 15px | 400 | 0 |

### Spacing Scale

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |
| 4xl | 64px |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Input | 24px (pill) |
| Cards | 12px |
| Messages | 16px |

---

## Layout Structure

### Main Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  AI Chat        [Search] [Model] [⚙️] [Avatar]      │ ← 56px top bar
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌───────────────────────────────────────────┐   │
│ │         │ │                                           │   │
│ │ Sidebar │ │              Chat Area                    │   │
│ │  260px  │ │           (max-width: 800px)            │   │
│ │ (collapse)│ │                                           │   │
│ │         │ │  ┌─────────────────────────────────┐      │   │
│ │ • New   │ │  │ 🤖 AI Message                   │      │   │
│ │ • Chat1 │ │  └─────────────────────────────────┘      │   │
│ │ • Chat2 │ │                                           │   │
│ │         │ │  ┌─────────────────────────────────┐      │   │
│ │         │ │  │ 👤 User Message                 │      │   │
│ │         │ │  └─────────────────────────────────┘      │   │
│ │         │ │                                           │   │
│ └─────────┘ └───────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│           ┌───────────────────────────────────┐  ↑          │ ← Input area
│           │ Type a message...                  │             │
│           └───────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| sm | 640px | Sidebar hidden, hamburger menu |
| md | 768px | Collapsible sidebar |
| lg | 1024px | Sidebar visible |
| xl | 1280px | Full layout |

---

## Component Specifications

### 1. Top Bar (56px)

**Layout:**
- Left: Logo (24px icon + "AI Chat" text)
- Center: Empty (conversation title when active)
- Right: Search icon | Model selector | Settings | Avatar

**Style:**
- Background: `--bg-secondary`
- Bottom border: 1px `--border-subtle`
- Fixed position

**Interactions:**
- Search: Opens search modal (Cmd+K)
- Model: Dropdown selector
- Settings: Opens settings panel

### 2. Sidebar (260px → collapsible)

**Sections:**
1. **New Chat button** — Full width, accent background
2. **Chat List** — Scrollable, shows conversation title + preview
3. **Footer** — Theme toggle, settings

**States:**
- Default: Visible on lg+
- Collapsed: Hidden, toggle via hamburger
- Mobile: Full-screen overlay

**Chat Item:**
- Padding: 12px
- Hover: `--bg-tertiary`
- Active: `--accent-glow` border-left

### 3. Chat Area

**Constraints:**
- Max-width: 800px (centered)
- Padding: 24px horizontal
- Auto-scroll to bottom on new message

**Message Bubbles:**

| Type | Alignment | Background | Max-width |
|------|-----------|------------|-----------|
| AI | Left | Transparent | 90% |
| User | Right | `--user-bubble` | 80% |

**Style:**
- Rounded corners (16px)
- No borders
- Generous padding (16px)
- Subtle entry animation (fade + slide up)

### 4. Input Bar

**Position:** Fixed at bottom, 24px margin

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [+]  │ Type a message...           │ [↑]   │
└─────────────────────────────────────────────┘
```

**Style:**
- Background: `--bg-tertiary`
- Border: 1px `--border-subtle`
- Border-radius: 24px (pill)
- Height: auto (min 48px, max 160px)

**Interactions:**
- Enter: Send message
- Shift+Enter: New line
- Auto-resize up to 5 lines
- Focus: Subtle glow (`--accent-glow`)

### 5. Welcome Screen

**Layout:** Centered in chat area

```
┌─────────────────────────────────────┐
│           ✦                         │
│                                     │
│     How can I help you today?       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💬 Write creative content    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📊 Analyze data            │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Style:**
- Minimal, not overwhelming
- Subtle suggestions (optional)
- Clean typography hierarchy

---

## Interactions & Animations

### Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Sidebar slide | translateX | 200ms | ease-out |
| Message appear | fade + translateY(8px) | 200ms | ease-out |
| Button hover | scale(1.02) | 150ms | ease |
| Input focus | border-color + glow | 150ms | ease |
| Modal | fade + scale | 200ms | ease-out |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + K | Open search |
| Cmd/Ctrl + N | New chat |
| Cmd/Ctrl + B | Toggle sidebar |
| Escape | Close modals |

### Micro-interactions

- **Send button**: Scale down on click (0.95)
- **Sidebar item**: Subtle background shift on hover
- **Input**: Glow effect on focus
- **Message**: Smooth scroll into view

---

## Premium Details

### Glassmorphism (Optional)

```css
.glass {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
}
```

### Subtle Glow Effects

```css
.accent-glow {
  box-shadow: 0 0 20px rgba(16,162,126,0.1);
}
```

### Noise Texture (Optional)

```css
.noise {
  position: relative;
}
.noise::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/noise.png');
  opacity: 0.02;
  pointer-events: none;
}
```

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── ChatLayout.tsx      # Main layout
│   │   ├── TopBar.tsx          # 56px top bar
│   │   └── Sidebar.tsx         # Collapsible sidebar
│   ├── chat/
│   │   ├── ChatArea.tsx        # Chat container
│   │   ├── MessageList.tsx     # Scrollable messages
│   │   ├── MessageBubble.tsx   # Single message
│   │   ├── InputBar.tsx        # Message input
│   │   └── WelcomeScreen.tsx   # Welcome UI
│   └── ui/                     # Shared UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── hooks/
│   └── useKeyboard.ts
└── styles/
    └── globals.css             # CSS variables
```

---

## Quality Checklist

Before implementation, verify:

- [ ] Typography hierarchy is clear (display > h1 > body)
- [ ] Colors use defined palette (no arbitrary hex)
- [ ] Spacing from scale (no random numbers)
- [ ] Dark mode is default, premium feel
- [ ] Interactions have smooth transitions (150-200ms)
- [ ] Mobile layout works (no horizontal scroll)
- [ ] Focus states on all interactive elements
- [ ] Loading states (skeleton) for async content

---

## Summary

The new design:

- ✅ Dark-first, premium AI aesthetic
- ✅ Collapsible sidebar (hidden on mobile)
- ✅ 56px top bar with essential controls
- ✅ Clean centered chat (max 800px)
- ✅ Pill-shaped input bar
- ✅ Subtle accent color (emerald green)
- ✅ Glassmorphism accents (optional)
- ✅ Smooth animations
- ✅ Focus on conversation content
- ✅ Premium feel — Linear/Vercel quality
