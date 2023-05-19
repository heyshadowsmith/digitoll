import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req, res) => {
    const apiKey = req.headers['x-api-key']

    if (apiKey !== process.env.DIGITOLL_API_KEY) {
        res.status(401).json({ messages: ['Unauthorized']})
        return
    }

    if (req.method === 'POST') {
        const authId = req.body.authId
        const payoutAccountId = req.body.payoutAccountId
        const email = req.body.email

        const errors = []

        if (authId === undefined) {
            errors.push('A authId is required.')
        }

        if (payoutAccountId === undefined) {
            errors.push('A payoutAccountId is required.')
        }

        if (email === undefined) {
            errors.push('An email is required.')
        }

        if (errors.length > 0) {
            res.status(400).json({ messages: errors })
            return
        }

        try {
            const user = await prisma.user.create({
                data: {
                    authId,
                    payoutAccountId,
                    email
                },
            })

            res.json(user)
            return
        } catch (error) {
            res.status(500).json({ messages: ['Something unexpected occurred.']})
            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
