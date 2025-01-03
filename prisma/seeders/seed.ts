import { seedRoles } from './role.seeder'
import { seedUsers } from './user.seeder'
import { seedRooms } from './room.seeder'
import { prisma } from '../../src/utils/prisma'

async function main() {
  // Panggil seeder masing-masing
  await seedRoles()
  await seedUsers()
  await seedRooms()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
