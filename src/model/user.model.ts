import { User } from '@prisma/client'

export type GetUserRequest = {
  username: string
}

export type ListUserRequest = {
  page: number
  per_page: number
}

export type UpdateUserRequest = {
  old_password?: string
  new_password?: string
  name?: string
  profile_picture?: string
}

export type UserResponse = {
  id: number
  username: string
  email: string
  name: string
  profilePicture?: string | null
  role: string
  accessToken?: string
  refreshToken?: string
}

export type ListUserResponse = {
  data: UserResponse[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
  }
}

export function toUserResponse(user: User & { role: { name: string } }): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    profilePicture: user.profile_picture ? `${process.env.BASE_URL}/${user.profile_picture}` : null,
    role: user.role.name
  }
}
