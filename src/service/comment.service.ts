import { Post, User } from '@prisma/client'
import {
  CommentResponse,
  CommentWithRepliesResponse,
  CreateCommentRequest,
  GetCommentRequest,
  ListCommentRequest,
  RemoveCommentRequest,
  toCommentResponse,
  toCommentWithRepliesResponse,
  UpdateCommentRequest
} from '../model/comment.model'
import { HTTPException } from 'hono/http-exception'
import { prisma } from '../utils/prisma'
import { CommentValidation } from '../validation/comment.validation'
import { Pageable } from '../model/page.model'

export class CommentService {
  static async create(user: User, request: CreateCommentRequest): Promise<CommentResponse> {
    // validasi request
    request = CommentValidation.CREATE.parse(request)

    const post = await this.postMustExists(request.post_id)

    // simpan comment ke database
    const comment = await prisma.comment.create({
      data: {
        content: request.content,
        post_id: post.id,
        user_id: user.id,
        parent_id: request.parent_id
      },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    return toCommentResponse(comment)
  }

  static async list(request: ListCommentRequest): Promise<Pageable<CommentWithRepliesResponse>> {
    request = CommentValidation.LIST.parse(request)

    const post = await this.postMustExists(request.post_id)

    const skip = (request.page - 1) * request.per_page

    const comments = await prisma.comment.findMany({
      where: {
        post_id: post.id,
        parent_id: null,
        deleted: false
      },
      include: {
        user: {
          include: {
            role: true
          }
        },
        replies: {
          where: { deleted: false },
          include: {
            user: {
              include: {
                role: true
              }
            }
          }
        }
      },
      take: request.per_page,
      skip: skip
    })

    const total = await prisma.comment.count({
      where: {
        post_id: post.id,
        parent_id: null,
        deleted: false
      }
    })

    return {
      data: await Promise.all(comments.map((comment) => toCommentWithRepliesResponse(comment))),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async get(request: GetCommentRequest): Promise<CommentResponse> {
    request = CommentValidation.GET.parse(request)

    const comment = await prisma.comment.findFirst({
      where: { id: request.id, post_id: request.post_id, deleted: false },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    if (!comment) {
      throw new HTTPException(404, {
        message: 'Comment not found'
      })
    }

    return toCommentResponse(comment)
  }

  static async update(user: User, request: UpdateCommentRequest): Promise<CommentResponse> {
    request = CommentValidation.UPDATE.parse(request)

    const comment = await prisma.comment.findFirst({
      where: { id: request.id, post_id: request.post_id, user_id: user.id },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    if (!comment) {
      throw new HTTPException(404, {
        message: 'Comment not found'
      })
    }

    if (comment.user_id !== user.id) {
      throw new HTTPException(403, {
        message: 'You are not authorized to update this comment'
      })
    }

    const updatedComment = await prisma.comment.update({
      where: { id: comment.id },
      data: {
        content: request.content
      },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    return toCommentResponse(updatedComment)
  }

  static async remove(user: User, request: RemoveCommentRequest): Promise<Boolean> {
    request = CommentValidation.REMOVE.parse(request)

    const comment = await prisma.comment.findFirst({
      where: { id: request.id, post_id: request.post_id, user_id: user.id, deleted: false },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    if (!comment) {
      throw new HTTPException(404, {
        message: 'Comment not found'
      })
    }

    if (comment.user_id !== user.id) {
      throw new HTTPException(403, {
        message: 'You are not authorized to remove this comment'
      })
    }

    // soft delete
    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        deleted: true
      }
    })

    return true
  }

  static async postMustExists(postId: number): Promise<Post> {
    const post = await prisma.post.findFirst({
      where: { id: postId, deleted: false }
    })

    if (!post) {
      throw new HTTPException(404, {
        message: 'Post not found'
      })
    }
    return post
  }
}
