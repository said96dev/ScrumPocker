import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function deleteAllData() {
  const modelNames = ['voting']
  for (const modelName of modelNames) {
    const model = prisma[modelName as keyof typeof prisma] as any
    try {
      await model.deleteMany({})
      console.log(`Cleared data from ${modelName}`)
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error)
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, 'seedData')

  const orderedFileNames = [
    'voting.json',
    /*     'room.json',
    'roomMember.json',
    'votingSystem.json', */
  ]

  await deleteAllData()

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName)
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`)
      continue
    }
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const modelName = path
      .basename(fileName, path.extname(fileName))
      .toLowerCase()
    const model = prisma[modelName as keyof typeof prisma] as any

    try {
      for (const data of jsonData) {
        // Convert string IDs to numbers for relations
        console.log('🚀 ~ main ~ modelName:', modelName)
        if (modelName === 'roommember') {
          data.roomId = parseInt(data.roomId, 10)
        }
        if (modelName === 'votingsystem') {
          data.roomId = parseInt(data.roomId, 10)
          data.votingId = parseInt(data.votingId, 10)
        }
        console.log(`Creating ${modelName}:`, data)
        await model.create({ data })
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`)
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error)
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
