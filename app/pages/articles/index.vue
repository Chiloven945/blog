<script lang="ts" setup>
import type {ArticleCardItem} from '#shared/types/article'
import ArticleFeature from '~/components/article/ArticleFeature.vue'
import ArticleIndexRow from '~/components/article/ArticleIndexRow.vue'

const route = useRoute()
const router = useRouter()
const {t} = useI18n()

const active = useActiveContentCollection()

const {data} = await useAsyncData<ArticleCardItem[]>(
    () => `articles-index-${active.value.articles}`,
    async () => {
        const fields = [
            'path',
            'title',
            'description',
            'date',
            'updated',
            'subtype',
            'status',
            'tags',
            'series',
            'cover',
            'coverAlt',
            'featured',
        ] as const

        const items = await queryCollection(active.value.articles)
            .select(...fields)
            .order('date', 'DESC')
            .all()

        return items as unknown as ArticleCardItem[]
    },
)

const articles = computed(() => filterDrafts(data.value ?? []))
const subtypeOptions = useArticleSubtypes()

const availableSubtypes = computed(() => {
    const present = new Set(articles.value.map(article => article.subtype))
    return subtypeOptions.value.filter(option => present.has(option.value))
})

const subtypeCounts = computed(() => {
    const counts = new Map<string, number>()
    for (const article of articles.value) {
        const key = article.subtype ?? ''
        counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
})

const activeType = computed(() => {
    const value = typeof route.query.type === 'string'
        ? route.query.type
        : 'all'

    return availableSubtypes.value.some(option => option.value === value)
        ? value
        : 'all'
})

const filtered = computed(() =>
    activeType.value === 'all'
        ? articles.value
        : articles.value.filter(article => article.subtype === activeType.value),
)

const feature = computed(() =>
    activeType.value === 'all'
        ? pickArticleFeature(articles.value)
        : null,
)

const rows = computed(() => {
    const featurePath = feature.value?.path
    return filtered.value.filter(article => article.path !== featurePath)
})

function setType(value: string) {
    const query = {...route.query}

    if (value === 'all') {
        delete query.type
    } else {
        query.type = value
    }

    router.push({query})
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
    title: () => t('articles.title'),
    description: () => t('articles.description'),
})
</script>

<template>
    <div>
        <header class="border-b border-default pb-8">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('articles.label') }}
            </p>
            <h1 class="mt-3 font-display-sans text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ t('articles.title') }}
            </h1>
            <p class="mt-3 max-w-2xl text-base/7 text-muted">
                {{ t('articles.description') }}
            </p>
        </header>

        <div class="mt-6 flex flex-wrap gap-2">
            <UButton
                    :color="activeType === 'all' ? 'primary' : 'neutral'"
                    :variant="activeType === 'all' ? 'solid' : 'soft'"
                    size="sm"
                    @click="setType('all')"
            >
                {{ t('articles.all') }}
                <span class="ms-1.5 tabular-nums opacity-60">{{ articles.length }}</span>
            </UButton>

            <UButton
                    v-for="option in availableSubtypes"
                    :key="option.value"
                    :color="activeType === option.value ? 'primary' : 'neutral'"
                    :variant="activeType === option.value ? 'solid' : 'soft'"
                    size="sm"
                    @click="setType(option.value)"
            >
                {{ option.label }}
                <span class="ms-1.5 tabular-nums opacity-60">{{
                        subtypeCounts.get(option.value) ?? 0
                    }}</span>
            </UButton>
        </div>

        <section v-if="feature" class="mt-12">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('articles.featured') }}
            </p>
            <ArticleFeature :article="feature" class="mt-4"/>
        </section>

        <section class="mt-14">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('articles.index') }}
            </p>

            <ol v-if="rows.length" class="mt-4">
                <ArticleIndexRow
                        v-for="(article, index) in rows"
                        :key="article.path"
                        :article="article"
                        :index="index"
                />
            </ol>

            <div
                    v-else
                    class="mt-4 rounded-sm border border-dashed border-default px-6 py-16 text-center"
            >
                <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                    {{ t('articles.emptyEyebrow') }}
                </p>
                <p class="mt-3 text-lg font-bold text-highlighted">{{ t('articles.empty') }}</p>
                <p class="mt-2 text-sm text-muted">{{ t('articles.emptyDescription') }}</p>

                <UButton
                        v-if="activeType !== 'all'"
                        class="mt-6"
                        variant="outline"
                        @click="setType('all')"
                >
                    {{ t('articles.all') }}
                </UButton>
            </div>
        </section>
    </div>
</template>
