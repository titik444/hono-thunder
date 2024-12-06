import fs from 'fs'
import { prisma } from '../utils/prisma'
import {
  GetUserRequest,
  ListUserRequest,
  ListUserResponse,
  toUserResponse,
  UpdateUserRequest,
  UserResponse
} from '../model/user.model'
import { UserValidation } from '../validation/user.validation'
import { HTTPException } from 'hono/http-exception'
import { User } from '@prisma/client'
import { signJWT } from '../utils/jwt'

const ACCESS_TOKEN_EXPIRATION = 60 * 60 * 24 // 1 day
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 7 // 7 days

export class UserService {
  static async get(request: GetUserRequest): Promise<UserResponse> {
    request = UserValidation.GET.parse(request)

    const user = await prisma.user.findUnique({
      where: {
        username: request.username
      },
      include: {
        role: true
      }
    })

    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found'
      })
    }

    return toUserResponse(user)
  }

  static async list(request: ListUserRequest): Promise<ListUserResponse> {
    request = UserValidation.LIST.parse(request)

    const skip = (request.page - 1) * request.per_page

    const users = await prisma.user.findMany({
      where: {
        deleted: false
      },
      skip,
      take: request.per_page,
      include: {
        role: true
      }
    })

    const total = await prisma.user.count({
      where: {
        deleted: false
      }
    })

    return {
      data: users.map(toUserResponse),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    request = UserValidation.UPDATE.parse(request)

    // update password
    if (request.old_password || request.new_password) {
      if (!request.old_password) {
        throw new HTTPException(400, {
          message: 'Old password is required'
        })
      }

      if (!request.new_password) {
        throw new HTTPException(400, {
          message: 'New password is required'
        })
      }

      const isPasswordValid = await Bun.password.verify(request.old_password, user.password, 'bcrypt')

      if (!isPasswordValid) {
        throw new HTTPException(401, {
          message: 'Incorrect password'
        })
      }

      user.password = await Bun.password.hash(request.new_password, {
        algorithm: 'bcrypt',
        cost: 10
      })
    }

    // update name
    if (request.name) {
      user.name = request.name
    }

    // update profile picture
    if (request.profile_picture) {
      // Hapus gambar lama jika ada gambar baru
      if (request.profile_picture && user.profile_picture) {
        const oldImagePath = `public/${user.profile_picture}`
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath) // Hapus file gambar lama
        }
      }

      user.profile_picture = request.profile_picture
    }

    let updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        name: user.name,
        password: user.password,
        profile_picture: user.profile_picture
      },
      include: {
        role: true
      }
    })

    // update generate token
    return this.generateAuthResponse(updatedUser)
  }

  static async remove(userId: number): Promise<Boolean> {
    userId = UserValidation.REMOVE.parse(userId)

    const user = await prisma.user.findFirst({
      where: { id: userId, deleted: false }
    })

    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found'
      })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        deleted: true
      }
    })

    return true
  }

  private static async generateAuthResponse(user: User): Promise<UserResponse> {
    const accessToken = await signJWT(
      { id: user.id, username: user.username },
      { exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION }
    )
    const refreshToken = await signJWT(
      { id: user.id, username: user.username },
      { exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION }
    )

    const role = await prisma.role.findUnique({ where: { id: user.role_id } })

    if (!role) {
      throw new HTTPException(500, { message: 'Role not found' })
    }

    return {
      ...toUserResponse({ ...user, role }),
      accessToken,
      refreshToken
    }
  }
}
