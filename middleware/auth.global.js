import auth from '/auth';
import getAccessToken from './utilities/getAccessToken'
import hasValidAccessToken from './utilities/hasValidAccessToken'
import silentlyAuthenticate from './utilities/silentlyAuthenticate'
import Cookies from 'js-cookie'
import axios from 'axios'

export default defineNuxtRouteMiddleware(async (to) => {
    try {
      const currentRoute = to.fullPath

      const accessToken = Cookies.get('digitoll_token')

      if (accessToken) {
        if (hasValidAccessToken(accessToken)) {
          // Do something now that the user is authorized
          const response = await axios.get('/api/v1/self', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          console.log(response.data)

          console.log('Authorized')
          return
        }
      }

      if (currentRoute.includes('access_token')) {
        const accessToken = await getAccessToken(auth)

        Cookies.set('digitoll_token', accessToken)

        const destinationURL = window.localStorage.getItem('destinationURL') || '/'
        window.localStorage.removeItem('destinationURL')

        return navigateTo(destinationURL)
      }

      const silentAccessToken = await silentlyAuthenticate(auth)

      if (silentAccessToken) {
        Cookies.set('digitoll_token', silentAccessToken)

        // Do something now that the user is authorized
        const response = await axios.get('/api/v1/self', {
          headers: {
            Authorization: `Bearer ${silentAccessToken}`
          }
        })
        console.log(response.data)

        console.log('Authorized')
        return
      }

      window.localStorage.setItem('destinationURL', currentRoute)

      auth.authorize({})
    } catch (error) {
      console.error(error)
    }
})