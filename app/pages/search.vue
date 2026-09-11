<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'
import SearchInput from '~/components/search/SearchInput.vue'
import SearchResult from '~/components/search/SearchResult.vue'
import {type SearchResultItem, tokenizeSearchQuery} from '~/utils/search'

const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const {query, results, status, ensureIndex} = useSearch()

const terms = computed(() => tokenizeSearchQuery(query.value))
const hasQuery = computed(() => query.value.trim().length > 0)

onMounted(() => {
    ensureIndex()

    const initial = typeof route.query.q === 'string' ? route.query.q : ''

    if (initial && !query.value) {
        query.value = initial
    }
})

watch(() => route.query.q, (value) => {
    const next = typeof value === 'string' ? value : ''

    if (next !== query.value) {
        query.value = next
    }
})

watch(query, (value) => {
    const next = value.trim()
    const current = typeof route.query.q === 'string' ? route.query.q : ''

    if (next === current) {
        return
    }

    const nextQuery = {...route.query}

    if (next) {
        nextQuery.q = next
    } else {
        delete nextQuery.q
    }

    router.replace({query: nextQuery})
})

useSeoMeta({
    title: () => t('search.title'),
    description: () => t('search.description'),
    ogTitle: () => t('search.title'),
    ogDescription: () => t('search.description'),
    ogType: 'website',
    ogUrl: () => `${siteConfig.domain}${route.path}`,
    twitterCard: 'summary_large_image',
})

useHead(() => ({
    link: [{rel: 'canonical', href: `${siteConfig.domain}${route.path}`}],
}))

function select(item: SearchResultItem) {
    navigateTo(item.anchor ? `${item.path}#${item.anchor}` : item.path)
}
</script>

<template>
    <div>
        <header class="max-w-2xl">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">{{
                    t('search.label')
                }}</p>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
                {{ t('search.title') }}
            </h1>
            <p class="mt-4 text-base/7 text-muted">{{ t('search.description') }}</p>
        </header>

        <div class="mt-8 max-w-2xl">
            <SearchInput
                    v-model="query"
                    :placeholder="t('search.placeholder')"
                    variant="outline"
            />
        </div>

        <section class="mt-8 max-w-3xl" data-testid="search-page-results">
            <div
                    v-if="status === 'loading'"
                    class="flex items-center gap-2 py-10 text-sm text-muted"
            >
                <UIcon class="size-4 animate-spin" name="i-lucide-loader-circle"/>
                {{ t('search.loading') }}
            </div>

            <p v-else-if="!hasQuery" class="py-10 text-sm text-muted">
                {{ t('search.startTyping') }}
            </p>

            <p v-else-if="!results.length" class="py-10 text-sm text-muted">
                {{ t('search.noResults', {query: query.trim()}) }}
            </p>

            <template v-else>
                <p class="border-b border-default pb-2 font-mono text-xs tracking-[0.15em] text-dimmed uppercase">
                    {{ t('search.results', {count: results.length}) }}
                </p>

                <div class="divide-y divide-default">
                    <SearchResult
                            v-for="item in results"
                            :key="item.id"
                            :item="item"
                            :terms="terms"
                            @select="select(item)"
                    />
                </div>
            </template>
        </section>
    </div>
</template>
