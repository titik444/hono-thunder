import { prisma } from '../utils/prisma'
import {
  CreateRoomRequest,
  ListRoomRequest,
  ListRoomResponse,
  RoomChild,
  RoomChildResponse,
  RoomResponse,
  toRoomChildResponse,
  toRoomResponse,
  UpdateRoomRequest
} from '../model/room.model'
import { RoomValidation } from '../validation/room.validation'
import slugify from 'slugify'

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

  static async create(request: CreateRoomRequest): Promise<RoomResponse> {
    request = RoomValidation.CREATE.parse(request)

    let slug = slugify(request.name).toLowerCase()

    const slugExists = await prisma.room.findFirst({
      where: { slug: slug }
    })

    if (slugExists) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`
    }

    const room = await prisma.room.create({
      data: {
        name: request.name,
        slug: slug,
        parent_id: request.parent_id ?? null,
        category_id: request.category_id ?? null // You'll need to add a categoryId property to your CreateRoomRequest type
      },
      include: { category: true }
    })

    return toRoomResponse(room)
  }

  static async list(request: ListRoomRequest): Promise<ListRoomResponse> {
    request = RoomValidation.LIST.parse(request)

    const rooms = await prisma.room.findMany({
      orderBy: {
        id: 'desc'
      },
      where: {
        deleted: false
      },
      include: { category: true },
      take: request.per_page,
      skip: (request.page - 1) * request.per_page
    })

    const total = await prisma.room.count({
      where: {
        deleted: false
      }
    })

    return {
      data: rooms.map(toRoomResponse),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async get(roomId: number): Promise<RoomResponse> {
    roomId = RoomValidation.GET.parse(roomId)

    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        deleted: false
      },
      include: { category: true }
    })

    if (!room) {
      throw new Error('Room not found')
    }

    return toRoomResponse(room)
  }

  static async update(request: UpdateRoomRequest): Promise<RoomResponse> {
    request = RoomValidation.UPDATE.parse(request)

    const room = await prisma.room.findFirst({
      where: { id: request.id, deleted: false }
    })

    if (!room) {
      throw new Error('Room not found')
    }

    let slug = slugify(request.name).toLowerCase()

    const slugExists = await prisma.room.findFirst({
      where: { slug: slug, id: { not: request.id } }
    })

    if (slugExists) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`
    }

    const updatedRoom = await prisma.room.update({
      where: { id: request.id },
      data: {
        name: request.name,
        slug: slug,
        parent_id: request.parent_id ?? null,
        category_id: request.category_id
      },
      include: { category: true }
    })

    return toRoomResponse(updatedRoom)
  }

  static async remove(roomId: number): Promise<Boolean> {
    roomId = RoomValidation.REMOVE.parse(roomId)

    const room = await prisma.room.findFirst({
      where: { id: roomId, deleted: false }
    })

    if (!room) {
      throw new Error('Room not found')
    }

    await prisma.room.update({
      where: { id: roomId },
      data: {
        deleted: true
      }
    })

    return true
  }

  private static buildRoomHierarchy(rooms: RoomChild[], parentId: number | null): RoomChildResponse[] {
    const nodes: RoomChild[] = rooms.filter((room) => room.parent_id === parentId)

    return nodes.map((node: RoomChild) => ({
      ...toRoomChildResponse(node),
      children: this.buildRoomHierarchy(rooms, node.id) // Recursive for child nodes
    }))
  }
}
