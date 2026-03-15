import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private firebaseAuth: admin.auth.Auth;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Firebase Admin SDK
    const firebaseConfig = {
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      }),
    };
    admin.initializeApp(firebaseConfig);
    this.firebaseAuth = admin.auth();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }

  async firebaseLogin(idToken: string): Promise<User> {
    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      
      // Kiểm tra xem user đã tồn tại trong DB chưa
      let user = await this.prisma.user.findUnique({ where: { firebase_uid: firebaseUid } });
      
      if (!user) {
        // Tạo user mới từ Firebase token
        user = await this.prisma.user.create({
          data: {
            email: decodedToken.email,
            firebase_uid: firebaseUid,
            display_name: decodedToken.name,
            photo_url: decodedToken.picture,
            provider: decodedToken.firebase?.sign_in_provider || 'google',
          },
        });
      }
      
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async register(email: string, password: string, displayName?: string): Promise<User> {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        display_name: displayName,
        provider: 'email',
      },
    });

    return user;
  }

  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      throw new Error('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateProfile(userId: string, displayName?: string, photoUrl?: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        display_name: displayName,
        photo_url: photoUrl,
      },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  generateJwtToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}