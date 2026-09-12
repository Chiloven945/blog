<script lang="ts" setup>
const route = useRoute()
const {t} = useI18n()

const active = useActiveContentCollection()
const collection = computed(() => active.value.pages)
const path = computed(() => route.path)

const {data: page} = await useAsyncData(
    () => `page-${collection.value}-${path.value}`,
    () => queryCollection(collection.value).path(path.value).first(),
)

if (!page.value) {
    throw createError({statusCode: 404, statusMessage: t('error.pageNotFound')})
}

usePageMeta({
    title: () => page.value?.title,
    description: () => page.value?.description,
    image: () => page.value?.cover,
})
</script>

<template>
    <article v-if="page" class="mx-auto max-w-3xl">
        <header class="mb-8">
            <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ page.title }}
            </h1>
            <p v-if="page.description" class="mt-3 text-base/7 text-muted">
                {{ page.description }}
            </p>
        </header>

        <PostCover
                v-if="page.cover"
                :alt="page.coverAlt || page.title"
                :src="page.cover"
        />

        <div class="post-body post-body--editorial mt-8">
            <ContentRenderer :value="page"/>
        </div>
    </article>
</template>
