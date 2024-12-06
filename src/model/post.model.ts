import { Post, Role, Room, RoomCategory, User } from '@prisma/client'
import { prisma } from '../utils/prisma'

export type CreatePostRequest = {
  content: string
  slug: string
  image?: string
}

export type GetPostRequest = {
  slug: string
  id: number
}

export type UpdatePostRequest = {
  slug: string
  id: number
  content: string
  image?: string
}

export type RemovePostRequest = {
  slug: string
  id: number
}

export type PostResponse = {
  id: number
  content: string
  image?: string | null
  user: {
    id: number
    username: string
    email: string
    name: string
    profilePicture?: string | null
    role: string
  }
  room: {
    id: number
    name: string
    slug: string
    category: string
  }
  bookmarked: boolean
  liked: boolean
  likeCount: number
  commentCount: number
}

export type ListPostRequest = {
  slug: string
  page: number
  per_page: number
}

export type PostWithRelations = Post & { user: User & { role: Role } } & { room: Room & { category: RoomCategory } } & {
  likeCount?: number
}

export async function toPostResponse(user: User, post: PostWithRelations): Promise<PostResponse> {
  const liked = user ? await prisma.like.findFirst({ where: { post_id: post.id, user_id: user.id } }) : false
  const bookmarked = user ? await prisma.bookmark.findFirst({ where: { post_id: post.id, user_id: user.id } }) : false

  // likeCount
  const likeCount = await prisma.like.count({
    where: {
      post_id: post.id
    }
  })

  // commentCount
  const commentCount = await prisma.comment.count({
    where: {
      post_id: post.id,
      deleted: false
    }
  })

  return {
    id: post.id,
    content: post.content,
    image: post.image ? `${process.env.BASE_URL}/${post.image}` : null,
    user: {
      id: post.user.id,
      username: post.user.username,
      email: post.user.email,
      name: post.user.name,
      profilePicture: post.user.profile_picture ? `${process.env.BASE_URL}/${post.user.profile_picture}` : null,
      role: post.user.role.name
    },
    room: {
      id: post.room.id,
      name: post.room.name,
      slug: post.room.slug,
      category: post.room.category.name
    },
    bookmarked: !!bookmarked,
    liked: !!liked,
    likeCount: likeCount,
    commentCount: commentCount
  }
}
