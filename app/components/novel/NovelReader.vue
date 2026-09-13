<script lang="ts" setup>
import type {NovelCardItem, NovelDocument} from '#shared/types/novel'
import NovelTitlePage from './NovelTitlePage.vue'
import NovelBody from './NovelBody.vue'
import NovelColophon from './NovelColophon.vue'
import NovelRelated from './NovelRelated.vue'
import NovelProgress from './NovelProgress.vue'
import NovelReadingToolbar from './NovelReadingToolbar.vue'

defineProps<{
    novel: NovelDocument
    readingTime: number
    related: NovelCardItem[]
}>()

const {t} = useI18n()

// Reading mode and preferences are owned here and shared with the toolbar.
const {readingMode, toggle} = useNovelReadingMode()
const {style} = useNovelReadingPreferences()
</script>

<template>
    <article :style="style" class="novel-shell mx-auto">
        <NovelProgress/>

        <NovelTitlePage :novel="novel" :reading-time="readingTime"/>

        <div class="novel-column mx-auto px-6">
            <NovelBody :novel="novel"/>

            <NovelColophon :date="novel.date" :license="novel.license"/>

            <NovelRelated :items="related"/>

            <section
                    v-if="novel.comments !== false"
                    class="mt-12 border-t border-default pt-6"
            >
                <h2 class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                    {{ t('post.comments') }}
                </h2>

                <PostComments/>
            </section>
        </div>

        <NovelReadingToolbar :reading-mode="readingMode" @toggle-reading-mode="toggle"/>
    </article>
</template>
