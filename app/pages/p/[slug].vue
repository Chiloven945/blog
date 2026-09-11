<script lang="ts" setup>
definePageMeta({layout: 'post'})

const route = useRoute()
const {t} = useI18n()

const active = useActiveContentCollection()
const collection = computed(() => active.value.posts)
const path = computed(() => route.path)

const {data: post} = await useAsyncData(
    () => `post-${collection.value}-${path.value}`,
    () => queryCollection(collection.value).path(path.value).first(),
)

if (!post.value || (isDraft(post.value) && !draftsEnabled())) {
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

const typeConfig = computed(() => resolvePostType(post.value?.type ?? 'article'))
const variant = computed(() => typeConfig.value.card)
const tocLinks = computed(() => post.value?.body?.toc?.links ?? [])
const showToc = computed(() => post.value?.toc !== false && tocLinks.value.length > 0)
const readingTime = computed(() => getReadingTime(post.value?.body))

const shellClass = computed(() => {
    const literary = variant.value === 'literary'

    if (showToc.value) {
        return literary ? 'post-shell--literary' : 'post-shell--editorial'
    }

    return literary ? 'post-column--literary' : 'post-column'
})

const bodyClass = computed(() =>
    variant.value === 'literary' ? 'post-body--literary' : 'post-body--editorial',
)

useSeoMeta({
    title: () => post.value?.title,
    description: () => post.value?.description,
    ogTitle: () => post.value?.title,
    ogDescription: () => post.value?.description,
    ogType: 'article',
    articlePublishedTime: () => post.value?.date,
    articleModifiedTime: () => post.value?.updated,
    articleTag: () => post.value?.tags,
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
            </div>

            <PostToc v-if="showToc" :links="tocLinks" variant="desktop"/>
        </div>
    </article>
</template>
