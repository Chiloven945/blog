<script lang="ts" setup>
import type {Kind} from '#shared/config/kinds'
import type {PostDocument} from '#shared/types/content'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

definePageMeta({layout: 'post'})

const route = useRoute()
const {t, locale} = useI18n()

const active = useActiveContentCollection()
const path = computed(() => route.path)

const {data: article} = await useAsyncData(
    () => `article-${active.value.articles}-${path.value}`,
    () => queryCollection(active.value.articles).path(path.value).first(),
)

const {data: novel} = await useAsyncData(
    () => `novel-${active.value.novels}-${path.value}`,
    () => queryCollection(active.value.novels).path(path.value).first(),
)

const kind = computed<Kind>(() => (
    article.value
        ? 'article'
        : 'novel'
))
const source = computed(() => article.value ?? novel.value ?? null)
const collection = computed(() => (
    article.value
        ? active.value.articles
        : active.value.novels
))

// Unified document for the transitional unified reader (split into
// ArticleReader / NovelReader in a later milestone).
const post = computed<PostDocument | null>(() =>
    source.value
        ? {...source.value, kind: kind.value} as PostDocument
        : null,
)

if (!post.value
    || (isDraft(post.value) && !draftsEnabled())
) {
    throw createError({statusCode: 404, statusMessage: t('error.postNotFound')})
}

const {data: surround} = await useAsyncData(
    () => `post-surround-${collection.value}-${path.value}`,
    async () => {
        const items = await queryCollection(collection.value)
            .select('path', 'title', 'date')
            .order('date', 'ASC')
            .all()

        return getPostSurround(items, path.value)
    },
)

const kindConfig = computed(() => resolveKind(post.value?.kind ?? 'article'))
const variant = computed(() => kindConfig.value.card)
const tocLinks = computed(() => post.value?.body?.toc?.links ?? [])
const showToc = computed(() => post.value?.toc !== false && tocLinks.value.length > 0)
const readingTime = computed(() => getReadingTime(post.value?.body))

const shellClass = computed(() => {
    const literary = variant.value === 'literary'

    if (showToc.value) {
        return literary
            ? 'post-shell--literary'
            : 'post-shell--editorial'
    }

    return literary
        ? 'post-column--literary'
        : 'post-column'
})

const bodyClass = computed(() =>
    variant.value === 'literary'
        ? 'post-body--literary prose-novel'
        : 'post-body--editorial prose-article',
)

// Reading-face preload: novels pull the locale serif, articles the code
// face (the sans is already preloaded globally).
useHead(() => {
    const files = resolveFontFiles(locale.value)

    return {
        link: variant.value === 'literary'
            ? [fontPreloadLink(files.serif)]
            : [fontPreloadLink(files.code)],
    }
})

usePageMeta({
    title: () => post.value?.title,
    description: () => post.value?.description,
    type: 'article',
    image: () => post.value?.cover,
    article: {
        publishedTime: () => post.value?.date,
        modifiedTime: () => post.value?.updated,
        tags: () => post.value?.tags,
    },
})
</script>

<template>
    <article v-if="post" :class="shellClass" class="mx-auto">
        <PostHeader :post="post" :reading-time="readingTime"/>

        <PostCover
                v-if="post.cover"
                :alt="post.coverAlt || post.title"
                :src="post.cover"
        />

        <PostToc v-if="showToc" :links="tocLinks" class="mt-8" variant="mobile"/>

        <div
                :class="showToc ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_var(--toc-width)] lg:gap-12' : ''"
                class="mt-10"
        >
            <div :class="[bodyClass, showToc ? '' : 'mx-auto']" class="min-w-0">
                <PostBody :post="post"/>

                <PostLicense :license="post.license"/>

                <PostSurround :next="surround?.next ?? null" :prev="surround?.prev ?? null"/>

                <section
                        v-if="post.comments !== false"
                        class="mt-12 border-t border-default pt-6"
                >
                    <h2 class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                        {{ t('post.comments') }}
                    </h2>

                    <PostComments/>
                </section>
            </div>

            <PostToc v-if="showToc" :links="tocLinks" variant="desktop"/>
        </div>
    </article>
</template>
