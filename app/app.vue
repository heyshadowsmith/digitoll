<template>
    <div v-if="!self.id" class="min-h-screen flex flex-col justify-center items-center">
        <div class="p-4">
            <img src="/digitoll-wordmark.svg" alt="Digitoll Logo" class="h-[50px] mb-6">
            <button v-if="!self.id" @click="auth.authorize({})" class="w-full bg-primary text-white py-2 px-4 mt-5 rounded cursor-pointer shadow-sm">Sign In</button>
        </div>
    </div>
    <div v-else class="min-h-screen">
        <NuxtPage />
    </div>
</template>

<script setup>
import { useSelfStore } from '~/store/self'
import { storeToRefs } from 'pinia'
import auth from '~/auth'

const store = useSelfStore()
const { self } = storeToRefs(store)
</script>