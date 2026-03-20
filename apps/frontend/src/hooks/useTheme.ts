import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { toggleDarkMode, setDarkMode, setThemeSetting, ThemeSetting } from '../store/slices/theme.slice'

export const useTheme = () => {
  const dispatch: AppDispatch = useDispatch()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  
  const darkMode = useAppSelector((state) => state.theme.darkMode)
  const themeSetting = useAppSelector((state) => state.theme.themeSetting)
  
  const toggle = () => {
    dispatch(toggleDarkMode())
  }
  
  const setTheme = (isDark: boolean) => {
    dispatch(setDarkMode(isDark))
  }

  const handleSetThemeSetting = (setting: ThemeSetting) => {
    dispatch(setThemeSetting(setting))
  }
  
  return {
    darkMode,
    toggle,
    setTheme,
    themeSetting,
    setThemeSetting: handleSetThemeSetting,
  }
}

export default useTheme
