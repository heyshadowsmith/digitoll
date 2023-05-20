import auth from '~/auth'
import getAccessToken from './utilities/getAccessToken'
import hasValidAccessToken from './utilities/hasValidAccessToken'
import silentlyAuthenticate from './utilities/silentlyAuthenticate'
import Cookies from 'js-cookie'
import { useSelfStore } from '~/store/self'


export default defineNuxtRouteMiddleware(async (to) => {
  const store = useSelfStore()

  try {
    const currentRoute = to.fullPath

    const accessToken = Cookies.get('digitoll_token')

    if (accessToken) {
      if (hasValidAccessToken(accessToken)) {
        await store.signIn()
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
      await store.signIn()
      return
    }

    return
  } catch (error) {
    console.error(error)
  }
})