import { prisma } from '../utils/prisma'
import { RoomChild, RoomChildResponse, toRoomChildResponse } from '../model/room.model'

export class RoomService {
  // Fetch all rooms with their relationships
  static async listWithChildren(): Promise<RoomChildResponse[]> {
    const rooms = await prisma.room.findMany({
      include: { children: true, category: true }
    })

    // Build hierarchical structure
    const hierarchy = this.buildRoomHierarchy(rooms, null)

    return hierarchy
  }

  private static buildRoomHierarchy(rooms: RoomChild[], parentId: number | null): RoomChildResponse[] {
    const nodes: RoomChild[] = rooms.filter((room) => room.parent_id === parentId)

    return nodes.map((node: RoomChild) => ({
      ...toRoomChildResponse(node),
      children: this.buildRoomHierarchy(rooms, node.id) // Recursive for child nodes
    }))
  }
}
