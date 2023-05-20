import { defineStore } from 'pinia'
import auth from '~/auth'
import Cookies from 'js-cookie'
import axios from 'axios'

export const useSelfStore = defineStore('selfStore', {
    state: () => ({
        self: {},
        digitolls: []
    }),
    actions: {
        async signIn() {
            const { data: self } = await axios.get('/api/v1/self', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('digitoll_token')}`
                }
            })

            this.self = self
        },
        signOut() {
            Cookies.remove('digitoll_token')

            const domain = window.location.hostname
            const returnTo = domain === 'localhost' ? `http://localhost:3000` : `https://${domain}`

            auth.logout({ returnTo })
        },
        async getDigitolls() {
            const { data: digitolls } = await axios.get('/api/v1/digitoll/list', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('digitoll_token')}`
                }
            })

            this.digitolls = digitolls
        },
        async createDigitoll(data) {
            data = {
                ...data,
                price: data.price * 100
            }

            const { data: digitoll } = await axios.post('/api/v1/digitoll', data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('digitoll_token')}`
                }
            })

            this.digitolls.push(digitoll)
        }
    }
})