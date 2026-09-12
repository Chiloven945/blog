<script lang="ts" setup>
import type {ArticleDocument} from '#shared/types/article'

// KaTeX stylesheet is only pulled in on pages that render article bodies.
import 'katex/dist/katex.min.css'

defineProps<{
    article: ArticleDocument
}>()
</script>

<template>
    <div class="post-body prose-article">
        <ContentRenderer :value="article"/>
    </div>
</template>
