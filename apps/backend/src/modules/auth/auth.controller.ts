import { Controller, Post, Body, Get, Put, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { TokenCookieMiddleware } from './jwt/token-cookie.middleware';
import { LoginResponse } from './dto/response/login.response'

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; displayName?: string }, @Res() res: Response) {
    const user = await this.authService.register(body.email, body.password, body.displayName);
    const token = this.authService.generateJwtToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    TokenCookieMiddleware.setTokenCookie(res, token, refreshToken);

    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token, refreshToken });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = this.authService.generateJwtToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    TokenCookieMiddleware.setTokenCookie(res, token, refreshToken);

    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token, refreshToken });
  }

  @Post('google')
  async googleLogin(@Body() body: { idToken: string }, @Res() res: Response) {
    const user = await this.authService.firebaseLogin(body.idToken);
    const token = this.authService.generateJwtToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    TokenCookieMiddleware.setTokenCookie(res, token, refreshToken);

    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token, refreshToken });
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    const user = await this.authService.validateRefreshToken(body.refreshToken);
    if (!user) {
      throw new Error('Invalid refresh token');
    }
    const token = this.authService.generateJwtToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    TokenCookieMiddleware.setTokenCookie(res, token, refreshToken);

    res.json({ user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl }, token, refreshToken });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    TokenCookieMiddleware.clearTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request) {
    const userId = req.user['sub'];
    const user = await this.authService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { user: { id: user.id, email: user.email, displayName: user.displayName, photoUrl: user.photoUrl } };
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