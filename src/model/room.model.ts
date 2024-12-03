import { Room, RoomCategory } from '@prisma/client'

export type RoomResponse = {
  id: number
  name: string
  slug: string
  parentId: number | null
  category: string
  children?: RoomResponse[]
}

export type ListRoom = Room & { category: RoomCategory }

export function toRoomResponse(room: ListRoom): RoomResponse {
  return {
    id: room.id,
    name: room.name,
    slug: room.slug,
    parentId: room.parent_id,
    category: room.category.name
  }
}
