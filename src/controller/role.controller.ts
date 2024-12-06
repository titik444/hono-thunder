import { Hono } from 'hono'
import { ApplicationVariables } from '../model/app.model'
import { response } from '../utils/response'
import { RoleService } from '../service/role.service'
import { CreateRoleRequest, ListRoleRequest } from '../model/role.model'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware'

export const roleController = new Hono<{ Variables: ApplicationVariables }>()

roleController.get('/role', authMiddleware, adminMiddleware, async (c) => {
  const request: ListRoleRequest = {
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const roleResponse = await RoleService.list(request)

  return response(c, 200, 'List role success', roleResponse)
})

roleController.post('/role', authMiddleware, adminMiddleware, async (c) => {
  const request = (await c.req.json()) as CreateRoleRequest

  const roleResponse = await RoleService.create(request)

  return response(c, 201, 'Create role success', roleResponse)
})

roleController.put('/role/:roleId', authMiddleware, adminMiddleware, async (c) => {
  const roleId = Number(c.req.param('roleId'))
  const request = {
    id: roleId,
    name: (await c.req.json()).name
  }

  const roleResponse = await RoleService.update(request)

  return response(c, 200, 'Update role success', roleResponse)
})

roleController.delete('/role/:roleId', authMiddleware, adminMiddleware, async (c) => {
  const roleId = Number(c.req.param('roleId'))

  const roleResponse = await RoleService.remove(roleId)

  return response(c, 200, 'Remove role success', roleResponse)
})
