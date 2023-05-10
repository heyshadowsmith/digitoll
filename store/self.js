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
            
            auth.logout({
                returnTo: 'http://localhost:3000'
            })

            this.self = {
                authorized: false
            }
        }
    }
})