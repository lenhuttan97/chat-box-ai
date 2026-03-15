import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { FirebaseAuthService } from '../../services/firebaseService'
import type { RootState } from '../index'

interface AuthUser {
  id: string | null
  email: string | null
  displayName: string | null
  photoURL: string | null
  provider: string | null
  firebaseUid: string | null
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  accessToken: string | null
}

// Define initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null
}

// Async thunks for authentication actions
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential: any = await FirebaseAuthService.signInWithEmail(email, password)
      const idToken = await FirebaseAuthService.getIdToken()
      FirebaseAuthService.saveTokenToCookie(idToken)
      
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        provider: userCredential.user.providerData[0]?.providerId || null,
        firebaseUid: userCredential.user.uid,
        accessToken: idToken
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerWithEmail = createAsyncThunk(
  'auth/registerWithEmail',
  async ({ email, password, displayName }: { email: string; password: string; displayName?: string }, { rejectWithValue }) => {
    try {
      const userCredential: any = await FirebaseAuthService.signUpWithEmail(email, password, displayName)
      const idToken = await FirebaseAuthService.getIdToken()
      FirebaseAuthService.saveTokenToCookie(idToken)
      
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        provider: userCredential.user.providerData[0]?.providerId || null,
        firebaseUid: userCredential.user.uid,
        accessToken: idToken
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const userCredential: any = await FirebaseAuthService.signInWithGoogle()
      const idToken = await FirebaseAuthService.getIdToken()
      FirebaseAuthService.saveTokenToCookie(idToken)
      
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        provider: userCredential.user.providerData[0]?.providerId || null,
        firebaseUid: userCredential.user.uid,
        accessToken: idToken
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.signOut()
      FirebaseAuthService.removeTokenFromCookie()
      return undefined
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ displayName, photoURL }: { displayName: string; photoURL?: string }, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.updateUserProfile(displayName, photoURL)
      return { displayName, photoURL }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  'auth/updateUserPassword',
  async ({ newPassword }: { newPassword: string }, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.updatePassword(newPassword)
      return undefined
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const sendPasswordReset = createAsyncThunk(
  'auth/sendPasswordReset',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.sendPasswordResetEmail(email)
      return undefined
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Check if there's a token in cookies
      const token = FirebaseAuthService.getTokenFromCookie()
      if (!token) {
        return rejectWithValue('No token found')
      }
      
      // Verify token is not expired
      if (FirebaseAuthService.isTokenExpired(token)) {
        FirebaseAuthService.removeTokenFromCookie()
        return rejectWithValue('Token expired')
      }
      
      // Get ID token from Firebase (will refresh if needed)
      const idToken = await FirebaseAuthService.getIdToken()
      FirebaseAuthService.saveTokenToCookie(idToken)
      
      // Get current user
      const user = FirebaseAuthService.getCurrentUser()
      if (!user) {
        return rejectWithValue('No current user')
      }
      
      return {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.providerData[0]?.providerId || null,
        firebaseUid: user.uid,
        accessToken: idToken
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Login with email
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithEmail.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          provider: action.payload.provider,
          firebaseUid: action.payload.firebaseUid
        }
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Register with email
      .addCase(registerWithEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerWithEmail.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          provider: action.payload.provider,
          firebaseUid: action.payload.firebaseUid
        }
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          provider: action.payload.provider,
          firebaseUid: action.payload.firebaseUid
        }
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<{displayName: string; photoURL?: string}>) => {
        state.isLoading = false
        if (state.user) {
          state.user.displayName = action.payload.displayName
          state.user.photoURL = action.payload.photoURL ?? state.user.photoURL
        }
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update password
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Send password reset
      .addCase(sendPasswordReset.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          displayName: action.payload.displayName,
          photoURL: action.payload.photoURL,
          provider: action.payload.provider,
          firebaseUid: action.payload.firebaseUid
        }
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.error = action.payload as string
      })
  }
})

export const { clearError } = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUser = (state: RootState) => state.auth.user
export const selectAccessToken = (state: RootState) => state.auth.accessToken
export const selectAuthError = (state: RootState) => state.auth.error
export const selectAuthLoading = (state: RootState) => state.auth.isLoading

// Custom hook for auth state
export const useAuthSelector = () => {
  // This would typically be used with useSelector from react-redux
  // For now, we'll just export the selectors
  return {
    selectAuth,
    selectIsAuthenticated,
    selectUser,
    selectAccessToken,
    selectAuthError,
    selectAuthLoading
  }
}