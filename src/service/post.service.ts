import fs from 'fs'
import { prisma } from '../utils/prisma'
import { Role, Room, User } from '@prisma/client'
import { HTTPException } from 'hono/http-exception'
import { PostValidation } from '../validation/post.validation'
import {
  CreatePostRequest,
  GetPostRequest,
  ListPostRequest,
  PostResponse,
  RemovePostRequest,
  toPostResponse,
  UpdatePostRequest
} from '../model/post.model'
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
        image: request.image || null,
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

    return toPostResponse(user, post)
  }

  static async list(user: User, request: ListPostRequest): Promise<Pageable<PostResponse>> {
    request = PostValidation.LIST.parse(request)

    const room = await this.roomMustExists(request.slug)

    const posts = await prisma.post.findMany({
      orderBy: {
        id: 'desc'
      },
      where: {
        room: {
          id: room.id
        },
        deleted: false
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
      skip: (request.page - 1) * request.per_page
    })

    const total = await prisma.post.count({
      where: {
        room: {
          id: room.id
        },
        deleted: false
      }
    })

    return {
      data: await Promise.all(posts.map((post) => toPostResponse(user, post))),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async get(user: User, request: GetPostRequest): Promise<PostResponse> {
    request = PostValidation.GET.parse(request)

    const room = await this.roomMustExists(request.slug) // Validasi room

    const post = await prisma.post.findFirst({
      where: { id: request.id, room_id: room.id, deleted: false },
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

    if (!post) {
      throw new HTTPException(404, {
        message: 'Post not found'
      })
    }

    return toPostResponse(user, post)
  }

  static async update(user: User, request: UpdatePostRequest): Promise<PostResponse> {
    request = PostValidation.UPDATE.parse(request)

    const room = await this.roomMustExists(request.slug) // Validasi room

    const post = await prisma.post.findFirst({
      where: { id: request.id, room_id: room.id },
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

    if (!post) {
      throw new HTTPException(404, {
        message: 'Post not found'
      })
    }

    if (post.user_id !== user.id) {
      throw new HTTPException(403, {
        message: 'You are not authorized to update this post'
      })
    }

    // Hapus gambar lama jika ada gambar baru
    if (request.image && post.image) {
      const oldImagePath = `public/${post.image}`
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath) // Hapus file gambar lama
      }
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: request.id
      },
      data: {
        content: request.content,
        image: request.image || post.image // Save image path if exists
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

    return toPostResponse(user, updatedPost)
  }

  static async remove(user: User & { role: Role }, request: RemovePostRequest): Promise<Boolean> {
    request = PostValidation.REMOVE.parse(request)

    const room = await this.roomMustExists(request.slug) // Validasi room

    const post = await prisma.post.findFirst({
      where: { id: request.id, room_id: room.id, deleted: false },
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

    if (!post) {
      throw new HTTPException(404, {
        message: 'Post not found'
      })
    }

    // user must be owner or admin or owner of room
    if (post.user_id !== user.id && user.role.name.toLowerCase() !== 'admin') {
      throw new HTTPException(403, {
        message: 'You are not authorized to remove this post'
      })
    }

    await prisma.post.update({
      where: {
        id: request.id
      },
      data: {
        deleted: true
      }
    })

    return true
  }

  static async roomMustExists(slug: string): Promise<Room> {
    const room = await prisma.room.findFirst({
      where: {
        slug: slug,
        deleted: false
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
