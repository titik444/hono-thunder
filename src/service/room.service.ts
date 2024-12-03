import { prisma } from '../utils/prisma'
import { ListRoom, RoomResponse, toRoomResponse } from '../model/room.model'

export class RoomService {
  // Fetch all rooms with their relationships
  static async list(): Promise<RoomResponse[]> {
    const rooms = await prisma.room.findMany({
      include: { children: true, category: true }
    })

    // Build hierarchical structure
    const hierarchy = this.buildRoomHierarchy(rooms, null)

    return hierarchy
  }

  private static buildRoomHierarchy(rooms: ListRoom[], parentId: number | null): RoomResponse[] {
    const nodes: ListRoom[] = rooms.filter((room) => room.parent_id === parentId)

    return nodes.map((node: ListRoom) => ({
      ...toRoomResponse(node),
      children: this.buildRoomHierarchy(rooms, node.id) // Recursive for child nodes
    }))
  }
}
