import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_API_KEY)
const prisma = new PrismaClient()

const client = jwksClient({
    jwksUri: 'https://digitoll.us.auth0.com/.well-known/jwks.json'
})

export default async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).json({ messages: ['Unauthorized'] })
        return
    }

    if (req.method === 'GET') {

        try {
            const decodedToken = jwt.decode(token, { complete: true })
            const kid = decodedToken?.header?.kid
            
            const signingKey = await client.getSigningKey(kid)
            const publicKey = signingKey.getPublicKey()
        
            const decoded = await jwt.verify(token, publicKey, { algorithms: ['RS256'] })
            
            const user = await prisma.user.findUnique({
                where: {
                    authId: decoded.sub,
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
            res.status(401).json({ messages: ['Unauthorized'] })
            return
        }

    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
