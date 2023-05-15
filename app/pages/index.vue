<template>
    <button v-if="!self.id" @click="auth.authorize({})">Sign In</button>
    <div v-else>
        <div v-if="self.onboardingLink"><a :href="self.onboardingLink">Finish setting up your payout details</a></div>
        <div v-if="self.loginLink"><a :href="self.loginLink">Login to your payout account</a></div>
        <div v-if="self.editAccountLink"><a :href="self.editAccountLink">Edit your payout account details</a></div>
        <button @click="store.signOut()">Sign Out</button>
        <p>Signed in as {{ self.email }}.</p>
        <form @submit.prevent="createDigitoll()" class="p-2">
            <div class="flex flex-col mb-4">
                <label for="destination" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Destination URL</label>
                <input type="text" name="destination" v-model="formState.destination" class="py-2 px-3 h-10 text-zinc-800 lg:h-8 lg:text-sm border rounded-md shadow-sm">
            </div>
            <div class="flex flex-col mb-4">
                <label for="slug" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Slug</label>
                <input type="text" name="slug" v-model="formState.slug" class="py-2 px-3 h-10 text-zinc-800 lg:h-8 lg:text-sm border rounded-md shadow-sm">
            </div>
            <div class="flex flex-col mb-4">
                <label for="price" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Price</label>
                <input type="number" min="100" name="price" v-model="formState.price" class="py-2 px-3 h-10 text-zinc-800 lg:h-8 lg:text-sm border rounded-md shadow-sm">
            </div>

            <input type="submit" value="Create Digitoll" class="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded cursor-pointer" />
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