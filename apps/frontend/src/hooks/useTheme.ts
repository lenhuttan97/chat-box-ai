import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { toggleDarkMode, setDarkMode } from '../store/slices/theme.slice'

export const useTheme = () => {
  const dispatch: AppDispatch = useDispatch()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  
  const darkMode = useAppSelector((state) => state.theme.darkMode)
  
  const toggle = () => {
    dispatch(toggleDarkMode())
  }
  
  const setTheme = (isDark: boolean) => {
    dispatch(setDarkMode(isDark))
  }
  
  return {
    darkMode,
    toggle,
    setTheme,
  }
}

export default useTheme
