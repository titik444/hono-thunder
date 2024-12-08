import { HTTPException } from 'hono/http-exception'
import {
  CreateBookmarkRequest,
  ListBookmarkRequest,
  ListBookmarkResponse,
  toBookmarkResponse
} from '../model/bookmark.model'
import { prisma } from '../utils/prisma'
import { BookmarkValidation } from '../validation/bookmark.validation'
import { Post, User } from '@prisma/client'
import { Pageable } from '../model/page.model'

export class BookmarkService {
  static async create(user: User, request: CreateBookmarkRequest): Promise<boolean> {
    request = BookmarkValidation.CREATE.parse(request)

    await this.postMustExists(request.post_id)

    try {
      await prisma.bookmark.create({
        data: {
          post_id: request.post_id,
          user_id: user.id
        }
      })

      return true
    } catch (error: any) {
      throw new HTTPException(422, {
        message: "You've already bookmarked this post"
      })
    }
  }

  static async list(user: User, request: ListBookmarkRequest): Promise<Pageable<ListBookmarkResponse>> {
    request = BookmarkValidation.LIST.parse(request)

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        user_id: user.id
      },
      include: {
        post: {
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
        }
      },
      take: request.per_page,
      skip: (request.page - 1) * request.per_page
    })

    const total = await prisma.bookmark.count({
      where: {
        user_id: user.id
      }
    })

    return {
      data: bookmarks.map((bookmark) => toBookmarkResponse(bookmark.post)),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async remove(user: User, postId: number): Promise<boolean> {
    postId = BookmarkValidation.REMOVE.parse(postId)

    await prisma.bookmark.deleteMany({
      where: {
        post_id: postId,
        user_id: user.id
      }
    })

    return true
  }

  static async postMustExists(postId: number): Promise<Post> {
    const post = await prisma.post.findFirst({
      where: { id: postId }
    })

    if (!post) {
      throw new HTTPException(404, {
        message: 'Post not found'
      })
    }
    return post
  }
}
