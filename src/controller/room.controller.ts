import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { response } from '../utils/response'
import { RoomService } from '../service/room.service'

export const roomController = new Hono<{ Variables: ApplicationVariables }>()

roomController.get('/room/list', async (c) => {
  const rooms = await RoomService.listWithChildren()

  return response(c, 200, 'List room success', { data: rooms })
})
