export class UserResponseDto {
  id: string
  email: string | null
  displayName: string | null
  photoUrl: string | null
  provider: string | null
  themeSetting: string
  createdAt: Date
  updatedAt: Date
}
