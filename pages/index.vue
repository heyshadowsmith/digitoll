<template>
    <div v-if="self.onboardingLink"><a :href="self.onboardingLink">Finish setting up your payout details</a></div>
    <div v-if="self.loginLink"><a :href="self.loginLink">Login to your payout account</a></div>
    <div v-if="self.editAccountLink"><a :href="self.editAccountLink">Edit your payout account details</a></div>
    <div>
        <button v-if="!self.id" @click="auth.authorize({})">Sign In</button>
        <button v-else @click="store.signOut()">Sign Out</button>
    </div>
    <p v-if="self.id">Signed in as {{ self.email }}.</p>
    <a v-for="(digitoll, index) in digitolls" :href="`https://dgtll.link/${digitoll.slug}`" :key="index">https://dgtll.link/{{digitoll.slug}}</a>
</template>

<script setup>
import { useSelfStore } from '~/store/self'
import { storeToRefs } from 'pinia'
import auth from '~/auth'

const store = useSelfStore()
const { self } = storeToRefs(store)
const { digitolls } = storeToRefs(store)
</script>