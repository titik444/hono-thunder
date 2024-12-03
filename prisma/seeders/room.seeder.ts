import { prisma } from '../../src/utils/prisma'

export async function seedRooms() {
  console.log('Seeding rooms...')

  // Delete existing data
  await prisma.room.deleteMany()
  await prisma.roomCategory.deleteMany()

  // Seeder for Room Categories
  await prisma.roomCategory.createMany({
    data: [
      { id: 1, name: 'General' },
      { id: 2, name: 'Entertainment' },
      { id: 3, name: 'Education' },
      { id: 4, name: 'Film' }
    ],
    skipDuplicates: true
  })

  // Seeder for Rooms
  await prisma.room.createMany({
    data: [
      { id: 1, name: 'Universal Room', slug: 'universal-room', parent_id: null, category_id: 1 },
      { id: 2, name: 'Game Room', slug: 'game-room', parent_id: 1, category_id: 2 },
      { id: 3, name: 'Sains Room', slug: 'sains-room', parent_id: 1, category_id: 3 },
      { id: 4, name: 'Film Room', slug: 'film-room', parent_id: 1, category_id: 2 },
      { id: 5, name: 'Anime Room', slug: 'anime-room', parent_id: 4, category_id: 4 },
      { id: 6, name: 'K-Drama Room', slug: 'k-drama-room', parent_id: 4, category_id: 4 },
      { id: 7, name: 'Hollywood Room', slug: 'hollywood-room', parent_id: 4, category_id: 4 },
      { id: 8, name: 'Bollywood Room', slug: 'bollywood-room', parent_id: 4, category_id: 4 }
    ],
    skipDuplicates: true
  })

  console.log('Seeding rooms completed.')
}
