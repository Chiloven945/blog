<script lang="ts" setup>
import type {FriendItem} from '#shared/types/content'
import FriendCard from './FriendCard.vue'

defineProps<{
    friends: FriendItem[]
}>()
</script>

<template>
    <div v-reveal class="reveal reveal--fast grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FriendCard v-for="friend in friends" :key="friend.id" :friend="friend"/>
    </div>
</template>
