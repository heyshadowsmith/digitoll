import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

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

            res.status(200).json(user) 
            return
        } catch (error) {
            console.error(error)
            res.status(401).json({ messages: ['Unauthorized'] })
            return
        }

    }

    res.status(400).json({ messages: ['Invalid operation'] })
}
