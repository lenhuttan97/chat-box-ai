export class LoginResponse {
    user: {
        id: string,
        email: string,
        displayName: string | null,
        photoUrl: string | null
    }
    token: string
    refreshToken: string
}