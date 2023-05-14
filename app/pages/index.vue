<template>
    <button v-if="!self.id" @click="auth.authorize({})">Sign In</button>
    <div v-else>
        <div v-if="self.onboardingLink"><a :href="self.onboardingLink">Finish setting up your payout details</a></div>
        <div v-if="self.loginLink"><a :href="self.loginLink">Login to your payout account</a></div>
        <div v-if="self.editAccountLink"><a :href="self.editAccountLink">Edit your payout account details</a></div>
        <button @click="store.signOut()">Sign Out</button>
        <p>Signed in as {{ self.email }}.</p>
        <form @submit.prevent="createDigitoll()">
            <div>
                <label for="destination">Destination URL</label>
                <input type="text" name="destination" v-model="formState.destination">
            </div>
            <div>
                <label for="slug">Slug</label>
                <input type="text" name="slug" v-model="formState.slug">
            </div>
            <div>
                <label for="price">Price</label>
                <input type="number" min="100" name="price" v-model="formState.price">
            </div>
            <input type="submit" value="Create Digitoll" />
        </form>
        <ul>
            <li v-for="(digitoll, index) in digitolls" :key="index">
                <a :href="`https://dgtll.link/${digitoll.slug}`" :key="index">https://dgtll.link/{{digitoll.slug}}</a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import axios from 'axios'
import { useSelfStore } from '~/store/self'
import { storeToRefs } from 'pinia'
import auth from '~/auth'
import Cookies from 'js-cookie'

const store = useSelfStore()
const { self } = storeToRefs(store)
const { digitolls } = storeToRefs(store)

const formState = reactive({ 
    destination: '',
    slug: '',
    price: 100
})

async function createDigitoll () {
    const accessToken = Cookies.get('digitoll_token')
    const { data } = await axios.post('/api/v1/digitoll', formState, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    store.addDigitoll(data)
}
</script>