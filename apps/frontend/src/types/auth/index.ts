export interface AuthUser {
  id: string | undefined
  email: string | undefined
  displayName: string | undefined
  photoUrl: string | undefined
  provider: string | undefined
  firebaseUid: string | undefined
}

export interface AuthState {
  user: AuthUser | undefined
  isAuthenticated: boolean
  isLoading: boolean
  error: string | undefined
  accessToken: string | undefined
}

export interface User extends AuthUser {
  themeSetting?: 'light' | 'dark' | 'auto'
}


export interface AuthResponse {
  user: User | undefined
  token: string
  refreshToken: string
}