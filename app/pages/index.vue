<template>
    <div class="min-h-screen flex justify-between flex-col items-center">
        <div class="min-h-screen w-full flex flex-col justify-between p-4 md:flex-row md:max-w-[920px] md:px-4 md:py-12 lg:px-0">
            <div class="w-full md:w-[380px] flex flex-col justify-between">
                <div>
                    <img src="/digitoll-wordmark.svg" alt="Digitoll Logo" class="mb-8">
                    <h2 class="font-medium leading-4 text-zinc-500 mb-4">Create a Digitoll</h2>
                    <form @submit.prevent="createDigitoll()">
                        <div class="flex flex-col py-2">
                            <label for="destination" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Destination URL</label>
                            <input type="text" name="destination" v-model="formData.destination" class="py-2 px-3 h-11 text-zinc-800 border rounded-md shadow-sm">
                        </div>
                        <div class="flex flex-col py-2">
                            <label for="slug" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Slug</label>
                            <input type="text" name="slug" v-model="formData.slug" class="py-2 px-3 h-11 text-zinc-800 border rounded-md shadow-sm">
                        </div>
                        <div class="flex flex-col py-2">
                            <label for="price" class="text-xs font-medium leading-4 text-zinc-600 mb-1">Price</label>
                            <input type="number" min="1" name="price" v-model="formData.price" class="py-2 px-3 h-11 text-zinc-800 border rounded-md shadow-sm">
                        </div>

                        <input type="submit" value="Create" class="w-full bg-primary text-white py-2 px-4 mt-5 rounded cursor-pointer shadow-sm" />
                    </form>
                </div>
                <footer class="flex flex-col items-center text-neutral-400 text-xs mt-6 justify-center sm:flex-row md:justify-start">
                    <div class="flex flex-col border-gray-200 sm:border sm:border-y-0 sm:border-l-0 sm:border-r-1 sm:flex-row sm:pr-4">
                        <button @click="store.signOut()" class="py-2 px-2 md:pl-0">Sign Out</button>
                        <a :href="`/api/v1/self/payoutSignIn?payoutAccountId=${self.payoutAccountId}`" class="py-2 px-2">Payout Sign In</a>
                    </div>
                    <div class="flex flex-col sm:flex-row sm:pl-4">
                        <a href="#" class="py-2 px-2">Terms</a>
                        <a href="#" class="py-2 px-2">Privacy</a>
                    </div>
                </footer>
            </div>
            <div class="w-full md:w-[380px]">
                <ul v-if="digitolls">
                    <li v-for="(digitoll, index) in digitolls" :key="index">
                        <a :href="`https://dgtll.link/${digitoll.slug}`" :key="index" target="_blank">https://dgtll.link/{{digitoll.slug}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { useSelfStore } from '~/store/self'
import { storeToRefs } from 'pinia'
import Cookies from 'js-cookie'

const store = useSelfStore()
const { self } = storeToRefs(store)
const { digitolls } = storeToRefs(store)

store.getDigitolls()

const formData = reactive({ 
    destination: '',
    slug: '',
    price: 1
})

async function createDigitoll () {
    await store.createDigitoll(formData)
    resetFormData()
}

function resetFormData() {
    formData.destination = ''
    formData.slug = ''
    formData.price = 1
}
</script>