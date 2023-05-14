import auth from '~/auth'
import getAccessToken from './utilities/getAccessToken'
import hasValidAccessToken from './utilities/hasValidAccessToken'
import silentlyAuthenticate from './utilities/silentlyAuthenticate'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useSelfStore } from '~/store/self'


export default defineNuxtRouteMiddleware(async (to) => {
  const store = useSelfStore()

  try {
    const currentRoute = to.fullPath

    const accessToken = Cookies.get('digitoll_token')

    if (accessToken) {
      if (hasValidAccessToken(accessToken)) {
        // Do something now that the user is authorized
        const { data: self } = await axios.get('/api/v1/self', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        store.signIn(self)

        const { data: digitolls } = await axios.get('/api/v1/digitoll/list', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        store.saveDigitolls(digitolls)
        return
      }
    }

    if (currentRoute.includes('access_token')) {
      const accessToken = await getAccessToken(auth)

      Cookies.set('digitoll_token', accessToken)

      return navigateTo('/')
    }

    const silentAccessToken = await silentlyAuthenticate(auth)

    if (silentAccessToken) {
      Cookies.set('digitoll_token', silentAccessToken)

      // Do something now that the user is authorized
      const { data: self } = await axios.get('/api/v1/self', {
        headers: {
          Authorization: `Bearer ${silentAccessToken}`
        }
      })

      store.signIn(self)

      const { data: digitolls } = await axios.get('/api/v1/digitoll/list', {
        headers: {
          Authorization: `Bearer ${silentAccessToken}`
        }
      })

      store.saveDigitolls(digitolls)
      return
    }

    return
  } catch (error) {
    console.error(error)
  }
})