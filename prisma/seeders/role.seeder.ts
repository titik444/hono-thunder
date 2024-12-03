import { prisma } from '../../src/utils/prisma'

export async function seedRoles() {
  console.log('Seeding roles...')

  const roles = [{ name: 'Admin' }, { name: 'User' }]

  await prisma.role.createMany({
    data: roles,
    skipDuplicates: true
  })

  console.log('Seeding roles completed.')
}
