import { defineStore } from 'pinia'
import auth from '~/auth'
import Cookies from 'js-cookie'

export const useSelfStore = defineStore('selfStore', {
    state: () => ({
        self: {
            authorized: false
        }
    }),
    actions: {
        signIn(self) {
            this.self = {
                ...self,
                authorized: true
            }
        },
        signOut() {
            Cookies.remove('digitoll_token')

            const domain = window.location.hostname
            const returnTo = domain === 'localhost' ? `http://localhost:3000` : `https://${domain}`

            auth.logout({
                returnTo
            })

            this.self = {
                authorized: false
            }
        }
    }
})