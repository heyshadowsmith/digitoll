import { PrismaClient } from '@prisma/client'
import getVerifiedDecodedToken from '../../../utilities/getVerifiedDecodedToken'

const prisma = new PrismaClient()

export default async (req, res) => {
    const decodedToken = await getVerifiedDecodedToken(req)

    if (!decodedToken) {
        res.status(401).json({ messages: ['Unauthorized']})
        return
    }

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    authId: decodedToken.sub,
                }
            })

            const digitolls = await prisma.digitoll.findMany({
                where: {
                    userId: user.id
                },
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    slug: true,
                    destination: true
                }
            })

            res.send(digitolls)
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ messages: ['Something unexpected occurred.']})
            return
        }

    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
