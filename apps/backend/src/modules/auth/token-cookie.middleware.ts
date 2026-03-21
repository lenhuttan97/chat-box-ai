import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, Request } from 'express'

@Injectable()
export class TokenCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    next()
  }

  static setTokenCookie(res: Response, token: string, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production'
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 60 minutes
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
  }

  static clearTokenCookie(res: Response): void {
    res.cookie('token', '', { maxAge: 0 })
    res.cookie('refresh_token', '', { maxAge: 0 })
  }
}