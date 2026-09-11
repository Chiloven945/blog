<script lang="ts" setup>
const activeCollections = useActiveContentCollection()
const posts = computed(() => activeCollections.value.posts)
const pages = computed(() => activeCollections.value.pages)

const {data: postItems} = await useAsyncData(
    () => `dev-content-posts-${posts.value}`,
    () => queryCollection(posts.value).select('path', 'title').all(),
)

const {data: pageItems} = await useAsyncData(
    () => `dev-content-pages-${pages.value}`,
    () => queryCollection(pages.value).select('path', 'title').all(),
)

useSeoMeta({robots: 'noindex'})
</script>

<template>
    <div class="container-page py-10">
        <h1 class="text-2xl font-bold">Content Collections</h1>

        <section class="mt-8">
            <h2 class="font-mono text-sm uppercase tracking-[0.2em] text-muted">Posts</h2>
            <p class="mt-1" data-testid="posts-collection">{{ posts }}</p>
            <ul class="mt-2">
                <li v-for="item in postItems" :key="item.path" data-testid="post-item">
                    {{ item.path }} — {{ item.title }}
                </li>
            </ul>
        </section>

        <section class="mt-8">
            <h2 class="font-mono text-sm uppercase tracking-[0.2em] text-muted">Pages</h2>
            <p class="mt-1" data-testid="pages-collection">{{ pages }}</p>
            <ul class="mt-2">
                <li v-for="item in pageItems" :key="item.path" data-testid="page-item">
                    {{ item.path }} — {{ item.title }}
                </li>
            </ul>
        </section>
    </div>
</template>
