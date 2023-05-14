import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req, res) => {
    if (req.method === 'GET') {
        const { slug } = req.query

        try {
            const digitoll = await prisma.digitoll.findUnique({
                where: {
                    slug
                }
            })

            res.redirect(digitoll.paymentUrl)
            return
        } catch(error) {
            res.status(500).json({ messages: ['Something went wrong.'] })
            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
