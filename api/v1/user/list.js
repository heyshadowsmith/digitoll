import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            const users = await prisma.user.findMany()

            res.json(users)
            return
        } catch(error) {
            res.status(500).json({ messages: ['Something went wrong.'] })
            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
