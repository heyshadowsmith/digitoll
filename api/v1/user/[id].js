import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req, res) => {
    if (req.method === 'GET') {
        const { id } = req.query

        try {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { id },
                        { authId: id },
                        { payoutAccountId: id }
                    ]
                }
            })

            if (users.length > 0) {
                res.json(users[0])
                return
            }

            res.status(404).json({ messages: ['User not found.'] })
            return
        } catch(error) {
            res.status(404).json({ messages: ['User not found.'] })
            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
