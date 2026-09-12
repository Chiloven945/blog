<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'
import PostCardCompact from './PostCardCompact.vue'
import PostCardEditorial from './PostCardEditorial.vue'
import PostCardLiterary from './PostCardLiterary.vue'

const props = defineProps<{
    post: PostCardItem
}>()

const variant = computed(() => resolveKind(props.post.kind).card)
</script>

<template>
    <PostCardEditorial v-if="variant === 'editorial'" :post="post"/>
    <PostCardLiterary v-else-if="variant === 'literary'" :post="post"/>
    <PostCardCompact v-else :post="post"/>
</template>
