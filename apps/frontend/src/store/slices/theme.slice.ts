import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeSetting = 'light' | 'dark' | 'auto'

interface ThemeState {
  darkMode: boolean
  themeSetting: ThemeSetting
}

const getInitialThemeSetting = (): ThemeSetting => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('themeSetting') as ThemeSetting
    if (stored) return stored
  }
  return 'auto'
}

const getInitialDarkMode = (themeSetting: ThemeSetting): boolean => {
  if (themeSetting === 'light') return false
  if (themeSetting === 'dark') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const initialState: ThemeState = {
  themeSetting: getInitialThemeSetting(),
  darkMode: getInitialDarkMode(getInitialThemeSetting()),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      if (state.darkMode) {
        state.themeSetting = 'dark'
      } else {
        state.themeSetting = 'light'
      }
      localStorage.setItem('themeSetting', state.themeSetting)
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
      state.themeSetting = action.payload ? 'dark' : 'light'
      localStorage.setItem('themeSetting', state.themeSetting)
    },
    setThemeSetting: (state, action: PayloadAction<ThemeSetting>) => {
      state.themeSetting = action.payload
      if (action.payload === 'auto') {
        state.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      } else {
        state.darkMode = action.payload === 'dark'
      }
      localStorage.setItem('themeSetting', state.themeSetting)
    },
  },
})

export const { toggleDarkMode, setDarkMode, setThemeSetting } = themeSlice.actions
export default themeSlice.reducer
