import { MiddlewareHandler } from 'hono'
import { AuthService } from '../service/auth.service'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')

  const user = await AuthService.get(token)

  c.set('user', user)

  await next()
}
