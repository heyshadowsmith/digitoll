import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

export default async function getVerifiedDecodedToken (req) {
    const client = jwksClient({
        jwksUri: 'https://digitoll.us.auth0.com/.well-known/jwks.json'
    })

    const token = req.headers.authorization?.split(' ')[1]

    const decodedToken = jwt.decode(token, { complete: true })
    const kid = decodedToken?.header?.kid
    
    const signingKey = await client.getSigningKey(kid)
    const publicKey = signingKey.getPublicKey()

    const verifiedDecodedToken = await jwt.verify(token, publicKey, { algorithms: ['RS256'] })

    return verifiedDecodedToken
}