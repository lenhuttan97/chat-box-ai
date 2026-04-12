import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { fetchUserProfile, updateUserProfile, setUser, clearUser, clearUserError } from '../store/slices/user.slice'
import { 
  selectCurrentUser, 
  selectUserLoading, 
  selectUserError 
} from '../store/slices/user.slice'
import type { User } from '../types'

export const useUser = () => {
  const dispatch: AppDispatch = useDispatch()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
  
  const currentUser = useAppSelector(selectCurrentUser)
  const isLoading = useAppSelector(selectUserLoading)
  const error = useAppSelector(selectUserError)
  
  const loadUser = () => dispatch(fetchUserProfile())
  
  const updateProfile = (displayName: string, photoURL?: string) => 
    dispatch(updateUserProfile({ displayName, photoURL }))
  
  const setCurrentUser = (user: User | null) => dispatch(setUser(user))
  
  const logout = () => dispatch(clearUser())
  
  const clearError = () => dispatch(clearUserError())
  
  return {
    currentUser,
    isLoading,
    error,
    loadUser,
    updateProfile,
    setCurrentUser,
    logout,
    clearError,
  }
}

export default useUser