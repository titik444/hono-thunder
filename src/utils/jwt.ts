import { sign, verify } from 'hono/jwt'
import CONFIG from '../config/environment'
import { JWTPayload } from 'hono/utils/jwt/types'

export const signJWT = async (payload: JWTPayload, options?: any) => {
  payload = {
    ...payload,
    ...options
  }

  return await sign(payload, CONFIG.jwt_secret ?? '')
}

export const verifyJWT = async (token: string) => {
  try {
    token = token.replace('Bearer ', '')

    const decoded: any = await verify(token, CONFIG.jwt_secret ?? '')
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === 'jwt expired or not eligible to use',
      decoded: null
    }
  }
}
