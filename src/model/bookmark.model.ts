import { Bookmark, Post, Role, Room, RoomCategory, User } from '@prisma/client'

export type CreateBookmarkRequest = {
  post_id: number
}

export type ListBookmarkRequest = {
  page: number
  per_page: number
}

export type ListBookmarkResponse = {
  id: number
  content: string
  image: string | null
  user: {
    id: number
    username: string
    email: string
    name: string
    profilePicture: string | null
    role: string
  }
  room: {
    id: number
    name: string
    slug: string
    category: string
  }
}

export type PostWithRelations = Post & {
  user: User & { role: Role }
  room: Room & { category: RoomCategory }
}

export function toBookmarkResponse(bookmarks: PostWithRelations): ListBookmarkResponse {
  return {
    id: bookmarks.id,
    content: bookmarks.content,
    image: bookmarks.image ? `${process.env.BASE_URL}/${bookmarks.image}` : null,
    user: {
      id: bookmarks.user.id,
      username: bookmarks.user.username,
      email: bookmarks.user.email,
      name: bookmarks.user.name,
      profilePicture: bookmarks.user.profile_picture
        ? `${process.env.BASE_URL}/${bookmarks.user.profile_picture}`
        : null,
      role: bookmarks.user.role.name
    },
    room: {
      id: bookmarks.room.id,
      name: bookmarks.room.name,
      slug: bookmarks.room.slug,
      category: bookmarks.room.category.name
    }
  }
}
