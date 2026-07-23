import { PrismaClient } from './src/generated/prisma/index.js'
const prisma = new PrismaClient()
const rows = await prisma.destination_collections.findMany({ 
  select: { id: true, name: true, is_active: true, destination_id: true } 
})
console.log(JSON.stringify(rows, null, 2))
await prisma.$disconnect()
