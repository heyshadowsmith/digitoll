<template>
    <button v-if="!self.id" @click="auth.authorize({})">Sign In</button>
    <div v-else class="ml-10">
        <DigiLogo class="mt-12 mb-8" />
        <div class="max-w-sm mb-16">
            <h2 class="font-medium leading-4 text-zinc-600 mb-4">Create a Digitoll</h2>
            <form @submit.prevent="createDigitoll()">
                <div class="flex flex-col py-2">
                    <label for="destination" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Destination URL</label>
                    <input type="text" name="destination" v-model="formState.destination" class="py-2 px-3 h-11 text-zinc-800 border rounded-md shadow-sm">
                </div>
                <div class="flex flex-col py-2">
                    <label for="slug" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Slug</label>
                    <input type="text" name="slug" v-model="formState.slug" class="py-2 px-3 h-11 text-zinc-800 border rounded-md shadow-sm">
                </div>
                <div class="flex flex-col py-2">
                    <label for="price" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Price</label>
                    <input type="number" min="100" name="price" v-model="formState.price" class="py-2 px-3 h-11 text-zinc-800 border rounded-md shadow-sm">
                </div>

                <input type="submit" value="Create" class="w-full bg-primary text-white py-2 px-4 mt-5 rounded cursor-pointer shadow-sm" />
            </form>
        </div>
        <ul>
            <li v-for="(digitoll, index) in digitolls" :key="index">
                <a :href="`https://dgtll.link/${digitoll.slug}`" :key="index" target="_blank">https://dgtll.link/{{digitoll.slug}}</a>
            </li>
        </ul>
        <div v-if="self.onboardingLink"><a :href="self.onboardingLink">Finish setting up your payout details</a></div>
        <div v-if="self.loginLink"><a :href="self.loginLink">Login to your payout account</a></div>
        <div v-if="self.editAccountLink"><a :href="self.editAccountLink">Edit your payout account details</a></div>
        <button @click="store.signOut()">Sign Out</button>
        <p>Signed in as {{ self.email }}.</p>
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