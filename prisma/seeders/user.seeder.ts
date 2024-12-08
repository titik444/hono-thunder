import { prisma } from '../../src/utils/prisma'

export async function seedUsers() {
  console.log('Seeding users...')

  // Hash password
  const password = await Bun.password.hash('admin1234', {
    algorithm: 'bcrypt',
    cost: 10
  })

  const users = [
    {
      name: 'Super Admin',
      username: 'admin',
      email: 'admin@test.com',
      password: password,
      role_id: 1
    }
  ]

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  })

  console.log('Seeding users completed.')
}
