import { Role } from '@prisma/client'

export type CreateRoleRequest = {
  name: string
}

export type ListRoleRequest = {
  page: number
  per_page: number
}

export type GetRoleRequest = {
  id: number
}

export type UpdateRoleRequest = {
  id: number
  name: string
}

export type RoleResponse = {
  id: number
  name: string
}

export type ListRoleResponse = {
  data: RoleResponse[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
  }
}

export function toRoleResponse(role: Role): RoleResponse {
  return {
    id: role.id,
    name: role.name
  }
}
