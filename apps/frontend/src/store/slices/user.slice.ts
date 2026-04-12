import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authMiddleware } from '../../middleware/auth.middleware'

interface User {
  id: string | null
  email: string | null
  displayName: string | null
  photoUrl: string | null
  provider: string | null
  firebaseUid: string | null
  themeSetting?: 'light' | 'dark' | 'auto'
}

interface UserState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
}

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Get user profile from backend API instead of Firebase
      const user = await authMiddleware.getCurrentUser()
      return user
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ displayName, photoUrl }: { displayName: string; photoUrl?: string }, { rejectWithValue }) => {
    try {
      // Get current token
      const token = authMiddleware.getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Update user profile through auth service
      const updatedUser = await authMiddleware.updateProfile(displayName, photoUrl || '', token)
      return updatedUser
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
    },
    clearUserError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        // Update the current user with the returned data
        state.currentUser = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, clearUser, clearUserError } = userSlice.actions
export default userSlice.reducer

export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading
export const selectUserError = (state: { user: UserState }) => state.user.error