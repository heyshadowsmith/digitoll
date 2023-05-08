import auth0 from 'auth0-js'

const auth = new auth0.WebAuth({
    domain: 'digitoll.us.auth0.com',
    clientID: 'pOVUWmIW61vHdMnnwdB3nv8w2uYihddE',
    redirectUri: window.location.origin,
    audience: 'https://digitoll.link/api',
    responseType: 'token id_token',
    scope: 'openid profile email',
})

export default auth