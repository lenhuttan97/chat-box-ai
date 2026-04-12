export interface AuthUser {
  id: string | null
  email: string | null
  displayName: string | null
  photoURL: string | null
  provider: string | null
  firebaseUid: string | null
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  accessToken: string | null
}

export interface User extends AuthUser {
  themeSetting?: 'light' | 'dark' | 'auto'
}


export interface AuthResponse {
  user: User | null
  token: string
  refreshToken: string
}