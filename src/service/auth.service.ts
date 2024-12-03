import { HTTPException } from 'hono/http-exception'
import { User } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { signJWT, verifyJWT } from '../utils/jwt'
import { AuthValidation } from '../validation/auth.validation'
import { RegisterUserRequest, toAuthResponse, AuthResponse, LoginUserRequest } from '../model/auth.model'

const ACCESS_TOKEN_EXPIRATION = 60 * 60 * 24 // 1 day
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 7 // 7 days

export class AuthService {
  static async register(request: RegisterUserRequest): Promise<AuthResponse> {
    // Validasi dan transformasi request
    request = AuthValidation.REGISTER.parse(request)

    // Periksa username dan email unik
    await this.ensureUniqueUser(request)

    // Hash password
    request.password = await Bun.password.hash(request.password, {
      algorithm: 'bcrypt',
      cost: 10
    })

    // Simpan user ke database
    const user = await prisma.user.create({
      data: {
        ...request,
        role: { connect: { name: 'User' } }
      }
    })

    // Buat token
    return this.generateAuthResponse(user)
  }

  static async login(request: LoginUserRequest): Promise<AuthResponse> {
    // Validasi request
    request = AuthValidation.LOGIN.parse(request)

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: request.email }
    })

    if (!user || !(await Bun.password.verify(request.password, user.password, 'bcrypt'))) {
      throw new HTTPException(401, { message: 'Username or password is wrong' })
    }

    // Buat token
    return this.generateAuthResponse(user)
  }

  static async get(token: string | null | undefined): Promise<User> {
    const { data: parsedToken, error } = AuthValidation.TOKEN.safeParse(token)

    if (error || !parsedToken) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const { decoded } = await verifyJWT(parsedToken)

    if (!decoded || decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new HTTPException(403, { message: 'Token expired or invalid' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    })

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    return user
  }

  private static async ensureUniqueUser(request: RegisterUserRequest): Promise<void> {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ username: request.username }, { email: request.email }]
      }
    })

    if (exists) {
      const field = exists.username === request.username ? 'Username' : 'Email'
      throw new HTTPException(400, { message: `${field} already exists` })
    }
  }

  private static async generateAuthResponse(user: User): Promise<AuthResponse> {
    const accessToken = await signJWT(
      { id: user.id, username: user.username },
      { exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION }
    )
    const refreshToken = await signJWT(
      { id: user.id, username: user.username },
      { exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION }
    )

    const role = await prisma.role.findUnique({ where: { id: user.role_id } })

    if (!role) {
      throw new HTTPException(500, { message: 'Role not found' })
    }

    return {
      ...toAuthResponse({ ...user, role }),
      accessToken,
      refreshToken
    }
  }
}
