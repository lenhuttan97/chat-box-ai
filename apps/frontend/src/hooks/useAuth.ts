import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
  updateUserProfile,
  updateUserPassword,
  sendPasswordReset,
  initializeAuth,
  clearError,
  selectIsAuthenticated,
  selectUser,
  selectAccessToken,
  selectAuthError,
  selectAuthLoading
} from '../store/slices/auth.slice'

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  
  // State selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const accessToken = useAppSelector(selectAccessToken)
  const error = useAppSelector(selectAuthError)
  const isLoading = useAppSelector(selectAuthLoading)
  
  // Action creators bound to dispatch
  const loginEmail = (email: string, password: string) => 
    dispatch(loginWithEmail({ email, password }))
  
  const registerEmail = (email: string, password: string, displayName?: string) => 
    dispatch(registerWithEmail({ email, password, displayName }))
  
  const loginGoogle = () => 
    dispatch(loginWithGoogle())
  
  const logout = () => 
    dispatch(logoutUser())
  
  const updateProfile = (displayName: string, photoURL?: string) => 
    dispatch(updateUserProfile({ displayName, photoURL }))
  
  const updatePassword = (newPassword: string) => 
    dispatch(updateUserPassword({ newPassword }))
  
  const sendResetEmail = (email: string) => 
    dispatch(sendPasswordReset({ email }))
  
  const initialize = () => 
    dispatch(initializeAuth())
  
  const clearAuthError = () => 
    dispatch(clearError())
  
  return {
    // State
    isAuthenticated,
    user,
    accessToken,
    error,
    isLoading,
    
    // Actions
    loginEmail,
    registerEmail,
    loginGoogle,
    logout,
    updateProfile,
    updatePassword,
    sendResetEmail,
    initialize,
    clearAuthError
  }
}

export default useAuth