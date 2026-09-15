<script lang="ts" setup>
import type {ArticleDocument} from '#shared/types/article'
import ArticleReader from '~/components/article/ArticleReader.vue'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

const route = useRoute()
const {t, locale} = useI18n()

const active = useActiveContentCollection()
const path = computed(() => route.path)

// NSFW articles live in a separate collection, so a normal query can never
// return them. The route path already carries the /nsfw/ namespace and its
// own canonical URL.
const articleAsync = useAsyncData(
    () => `nsfw-article-${active.value.nsfwArticles}-${path.value}`,
    () => queryCollection(active.value.nsfwArticles).path(path.value).first(),
)

const article = articleAsync.data

// The presentation flag comes from the collection, not from frontmatter.
const articleDoc = computed<ArticleDocument | null>(() =>
    article.value
        ? {...(article.value as unknown as ArticleDocument), nsfw: true}
        : null,
)

await articleAsync

if (!article.value
    || (isDraft(article.value) && !draftsEnabled())
) {
    throw createError({statusCode: 404, statusMessage: t('error.postNotFound')})
}

const readingTime = computed(() => getReadingTime(article.value?.body))

const {data: surround} = await useAsyncData(
    () => `nsfw-article-surround-${active.value.nsfwArticles}-${path.value}`,
    async () => {
        const query = queryCollectionItemSurroundings(
            active.value.nsfwArticles,
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

// NSFW articles preload the code face, exactly like normal articles.
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
            :related="[]"
            :surround="surround"
    />
</template>
