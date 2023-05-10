<template>
    <div>
        <button v-if="!self.authorized" @click="auth.authorize({})">Sign In</button>
        <button v-else @click="store.signOut()">Sign Out</button>
    </div>
    <p v-if="self.id">Signed in as {{ self.email }}.</p>
</template>

<script setup>
import { useSelfStore } from '~/store/self'
import { storeToRefs } from 'pinia'
import auth from '~/auth'

const store = useSelfStore()
const { self } = storeToRefs(store)
</script>