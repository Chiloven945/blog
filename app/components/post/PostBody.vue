<script lang="ts" setup>
import type {PostDocument} from '#shared/types/content'

defineProps<{
    post: PostDocument
}>()
</script>

<template>
    <div class="post-body">
        <ContentRenderer :value="post"/>
    </div>
</template>
