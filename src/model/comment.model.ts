import { Comment, Role, User } from '@prisma/client'
import { prisma } from '../utils/prisma'

export type CreateCommentRequest = {
  content: string
  post_id: number
  parent_id?: number
}

export type ListCommentRequest = {
  post_id: number
  page: number
  per_page: number
}

export type GetCommentRequest = {
  post_id: number
  id: number
}

export type UpdateCommentRequest = {
  post_id: number
  id: number
  content: string
}

export type RemoveCommentRequest = {
  post_id: number
  id: number
}

export type CommentResponse = {
  id: number
  postId: number
  content: string
  user: {
    id: number
    username: string
    email: string
    name: string
    profilePicture?: string | null
    role: string
  }
  replyToUser?: string | null
}

export type CommentWithRepliesResponse = {
  id: number
  postId: number
  content: string
  user: {
    id: number
    username: string
    email: string
    name: string
    profilePicture?: string | null
    role: string
  }
  parentId?: number | null
  replies: CommentResponse[]
}

export type CommentWithReplies = Comment & {
  user: User & { role: Role }
  replies?: CommentWithReplies[] | null
}

export async function toCommentWithRepliesResponse(comment: CommentWithReplies): Promise<CommentWithRepliesResponse> {
  return {
    id: comment.id,
    postId: comment.post_id,
    content: comment.content,
    user: {
      id: comment.user.id,
      username: comment.user.username,
      email: comment.user.email,
      name: comment.user.name,
      profilePicture: comment.user.profile_picture ? `${process.env.BASE_URL}/${comment.user.profile_picture}` : null,
      role: comment.user.role.name
    },
    parentId: comment.parent_id,
    replies: comment.replies ? await Promise.all(comment.replies.map((reply) => toCommentResponse(reply))) : []
  }
}

export async function toCommentResponse(comment: Comment & { user: User & { role: Role } }): Promise<CommentResponse> {
  const replyToUser = comment.parent_id
    ? await prisma.comment
        .findUnique({
          where: { id: comment.parent_id, deleted: false },
          select: {
            user: {
              select: {
                username: true
              }
            }
          }
        })
        .then((parentComment) => parentComment?.user?.username)
    : null

  return {
    id: comment.id,
    postId: comment.post_id,
    content: comment.content,
    user: {
      id: comment.user_id,
      username: comment.user.username,
      email: comment.user.email,
      name: comment.user.name,
      profilePicture: comment.user.profile_picture ? `${process.env.BASE_URL}/${comment.user.profile_picture}` : null,
      role: comment.user.role.name
    },
    replyToUser
  }
}
