import { AuthService } from '../services/auth/auth.service';

const authService = new AuthService();

export const authMiddleware = {
  async login(email: string, password: string) {
    return authService.login(email, password);
  },

  async register(email: string, password: string, displayName?: string) {
    return authService.register(email, password, displayName);
  },

  async googleLogin() {
    return authService.googleLogin();
  },

  async refreshToken() {
    return authService.refreshToken();
  },

  async updatePassword(oldPassword: string, newPassword: string, token: string) {
    return authService.updatePassword(oldPassword, newPassword, token);
  },

  async updateProfile(displayName: string, photoUrl: string, token: string) {
    return authService.updateProfile(displayName, photoUrl, token);
  },

  async getCurrentUser() {
    return authService.getCurrentUser();
  },

  logout() {
    return authService.logout();
  },

  getToken() {
    return authService.getToken();
  },

  getRefreshToken() {
    return authService.getRefreshToken();
  },

  setToken(token: string) {
    authService.setToken(token);
  },

  setTokens(token: string, refreshToken: string) {
    authService.setTokens(token, refreshToken);
  },
};