<script lang="ts" setup>
import type {ArticleDocument} from '#shared/types/article'

// KaTeX stylesheet is only pulled in on pages that render article bodies.
import 'katex/dist/katex.min.css'

defineProps<{
    article: ArticleDocument
}>()

const {t} = useI18n()

// The footnote heading is generated in English; the readers inject the
// localized visible label through this custom property.
const footnotesLabel = computed(() => JSON.stringify(t('footnotes.title')))
</script>

<template>
    <div :style="{'--footnotes-label': footnotesLabel}" class="post-body prose-article">
        <ContentRenderer :value="article"/>
    </div>
</template>
