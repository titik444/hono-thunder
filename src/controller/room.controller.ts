import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { response } from '../utils/response'
import { RoomService } from '../service/room.service'
import { adminMiddleware, authMiddleware } from '../middleware/auth.middleware'
import { CreateRoomRequest, ListRoomRequest, UpdateRoomRequest } from '../model/room.model'

export const roomController = new Hono<{ Variables: ApplicationVariables }>()

roomController.get('/room/list', async (c) => {
  const rooms = await RoomService.listWithChildren()

  return response(c, 200, 'List room success', { data: rooms })
})

roomController.get('/room', authMiddleware, adminMiddleware, async (c) => {
  const request: ListRoomRequest = {
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const roomResponse = await RoomService.list(request)

  return response(c, 200, 'List room success', roomResponse)
})

roomController.post('/room', authMiddleware, adminMiddleware, async (c) => {
  const request = (await c.req.json()) as CreateRoomRequest

  const roomResponse = await RoomService.create(request)

  return response(c, 201, 'Create room success', roomResponse)
})

roomController.get('/room/:roomId', authMiddleware, adminMiddleware, async (c) => {
  const roomId = Number(c.req.param('roomId'))

  const roomResponse = await RoomService.get(roomId)

  return response(c, 200, 'Get room success', roomResponse)
})

roomController.put('/room/:roomId', authMiddleware, adminMiddleware, async (c) => {
  const roomId = Number(c.req.param('roomId'))

  const request = (await c.req.json()) as UpdateRoomRequest
  request.id = roomId

  const roomResponse = await RoomService.update(request)

  return response(c, 200, 'Update room success', roomResponse)
})

roomController.delete('/room/:roomId', authMiddleware, adminMiddleware, async (c) => {
  const roomId = Number(c.req.param('roomId'))

  const roomResponse = await RoomService.remove(roomId)

  return response(c, 200, 'Remove room success', roomResponse)
})
