import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { FirebaseAuthService } from '../../services/firebaseService'

interface User {
  id: string | null
  email: string | null
  displayName: string | null
  photoURL: string | null
  provider: string | null
  firebaseUid: string | null
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
      const user = FirebaseAuthService.getCurrentUser()
      if (!user) return null
      
      return {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId || null,
        firebaseUid: user.uid,
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ displayName, photoURL }: { displayName: string; photoURL?: string }, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.updateUserProfile(displayName, photoURL)
      return { displayName, photoURL }
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
        if (state.currentUser) {
          state.currentUser.displayName = action.payload.displayName
          state.currentUser.photoURL = action.payload.photoURL || state.currentUser.photoURL
        }
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