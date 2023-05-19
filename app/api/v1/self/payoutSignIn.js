import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_API_KEY)

export default async (req, res) => {
    if (req.method === 'GET') {
        const payoutAccountId = req.query.payoutAccountId

        if (!payoutAccountId) {
            res.status(400).json({ messages: ['A payoutAccountId is required.'] })
            return
        }

        try {
            const { url } = await stripe.accounts.createLoginLink(payoutAccountId)
            res.redirect(url) 
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ messages: ['Something unexpected occurred.']})
            return
        }
    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
