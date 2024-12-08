import { Room, RoomCategory } from '@prisma/client'

export type CreateRoomRequest = {
  name: string
  category_id: number
  parent_id?: number
}

export type ListRoomRequest = {
  page: number
  per_page: number
}

export type UpdateRoomRequest = {
  id: number
  name: string
  category_id: number
  parent_id?: number
}

export type RoomResponse = {
  id: number
  name: string
  slug: string
  parentId: number | null
  category: string
}

export type RoomChildResponse = {
  id: number
  name: string
  slug: string
  parentId: number | null
  category: string
  children?: RoomChildResponse[]
}

export type ListRoomResponse = {
  data: RoomResponse[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
  }
}

export type RoomChild = Room & { category: RoomCategory }

export function toRoomResponse(room: Room & { category: RoomCategory }): RoomResponse {
  return {
    id: room.id,
    name: room.name,
    slug: room.slug,
    parentId: room.parent_id,
    category: room.category.name
  }
}

export function toRoomChildResponse(room: RoomChild): RoomChildResponse {
  return {
    id: room.id,
    name: room.name,
    slug: room.slug,
    parentId: room.parent_id,
    category: room.category.name
  }
}
