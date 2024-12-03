import { Role, User } from '@prisma/client'

export type RegisterUserRequest = {
  username: string
  email: string
  password: string
  name: string
}

export type LoginUserRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  id: number
  username: string
  email: string
  name: string
  profilePicture?: string | null
  role: string
  accessToken?: string
  refreshToken?: string
}

export type UserWithRole = User & { role: Role }

export function toAuthResponse(user: UserWithRole): AuthResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    profilePicture: user.profile_picture,
    role: user.role.name
  }
}
