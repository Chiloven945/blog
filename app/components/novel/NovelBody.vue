<script lang="ts" setup>
import type {NovelDocument} from '#shared/types/novel'

// KaTeX is only pulled in on pages that render a novel body.
import 'katex/dist/katex.min.css'

defineProps<{
    novel: NovelDocument
}>()

const {t} = useI18n()

// Same localized footnote label mechanism as the article reader.
const footnotesLabel = computed(() => JSON.stringify(t('footnotes.title')))
</script>

<template>
    <div :style="{'--footnotes-label': footnotesLabel}" class="post-body prose-novel">
        <ContentRenderer :value="novel"/>
    </div>
</template>
