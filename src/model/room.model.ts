import { Room, RoomCategory } from '@prisma/client'

export type RoomChildResponse = {
  id: number
  name: string
  slug: string
  parentId: number | null
  category: string
  children?: RoomChildResponse[]
}

export type RoomChild = Room & { category: RoomCategory }

export function toRoomChildResponse(room: RoomChild): RoomChildResponse {
  return {
    id: room.id,
    name: room.name,
    slug: room.slug,
    parentId: room.parent_id,
    category: room.category.name
  }
}
