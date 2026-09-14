<script lang="ts" setup>
import type {ArticleDocument} from '#shared/types/article'
import ArticleReader from '~/components/article/ArticleReader.vue'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

const route = useRoute()
const {t, locale} = useI18n()

const active = useActiveContentCollection()
const path = computed(() => route.path)

// Articles have their own URL tree; this page never queries the novel
// collection. The content path is already locale-prefixed and matches the
// route path.
const articleAsync = useAsyncData(
    () => `article-${active.value.articles}-${path.value}`,
    () => queryCollection(active.value.articles).path(path.value).first(),
)

const article = articleAsync.data

const articleDoc = computed<ArticleDocument | null>(() =>
    article.value
        ? article.value as unknown as ArticleDocument
        : null,
)

const {related: relatedArticles} = useRelatedArticles(articleDoc)

await articleAsync

if (!article.value
    || (isDraft(article.value) && !draftsEnabled())
) {
    throw createError({statusCode: 404, statusMessage: t('error.postNotFound')})
}

const readingTime = computed(() => getReadingTime(article.value?.body))

const {data: surround} = await useAsyncData(
    () => `article-surround-${active.value.articles}-${path.value}`,
    async () => {
        const query = queryCollectionItemSurroundings(
            active.value.articles,
            path.value,
            {fields: ['title', 'date']},
        )
        const items = await (draftsEnabled()
                ? query
                : query.where('status', '<>', 'draft')
        ).order('date', 'ASC')

        const [prev, next] = items

        return {
            prev: prev
                ? {title: prev.title, path: prev.path}
                : null,
            next: next
                ? {title: next.title, path: next.path}
                : null,
        }
    },
)

// Articles preload the code face (the UI sans is already preloaded globally).
useHead(() => {
    const files = resolveFontFiles(locale.value)

    return {
        link: [fontPreloadLink(files.code)],
    }
})

usePageMeta({
    title: () => article.value?.title,
    description: () => article.value?.description,
    type: 'article',
    image: () => article.value?.cover,
    article: {
        publishedTime: () => article.value?.date,
        modifiedTime: () => article.value?.updated,
        tags: () => article.value?.tags,
    },
})
</script>

<template>
    <ArticleReader
            v-if="articleDoc && surround"
            :article="articleDoc"
            :reading-time="readingTime"
            :related="relatedArticles"
            :surround="surround"
    />
</template>
