import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req, res) => {
    const apiKey = req.headers['x-api-key']

    if (apiKey !== process.env.AUTH_0_DIGITOLL_API_KEY) {
        res.status(401).json({ messages: ['A valid x-api-key is required.'] })
        return
    }

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
