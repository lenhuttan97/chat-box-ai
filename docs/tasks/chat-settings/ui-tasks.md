# FT-003 UI Tasks — Chat Settings

## Phase 0: Setup & Config

- [ ] UI Components đã setup từ FT-001
- [ ] Redux store đã có từ FT-001

---

## Phase 1: Settings API

### Files

| File | Description |
|------|-------------|
| `src/services/settings.service.ts` | Settings API calls |

### Tasks

- [ ] Phase 1.1: Create settings.service.ts (getSettings, updateSettings)

---

## Phase 2: Redux Store

### Files

| File | Description |
|------|-------------|
| `src/store/slices/settingsSlice.ts` | Settings state + thunks |

### Tasks

- [ ] Phase 2.1: Create settingsSlice với redux-thunk
- [ ] Phase 2.2: Fetch settings thunk
- [ ] Phase 2.3: Update settings thunk

---

## Phase 3: Hooks

### Files

| File | Description |
|------|-------------|
| `src/hooks/useSettings.ts` | Settings logic hook |

### Tasks

- [ ] Phase 3.1: Create useSettings hook

---

## Phase 4: Settings Modal Structure

### Files

| File | Description |
|------|-------------|
| `src/components/settings/SettingsModal.tsx` | Modal chính |
| `src/components/settings/SettingsDialog.tsx` | MUI Dialog wrapper |

### Tasks

- [ ] Phase 4.1: SettingsDialog (MUI Dialog)
- [ ] Phase 4.2: Modal layout (Header, Content, Footer)

---

## Phase 5: Settings Form Fields

### Files

| File | Description |
|------|-------------|
| `src/components/settings/ConversationNameField.tsx` | Tên conversation |
| `src/components/settings/SystemPromptField.tsx` | AI Role |
| `src/components/settings/ContextField.tsx` | Context |

### Tasks

- [ ] Phase 5.1: ConversationNameField (MUI TextField)
- [ ] Phase 5.2: SystemPromptField (multiline)
- [ ] Phase 5.3: ContextField (multiline)

---

## Phase 6: Settings Sliders

### Files

| File | Description |
|------|-------------|
| `src/components/settings/TemperatureSlider.tsx` | Temperature |
| `src/components/settings/MaxTokensSlider.tsx` | Max Tokens |

### Tasks

- [ ] Phase 6.1: TemperatureSlider (MUI Slider 0-1)
- [ ] Phase 6.2: MaxTokensSlider (MUI Slider)

---

## Phase 7: Settings Actions

### Files

| File | Description |
|------|-------------|
| `src/components/settings/SettingsButton.tsx` | Button mở modal |
| `src/components/settings/SettingsActions.tsx` | Cancel/Save |

### Tasks

- [ ] Phase 7.1: SettingsButton (icon trong header)
- [ ] Phase 7.2: SettingsActions (Cancel/Save buttons)

---

## Phase 8: Integration

### Tasks

- [ ] Phase 8.1: Connect Modal → Redux → API
- [ ] Phase 8.2: Form validation
- [ ] Phase 8.3: Success/Error notifications (MUI Snackbar)
- [ ] Phase 8.4: Dark mode styling

---

## Layer Order (Bottom to Top)

```
┌─────────────────────────────────────────┐
│  Phase 4-7: Settings UI Components      │
├─────────────────────────────────────────┤
│  Phase 3: Hooks                         │
├─────────────────────────────────────────┤
│  Phase 2: Redux Store                   │
├─────────────────────────────────────────┤
│  Phase 1: Settings API Service          │
└─────────────────────────────────────────┘
```

---

## Dependencies

```bash
# Already installed from FT-001
# @mui/material, @mui/icons-material
```
