import { Room, User } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { PostValidation } from '../validation/post.validation'
import { CreatePostRequest, ListPostRequest, PostResponse, toPostResponse } from '../model/post.model'
import { HTTPException } from 'hono/http-exception'
import { Pageable } from '../model/page.model'

export class PostService {
  static async create(user: User, request: CreatePostRequest): Promise<PostResponse> {
    // Validasi request
    request = PostValidation.CREATE.parse(request)

    const room = await this.roomMustExists(request.slug)

    // Simpan post ke database
    const post = await prisma.post.create({
      data: {
        content: request.content,
        image: request.image || null, // Save image path if exists
        room_id: room.id,
        user_id: user.id
      },
      include: {
        user: {
          include: {
            role: true
          }
        },
        room: {
          include: {
            category: true
          }
        }
      }
    })

    return toPostResponse(post)
  }

  static async list(request: ListPostRequest): Promise<Pageable<PostResponse>> {
    request = PostValidation.LIST.parse(request)

    const room = await this.roomMustExists(request.slug)

    const skip = (request.page - 1) * request.per_page

    const posts = await prisma.post.findMany({
      orderBy: {
        id: 'desc'
      },
      where: {
        room: {
          id: room.id
        }
      },
      include: {
        user: {
          include: {
            role: true
          }
        },
        room: {
          include: {
            category: true
          }
        }
      },
      take: request.per_page,
      skip: skip
    })

    const total = await prisma.post.count({
      where: {
        room: {
          id: room.id
        }
      }
    })

    return {
      data: posts.map((post) => toPostResponse(post)),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async roomMustExists(slug: string): Promise<Room> {
    const room = await prisma.room.findFirst({
      where: {
        slug: slug
      }
    })

    if (!room) {
      throw new HTTPException(404, {
        message: 'Room not found'
      })
    }

    return room
  }
}
