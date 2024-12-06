import { MiddlewareHandler } from 'hono'
import { AuthService } from '../service/auth.service'
import { HTTPException } from 'hono/http-exception'

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

export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const user = c.get('user')

  if (!user || user.role !== 'admin') {
    throw new HTTPException(403, { message: 'You are not authorized to access this resource' })
  }

  await next()
}
