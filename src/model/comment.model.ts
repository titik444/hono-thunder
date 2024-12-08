import { Comment, Role, User } from '@prisma/client'
import { prisma } from '../utils/prisma'

export type CreateCommentRequest = {
  content: string
  post_id: number
  parent_id?: number
  mentioned_username?: string
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
  mention?: {
    username: string
  } | null
  liked: boolean
  likeCount: number
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
  liked: boolean
  likeCount: number
}

export type CommentWithReplies = Comment & {
  user: User & { role: Role }
  replies?: CommentWithReplies[] | null
} & { likeCount?: number }

export async function toCommentWithRepliesResponse(
  user: User,
  comment: CommentWithReplies
): Promise<CommentWithRepliesResponse> {
  const liked = user ? await prisma.like.findFirst({ where: { comment_id: comment.id, user_id: user.id } }) : false

  const likeCount = await prisma.like.count({
    where: {
      comment_id: comment.id
    }
  })

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
    parentId: comment.parent_id ?? undefined,
    replies: comment.replies ? await Promise.all(comment.replies.map((reply) => toCommentResponse(user, reply))) : [],
    liked: !!liked,
    likeCount: likeCount
  }
}

export async function toCommentResponse(
  user: User,
  comment: Comment & { user: User & { role: Role } }
): Promise<CommentResponse> {
  const liked = user ? await prisma.like.findFirst({ where: { comment_id: comment.id, user_id: user.id } }) : false

  const likeCount = await prisma.like.count({
    where: {
      comment_id: comment.id
    }
  })

  const mention =
    comment.mentioned_user_id &&
    (await prisma.user.findFirst({
      where: {
        id: comment.mentioned_user_id ?? undefined
      }
    }))

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
    mention: mention ? { username: mention.username } : null,
    liked: !!liked,
    likeCount: likeCount
  }
}
