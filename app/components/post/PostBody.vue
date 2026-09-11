<script lang="ts" setup>
import type {PostDocument} from '#shared/types/content'

// KaTeX stylesheet is only pulled in on pages that render post bodies (§28.4).
import 'katex/dist/katex.min.css'

defineProps<{
    post: PostDocument
}>()
</script>

<template>
    <div class="post-body">
        <ContentRenderer :value="post"/>
    </div>
</template>
