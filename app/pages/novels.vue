<script lang="ts" setup>
import type {NovelCardItem} from '#shared/types/novel'
import NovelCard from '~/components/novel/NovelCard.vue'
import NovelFeature from '~/components/novel/NovelFeature.vue'

const route = useRoute()
const router = useRouter()
const {t} = useI18n()

const active = useActiveContentCollection()

const {data} = await useAsyncData<NovelCardItem[]>(
    () => `novels-index-${active.value.novels}`,
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
            'seriesOrder',
            'cover',
            'coverAlt',
            'featured',
        ] as const

        const items = await queryCollection(active.value.novels)
            .select(...fields)
            .order('date', 'DESC')
            .all()

        return items as unknown as NovelCardItem[]
    },
)

const novels = computed(() => filterDrafts(data.value ?? []))
const subtypeOptions = useNovelSubtypes()
const statusOptions = useNovelStatuses()

const availableSubtypes = computed(() => {
    const present = new Set(novels.value.map(novel => novel.subtype))
    return subtypeOptions.value.filter(option => present.has(option.value))
})

const availableStatuses = computed(() => {
    const present = new Set(novels.value.map(novel => novel.status))
    return statusOptions.value.filter(option => present.has(option.value))
})

const subtypeCounts = computed(() => {
    const counts = new Map<string, number>()
    for (const novel of novels.value) {
        const key = novel.subtype ?? ''
        counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
})

const statusCounts = computed(() => {
    const counts = new Map<string, number>()
    for (const novel of novels.value) {
        const key = novel.status ?? ''
        counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
})

function validQuery(key: 'type' | 'status', options: Array<{ value: string }>) {
    const value = typeof route.query[key] === 'string'
        ? route.query[key]
        : 'all'

    return options.some(option => option.value === value)
        ? value
        : 'all'
}

const activeType = computed(() => validQuery('type', availableSubtypes.value))
const activeStatus = computed(() => validQuery('status', availableStatuses.value))

const filtered = computed(() =>
    novels.value.filter(novel =>
        (activeType.value === 'all' || novel.subtype === activeType.value)
        && (activeStatus.value === 'all' || novel.status === activeStatus.value),
    ),
)

const writing = computed(() => filtered.value.filter(novel => isNovelInProgress(novel.status)))
const recent = computed(() => filtered.value.filter(novel => !isNovelInProgress(novel.status)))

function setFilter(key: 'type' | 'status', value: string) {
    const query = {...route.query}

    if (key === 'type') {
        if (value === 'all') {
            delete query.type
        } else {
            query.type = value
        }
    } else if (value === 'all') {
        delete query.status
    } else {
        query.status = value
    }

    router.replace({query})
}

if (import.meta.client) {
    watch([activeType, activeStatus], ([type, status]) => {
        const query = {...route.query}
        let changed = false

        if ((query.type ?? 'all') !== type) {
            if (type === 'all') delete query.type
            else query.type = type
            changed = true
        }

        if ((query.status ?? 'all') !== status) {
            if (status === 'all') delete query.status
            else query.status = status
            changed = true
        }

        if (changed) {
            router.replace({query})
        }
    }, {immediate: true})
}

usePageMeta({
    title: () => t('novels.title'),
    description: () => t('novels.description'),
})
</script>

<template>
    <div class="container-page py-10 lg:py-14">
        <header class="border-b border-default pb-8">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('novels.label') }}
            </p>
            <h1 class="mt-3 font-display-serif text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ t('novels.title') }}
            </h1>
            <p class="mt-3 max-w-2xl font-reading-serif text-base/7 text-muted">
                {{ t('novels.description') }}
            </p>
        </header>

        <div class="mt-6 space-y-3">
            <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
                    {{ t('novels.subtypeLabel') }}
                </span>
                <UButton
                        :color="activeType === 'all' ? 'primary' : 'neutral'"
                        :variant="activeType === 'all' ? 'solid' : 'soft'"
                        size="sm"
                        @click="setFilter('type', 'all')"
                >
                    {{ t('novels.all') }}
                    <span class="ms-1.5 tabular-nums opacity-60">{{ novels.length }}</span>
                </UButton>
                <UButton
                        v-for="option in availableSubtypes"
                        :key="option.value"
                        :color="activeType === option.value ? 'primary' : 'neutral'"
                        :variant="activeType === option.value ? 'solid' : 'soft'"
                        size="sm"
                        @click="setFilter('type', option.value)"
                >
                    {{ option.label }}
                    <span class="ms-1.5 tabular-nums opacity-60">{{
                            subtypeCounts.get(option.value) ?? 0
                        }}</span>
                </UButton>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
                    {{ t('novels.statusLabel') }}
                </span>
                <UButton
                        :color="activeStatus === 'all' ? 'primary' : 'neutral'"
                        :variant="activeStatus === 'all' ? 'solid' : 'soft'"
                        size="sm"
                        @click="setFilter('status', 'all')"
                >
                    {{ t('novels.all') }}
                    <span class="ms-1.5 tabular-nums opacity-60">{{ novels.length }}</span>
                </UButton>
                <UButton
                        v-for="option in availableStatuses"
                        :key="option.value"
                        :color="activeStatus === option.value ? 'primary' : 'neutral'"
                        :variant="activeStatus === option.value ? 'solid' : 'soft'"
                        size="sm"
                        @click="setFilter('status', option.value)"
                >
                    {{ option.label }}
                    <span class="ms-1.5 tabular-nums opacity-60">{{
                            statusCounts.get(option.value) ?? 0
                        }}</span>
                </UButton>
            </div>
        </div>

        <section v-if="writing.length" class="mt-14">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('novels.currentlyWriting') }}
            </p>

            <div class="mt-5 space-y-6">
                <NovelFeature v-for="novel in writing" :key="novel.path" :novel="novel"/>
            </div>
        </section>

        <section v-if="recent.length" class="mt-14">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('novels.recent') }}
            </p>

            <div class="mt-4 border-t border-default">
                <NovelCard v-for="novel in recent" :key="novel.path" :novel="novel"/>
            </div>
        </section>

        <section
                v-if="!filtered.length"
                class="mt-16 border-t border-default py-20 text-center"
        >
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('novels.emptyEyebrow') }}
            </p>
            <p class="mt-4 font-display-serif text-2xl font-bold text-highlighted">
                {{ t('novels.empty') }}
            </p>
            <p class="mt-3 font-reading-serif text-base text-muted">
                {{ t('novels.emptyDescription') }}
            </p>

            <UButton
                    v-if="activeType !== 'all' || activeStatus !== 'all'"
                    class="mt-6"
                    variant="outline"
                    @click="setFilter('type', 'all'); setFilter('status', 'all')"
            >
                {{ t('novels.all') }}
            </UButton>
        </section>
    </div>
</template>
