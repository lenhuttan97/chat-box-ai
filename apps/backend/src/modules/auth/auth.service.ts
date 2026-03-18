import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private firebaseAuth: admin.auth.Auth | null = null;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Firebase Admin SDK if credentials are provided
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

      // Check if Firebase configuration is present and valid
      if (projectId && clientEmail && privateKey && 
          privateKey !== 'YOUR_PRIVATE_KEY' && 
          privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        const firebaseConfig = {
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        };
        admin.initializeApp(firebaseConfig);
        this.firebaseAuth = admin.auth();
        this.logger.log('Firebase Admin SDK initialized successfully');
      } else {
        this.logger.warn('Firebase configuration not found or incomplete. Google login will be disabled.');
        this.firebaseAuth = null;
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error.stack);
      this.firebaseAuth = null;
    }
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
    // Check if Firebase is configured
    if (!this.firebaseAuth) {
      throw new UnauthorizedException('Firebase authentication is not configured on the server');
    }

    try {
      const decodedToken = await this.firebaseAuth.verifyIdToken(idToken);
      const firebaseUid = decodedToken.uid;
      
      // Kiểm tra xem user đã tồn tại trong DB chưa
      let user = await this.prisma.user.findUnique({ where: { firebaseUid: firebaseUid } });
      
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: decodedToken.email,
            firebaseUid: firebaseUid,
            displayName: decodedToken.name,
            photoUrl: decodedToken.picture,
            provider: decodedToken.firebase?.sign_in_provider || 'google',
          },
        });
      }
      
      return user;
    } catch (error) {
      this.logger.error('Firebase token verification failed', error.stack);
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
        displayName: displayName,
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
        displayName: displayName,
        photoUrl: photoUrl,
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