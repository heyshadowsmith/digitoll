import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import getVerifiedDecodedToken from '../../../utilities/getVerifiedDecodedToken'

const stripe = new Stripe(process.env.STRIPE_API_KEY)
const prisma = new PrismaClient()

export default async (req, res) => {
    const decodedToken = await getVerifiedDecodedToken(req)

    if (!decodedToken) {
        res.status(401).json({ messages: ['Unauthorized'] })
        return
    }

    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    authId: decodedToken.sub,
                }
            })
    
            const account = await stripe.accounts.retrieve(user.payoutAccountId)
            const finishedOnboarding = account.charges_enabled && account.details_submitted
            const loginLink = await stripe.accounts.createLoginLink(user.payoutAccountId)
    
            let onboardingLink = null
    
            if (!finishedOnboarding) {
                const accountLink = await stripe.accountLinks.create({
                    account: user.payoutAccountId,
                    refresh_url: process.env.STRIPE_API_REFRESH_URL,
                    return_url: process.env.STRIPE_API_RETURN_URL,
                    type: 'account_onboarding',
                })
    
                onboardingLink = accountLink.url
            }
    
            res.status(200).json({
                ...user,
                loginLink: loginLink.url,
                onboardingLink
            }) 
    
            return
        } catch (error) {
            console.error(error)
            res.status(500)

            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
