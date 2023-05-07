import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req, res) => {
    if (req.method === 'POST') {
        const authId = req.body.authId
        const payoutAccountId = req.body.payoutAccountId
        const email = req.body.email

        const errors = []

        if (authId === undefined) {
            errors.push('An authId is required.')
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

        const user = await prisma.user.create({
            data: {
                authId,
                payoutAccountId,
                email
            },
        })

        res.json(user)
        return
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
