import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authMiddleware } from '../../middleware/auth.middleware'
import type { RootState } from '../index'
import {AuthState} from '../../types'

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
      const response = await authMiddleware.login(email, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerWithEmail = createAsyncThunk(
  'auth/registerWithEmail',
  async ({ email, password, displayName }: { email: string; password: string; displayName?: string }, { rejectWithValue }) => {
    try {
      const response = await authMiddleware.register(email, password, displayName);
      console.log("userCredential user: ", response.user);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authMiddleware.googleLogin();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authMiddleware.logout();
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
      const token = authMiddleware.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const updatedUser = await authMiddleware.updateProfile(displayName, photoURL || '', token);
      return { displayName, photoURL }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  'auth/updateUserPassword',
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const token = authMiddleware.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      await authMiddleware.updatePassword(oldPassword, newPassword, token);
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
      // Placeholder for password reset functionality
      // This would be implemented in your backend API
      throw new Error("Password reset not implemented in backend API yet");
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Check if there's a token in storage
      const token = authMiddleware.getToken();
      if (!token) {
        return rejectWithValue('No token found');
      }

      // Try to get current user to verify token is still valid
      const user = await authMiddleware.getCurrentUser();
      if (!user) {
        // Token might be expired, try to refresh
        const refreshed = await authMiddleware.refreshToken();
        if (!refreshed) {
          authMiddleware.logout();
          return rejectWithValue('Token expired and could not refresh');
        }

        // Get user with new token
        const refreshedUser = await authMiddleware.getCurrentUser();
        if (!refreshedUser) {
          return rejectWithValue('Could not get user after refresh');
        }

        return refreshedUser;
      }

      return user;
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
        const userData = action.payload.user;
        state.user = {
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          provider: userData.provider,
          firebaseUid: userData.firebaseUid
        }
        state.accessToken = action.payload.token
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
        const userData = action.payload.user;
        state.user = {
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          provider: userData.provider,
          firebaseUid: userData.firebaseUid
        }
        state.accessToken = action.payload.token
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
        const userData = action.payload.user;
        state.user = {
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          provider: userData.provider,
          firebaseUid: userData.firebaseUid
        }
        state.accessToken = action.payload.token
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
        const userData = action.payload;
        state.user = {
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          provider: userData.provider,
          firebaseUid: userData.firebaseUid
        }
        // We may not have a new token here, so only update if available
        if (action.payload.accessToken) {
          state.accessToken = action.payload.accessToken
        }
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