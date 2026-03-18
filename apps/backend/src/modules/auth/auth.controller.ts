import { Controller, Post, Body, Get, Put, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; displayName?: string }) {
    const user = await this.authService.register(body.email, body.password, body.displayName);
    const token = this.authService.generateJwtToken(user);
    return { user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = this.authService.generateJwtToken(user);
    return { user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token };
  }

  @Post('google')
  async googleLogin(@Body() body: { idToken: string }) {
    const user = await this.authService.firebaseLogin(body.idToken);
    const token = this.authService.generateJwtToken(user);
    return { user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token };
  }

  @Post('logout')
  logout() {
    // In a stateless JWT auth, logout is handled client-side by removing the token
    return { message: 'Logged out successfully' };
  }

  @Put('password')
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(@Req() req: Request, @Body() body: { oldPassword: string; newPassword: string }) {
    const userId = req.user['sub'];
    await this.authService.updatePassword(userId, body.oldPassword, body.newPassword);
    return { message: 'Password updated successfully' };
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req: Request, @Body() body: { displayName?: string; photoUrl?: string }) {
    const userId = req.user['sub'];
    const user = await this.authService.updateProfile(userId, body.displayName, body.photoUrl);
    return { user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl } };
  }
}