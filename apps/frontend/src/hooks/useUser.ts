import { useDispatch, useSelector, TypedUseSelectorHook, useEffect } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { fetchUserProfile, updateUserProfile, setUser, clearUser, clearUserError } from '../store/slices/user.slice'
import {
  selectCurrentUser,
  selectUserLoading,
  selectUserError
} from '../store/slices/user.slice'
import { selectUser as selectAuthUser, selectIsAuthenticated } from '../store/slices/auth.slice'
import type { User } from '../types'

export const useUser = () => {
  const dispatch: AppDispatch = useDispatch()
  const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  // Lấy thông tin user từ cả hai slice
  const currentUser = useAppSelector(selectCurrentUser)
  const isLoading = useAppSelector(selectUserLoading)
  const error = useAppSelector(selectUserError)

  const loadUser = () => dispatch(fetchUserProfile())

  const updateProfile = (displayName: string, photoUrl?: string) =>
    dispatch(updateUserProfile({ displayName, photoUrl }))

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