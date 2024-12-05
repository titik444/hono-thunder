import { HTTPException } from 'hono/http-exception'
import { prisma } from '../utils/prisma'
import { LikeValidation } from '../validation/like.validation'
import { LikeCommentRequest, LikePostRequest } from '../model/like.model'
import { Comment, Post } from '@prisma/client'

export class LikeService {
  static async likePost(request: LikePostRequest): Promise<boolean> {
    try {
      request = LikeValidation.LIKE_POST.parse(request)

      await this.postMustExists(request.post_id)

      await prisma.like.create({
        data: {
          post_id: request.post_id,
          user_id: request.user_id
        }
      })

      return true
    } catch (error: any) {
      throw new HTTPException(422, {
        message: "You've already liked this post"
      })
    }
  }

  static async unlikePost(request: LikePostRequest): Promise<boolean> {
    try {
      request = LikeValidation.LIKE_POST.parse(request)

      await this.postMustExists(request.post_id)

      await prisma.like.deleteMany({
        where: {
          post_id: request.post_id,
          user_id: request.user_id
        }
      })

      return true
    } catch (error: any) {
      throw new HTTPException(422, {
        message: "You haven't liked this post"
      })
    }
  }

  static async likeComment(request: LikeCommentRequest): Promise<boolean> {
    try {
      request = LikeValidation.LIKE_COMMENT.parse(request)

      await this.commentMustExists(request.comment_id)

      await prisma.like.create({
        data: {
          comment_id: request.comment_id,
          user_id: request.user_id
        }
      })

      return true
    } catch (error: any) {
      throw new HTTPException(422, {
        message: "You've already liked this comment"
      })
    }
  }

  static async unlikeComment(request: LikeCommentRequest): Promise<boolean> {
    try {
      request = LikeValidation.LIKE_COMMENT.parse(request)

      await this.commentMustExists(request.comment_id)

      await prisma.like.deleteMany({
        where: {
          comment_id: request.comment_id,
          user_id: request.user_id
        }
      })

      return true
    } catch (error: any) {
      throw new HTTPException(422, {
        message: "You haven't liked this comment"
      })
    }
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

  static async commentMustExists(commentId: number): Promise<Comment> {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId }
    })

    if (!comment) {
      throw new HTTPException(404, {
        message: 'Comment not found'
      })
    }
    return comment
  }
}
