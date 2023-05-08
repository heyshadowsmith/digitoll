import auth from "/auth";
import getAccessToken from './utilities/getAccessToken'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const router = useRouter()

    if (router.currentRoute.fullPath.includes('access_token')) {
        const accessToken = await getAccessToken(auth)
        // console.log(accessToken)
  
        return
      }
    
    auth.authorize({})
})