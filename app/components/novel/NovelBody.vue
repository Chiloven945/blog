<script lang="ts" setup>
import type {NovelDocument} from '#shared/types/novel'

// KaTeX is only pulled in on pages that render a novel body.
import 'katex/dist/katex.min.css'

defineProps<{
    novel: NovelDocument
}>()
</script>

<template>
    <div class="post-body prose-novel">
        <ContentRenderer :value="novel"/>
    </div>
</template>
