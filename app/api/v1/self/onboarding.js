import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import getVerifiedDecodedToken from '../../../utilities/getVerifiedDecodedToken'

const stripe = new Stripe(process.env.STRIPE_API_KEY)
const prisma = new PrismaClient()

export default async (req, res) => {
    const decodedToken = await getVerifiedDecodedToken(req)

    if (!decodedToken) {
        res.status(401).json({ messages: ['Unauthorized']})
        return
    }

    if (req.method === 'GET') {
        const payoutAccountId = req.query.payoutAccountId

        if (!payoutAccountId) {
            res.status(400).json({ messages: ['A payoutAccountId is required.'] })
            return
        }

        try {    
            const account = await stripe.accounts.retrieve(payoutAccountId)
            const finishedOnboarding = account.charges_enabled && account.details_submitted
    
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
                finishedOnboarding,
                onboardingLink
            }) 
    
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ messages: ['Something unexpected occurred.']})
            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
