import fs from 'fs'
import { prisma } from '../utils/prisma'
import { GetUserRequest, toUserResponse, UpdateUserRequest, UserResponse } from '../model/user.model'
import { UserValidation } from '../validation/user.validation'
import { HTTPException } from 'hono/http-exception'
import { User } from '@prisma/client'

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

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    request = UserValidation.UPDATE.parse(request)

    // update password
    if (request.password) {
      user.password = await Bun.password.hash(request.password, {
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

    const updatedUser = await prisma.user.update({
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

    return toUserResponse(updatedUser)
  }
}
