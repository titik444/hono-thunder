import {
  CreateRoleRequest,
  ListRoleRequest,
  ListRoleResponse,
  RoleResponse,
  toRoleResponse,
  UpdateRoleRequest
} from '../model/role.model'
import { prisma } from '../utils/prisma'
import { RoleValidation } from '../validation/role.validation'

export class RoleService {
  static async create(request: CreateRoleRequest): Promise<RoleResponse> {
    request = RoleValidation.CREATE.parse(request)

    const role = await prisma.role.create({
      data: {
        name: request.name
      }
    })

    return toRoleResponse(role)
  }

  static async list(request: ListRoleRequest): Promise<ListRoleResponse> {
    request = RoleValidation.LIST.parse(request)

    const skip = (request.page - 1) * request.per_page

    const roles = await prisma.role.findMany({
      where: {
        deleted: false
      },
      take: request.per_page,
      skip: skip
    })

    const total = await prisma.role.count({
      where: {
        deleted: false
      }
    })

    return {
      data: roles.map(toRoleResponse),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(total / request.per_page),
        totalItems: total
      }
    }
  }

  static async update(request: UpdateRoleRequest): Promise<RoleResponse> {
    request = RoleValidation.UPDATE.parse(request)

    const role = await prisma.role.findFirst({
      where: { id: request.id, deleted: false }
    })

    if (!role) {
      throw new Error('Role not found')
    }

    const updatedRole = await prisma.role.update({
      where: { id: request.id },
      data: {
        name: request.name
      }
    })

    return toRoleResponse(updatedRole)
  }

  static async remove(roleId: number): Promise<Boolean> {
    roleId = RoleValidation.REMOVE.parse(roleId)

    const role = await prisma.role.findFirst({
      where: { id: roleId, deleted: false }
    })

    if (!role) {
      throw new Error('Role not found')
    }

    await prisma.role.update({
      where: { id: roleId },
      data: {
        deleted: true
      }
    })

    return true
  }
}
