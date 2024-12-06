import { MiddlewareHandler } from 'hono'
import { AuthService } from '../service/auth.service'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')

  const user = await AuthService.get(token)

  c.set('user', user)

  await next()
}

export const optionalAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')

  if (token) {
    try {
      const user = await AuthService.get(token)
      c.set('user', user)
    } catch (err) {
      // Token invalid, lanjutkan tanpa user
      console.warn('Invalid token:', err)
    }
  }

  await next()
}
