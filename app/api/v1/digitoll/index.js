import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import getVerifiedDecodedToken from '../../../utilities/getVerifiedDecodedToken'
import calculateDigitollCommission from '../../../utilities/calculateDigitollCommission'

const stripe = new Stripe(process.env.STRIPE_API_KEY)
const prisma = new PrismaClient()

export default async (req, res) => {
    const decodedToken = await getVerifiedDecodedToken(req)

    if (!decodedToken) {
        res.status(401).json({ messages: ['Unauthorized']})
        return
    }

    if (req.method === 'POST') {
        const price = req.body.price
        const destination = req.body.destination
        const slug = req.body.slug

        try {
            const user = await prisma.user.findUnique({
                where: {
                    authId: decodedToken.sub,
                }
            })

            let digitollPrice

            const { data: prices } = await stripe.prices.search({
                query: `active:'true' AND metadata['price']:'${price}'`,
            })

            if (prices.length > 0) {
                digitollPrice = prices[0]
            } else {
                digitollPrice = await stripe.prices.create({
                    currency: 'usd',
                    unit_amount: price,
                    product: process.env.STRIPE_PRODUCT_ID,
                    'metadata[price]': price
                })
            }

            const digitollCommission = calculateDigitollCommission(digitollPrice.unit_amount)

            const paymentLink = await stripe.paymentLinks.create({
                line_items: [
                  {
                    price: digitollPrice.id,
                    quantity: 1,
                  },
                ],
                after_completion: {
                    type: "redirect",
                    redirect: {
                        url: destination
                    }
                },
                application_fee_amount: digitollCommission,
                transfer_data: {
                    destination: user.payoutAccountId,
                }
            })

            const digitoll = await prisma.digitoll.create({
                data: {
                    payLinkId: paymentLink.id,
                    slug,
                    destination,
                    paymentUrl: paymentLink.url,
                    User: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })

            res.send(digitoll)
            return
        } catch (error) {
            console.error(error)
            res.status(500).json({ messages: ['Something unexpected occurred.']})
            return
        }

    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
