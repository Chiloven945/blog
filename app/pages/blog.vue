<script lang="ts" setup>
import BlogGrid from '~/components/blog/BlogGrid.vue'
import BlogTabs from '~/components/blog/BlogTabs.vue'

const route = useRoute()
const router = useRouter()
const {t} = useI18n()

const active = useActiveContentCollection()

const {data: postsData} = await useAsyncData(
    () => `blog-posts-${active.value.articles}-${active.value.novels}`,
    async () => {
        const fields = [
            'path',
            'title',
            'description',
            'date',
            'subtype',
            'status',
            'categories',
            'tags',
            'cover',
            'coverAlt',
        ] as const

        const [articles, novels] = await Promise.all([
            queryCollection(active.value.articles).select(...fields).order('date', 'DESC').all(),
            queryCollection(active.value.novels).select(...fields).order('date', 'DESC').all(),
        ])

        return [
            ...articles.map(item => ({...item, kind: 'article' as const})),
            ...novels.map(item => ({...item, kind: 'novel' as const})),
        ]
    },
)

const posts = computed(() => filterDrafts(postsData.value ?? []))
const kindOptions = useKinds()

const availableKinds = computed(() => {
    const present = new Set(posts.value.map(post => post.kind))
    return kindOptions.value.filter(option => present.has(option.value))
})

const activeType = computed(() => {
    const value = typeof route.query.type === 'string'
        ? route.query.type
        : 'all'
    return availableKinds.value.some(option => option.value === value)
        ? value
        : 'all'
})

const tabs = computed(() => [
    {value: 'all', label: t('blog.all'), icon: 'i-lucide-layout-grid'},
    ...availableKinds.value,
])

const filteredPosts = computed(() =>
    activeType.value === 'all'
        ? posts.value
        : posts.value.filter(post => post.kind === activeType.value),
)

function setType(value: string) {
    const query = {...route.query}

    if (value === 'all') {
        delete query.type
    } else {
        query.type = value
    }

    router.replace({query})
}

if (import.meta.client) {
    watch(
        activeType,
        value => {
            const current = typeof route.query.type === 'string'
                ? route.query.type
                : undefined
            const next = value === 'all'
                ? undefined
                : value

            if (current === next) {
                return
            }

            const query = {...route.query}
            if (next) {
                query.type = next
            } else {
                delete query.type
            }
            router.replace({query})
        },
        {immediate: true},
    )
}

usePageMeta({
    title: () => t('blog.title'),
    description: () => t('blog.description'),
})
</script>

<template>
    <div>
        <header class="mb-8">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('blog.label') }}
            </p>
            <h1 class="mt-3 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ t('blog.title') }}
            </h1>
            <p class="mt-3 max-w-2xl text-base/7 text-muted">
                {{ t('blog.description') }}
            </p>
        </header>

        <BlogTabs
                :items="tabs"
                :model-value="activeType"
                class="mb-8"
                @update:model-value="setType"
        />

        <BlogGrid v-if="filteredPosts.length" :posts="filteredPosts"/>

        <div
                v-else
                class="rounded-sm border border-dashed border-default px-6 py-16 text-center"
        >
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('blog.emptyEyebrow') }}
            </p>
            <p class="mt-3 text-lg font-bold text-highlighted">{{ t('blog.empty') }}</p>
            <p class="mt-2 text-sm text-muted">{{ t('blog.emptyDescription') }}</p>

            <UButton
                    v-if="activeType !== 'all'"
                    class="mt-6"
                    variant="outline"
                    @click="setType('all')"
            >
                {{ t('blog.all') }}
            </UButton>
        </div>
    </div>
</template>
