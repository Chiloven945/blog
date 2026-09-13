<script lang="ts" setup>
import type {ArticleDocument} from '#shared/types/article'
import ArticleHeader from './ArticleHeader.vue'
import ArticleBody from './ArticleBody.vue'
import ArticleToc from './ArticleToc.vue'
import ArticleTools from './ArticleTools.vue'
import ArticleSourceNotice from './ArticleSourceNotice.vue'

const props = defineProps<{
    article: ArticleDocument
    readingTime: number
    surround: {
        prev: {
            title: string;
            path: string
        } | null
        next: {
            title: string;
            path: string
        } | null
    }
}>()

const {t} = useI18n()

const tocLinks = computed(() =>
    props.article.body?.toc?.links ?? []
)
const showToc = computed(() =>
    props.article.toc !== false && tocLinks.value.length > 0,
)
</script>

<template>
    <article class="article-shell mx-auto">
        <ArticleHeader :article="article" :reading-time="readingTime"/>

        <figure v-if="article.cover" class="mt-8">
            <NuxtImg
                    :alt="article.coverAlt || article.title"
                    :src="article.cover"
                    class="w-full rounded-sm border border-default"
                    format="webp"
                    height="720"
                    loading="lazy"
                    width="1280"
            />
        </figure>

        <ArticleSourceNotice
                v-if="article.source"
                :source="article.source"
                class="mt-8"
        />

        <div v-if="showToc" class="mt-8">
            <ArticleToc :links="tocLinks" variant="mobile"/>
        </div>

        <div
                :class="showToc ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_var(--toc-width)] lg:items-start lg:gap-12' : ''"
                class="mt-10"
        >
            <div :class="showToc ? '' : 'mx-auto'" class="article-column min-w-0">
                <ArticleBody :article="article"/>

                <PostLicense :license="article.license"/>

                <PostSurround :next="surround.next" :prev="surround.prev"/>

                <section
                        v-if="article.comments !== false"
                        class="mt-12 border-t border-default pt-6"
                >
                    <h2 class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                        {{ t('post.comments') }}
                    </h2>

                    <PostComments/>
                </section>
            </div>

            <ArticleTools v-if="showToc" :links="tocLinks"/>
        </div>
    </article>
</template>
