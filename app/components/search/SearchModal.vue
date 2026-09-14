<script lang="ts" setup>
import SearchInput from './SearchInput.vue'
import SearchResult from './SearchResult.vue'
import {tokenizeSearchQuery} from '~/utils/search'

const {t} = useI18n()
const route = useRoute()
const {isOpen, close, toggle} = useSearchModal()
const {query, results, status, ensureIndex} = useSearch()

const isMobile = useMediaQuery('(max-width: 767px)')

const activeIndex = ref(0)
const searchInput = useTemplateRef<{ focus: () => void }>('searchInput')
const resultsEl = useTemplateRef<HTMLElement>('resultsEl')

const terms = computed(() => tokenizeSearchQuery(query.value))

const activeDescendant = computed(() =>
    isOpen.value && results.value.length
        ? `search-result-${activeIndex.value}`
        : undefined
)

const modalUi = computed(() => ({
    content: isMobile.value
        ? 'rounded-none shadow-none max-w-none'
        : 'rounded-md shadow-none max-w-xl',
}))

watch(isOpen, async (open) => {
    if (!open) {
        activeIndex.value = 0
        return
    }

    await ensureIndex()
    await nextTick()
    searchInput.value?.focus()
})

watch(query, () => {
    activeIndex.value = 0
})

watch(() => route.fullPath, () => {
    if (isOpen.value) {
        close()
    }
})

function move(delta: number) {
    const total = results.value.length

    if (!total) {
        return
    }

    activeIndex.value = (activeIndex.value + delta + total) % total
    void nextTick(scrollActiveIntoView)
}

/** Keep the keyboard-selected option visible in the scrolling list. */
function scrollActiveIntoView() {
    const container = resultsEl.value

    if (!container) {
        return
    }

    const active = container.querySelectorAll<HTMLElement>('[data-testid="search-result"]')[activeIndex.value]
    active?.scrollIntoView({block: 'nearest'})
}

function select(index = activeIndex.value) {
    const item = results.value[index]

    if (!item) {
        return
    }

    close()

    navigateTo(item.anchor
        ? `${item.path}#${item.anchor}`
        : item.path
    )
}

function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            move(1)
            break;
        case 'ArrowUp':
            event.preventDefault()
            move(-1)
            break;
        case 'Enter':
            event.preventDefault()
            select()
            break;
    }
}

function onGlobalKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggle()
    }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
    <UModal
            v-model:open="isOpen"
            :description="t('search.description')"
            :fullscreen="isMobile"
            :title="t('search.title')"
            :ui="modalUi"
    >
        <template #content>
            <div class="flex flex-col" @keydown="onKeydown">
                <div class="flex items-center gap-2 border-b border-default px-3 py-2">
                    <div class="min-w-0 flex-1">
                        <SearchInput
                                ref="searchInput"
                                v-model="query"
                                :active-descendant="activeDescendant"
                                :controls="'search-results-listbox'"
                                :expanded="isOpen"
                                :placeholder="t('search.placeholder')"
                                combobox
                        />
                    </div>

                    <UButton
                            :aria-label="t('search.hintClose')"
                            class="md:hidden"
                            color="neutral"
                            icon="i-lucide-x"
                            variant="ghost"
                            @click="close()"
                    />
                </div>

                <div
                        id="search-results-listbox"
                        ref="resultsEl"
                        :class="isMobile
                            ? 'flex-1 overflow-y-auto p-2'
                            : 'max-h-[min(60vh,32rem)] min-h-24 overflow-y-auto p-2'"
                        data-testid="search-results"
                        role="listbox"
                >
                    <div
                            v-if="status === 'loading'"
                            class="flex items-center gap-2 px-3 py-6 text-sm text-muted"
                    >
                        <UIcon class="size-4 animate-spin" name="i-lucide-loader-circle"/>
                        {{ t('search.loading') }}
                    </div>

                    <p v-else-if="!query.trim()" class="px-3 py-6 text-sm text-muted">
                        {{ t('search.startTyping') }}
                    </p>

                    <p v-else-if="!results.length" class="px-3 py-6 text-sm text-muted">
                        {{ t('search.noResults', {query: query.trim()}) }}
                    </p>

                    <template v-else>
                        <p class="px-3 py-1 font-mono text-xs tracking-[0.15em] text-dimmed uppercase">
                            {{ t('search.results', {count: results.length}) }}
                        </p>

                        <SearchResult
                                v-for="(item, index) in results"
                                :key="item.id"
                                :active="index === activeIndex"
                                :index="index"
                                :item="item"
                                :terms="terms"
                                @select="select(index)"
                        />
                    </template>
                </div>

                <div class="flex items-center justify-between gap-2 border-t border-default px-4 py-2 text-xs text-muted">
                    <span class="flex items-center gap-3">
                        <span class="flex items-center gap-1">
                            <UKbd value="arrowup"/>
                            <UKbd value="arrowdown"/>
                            {{ t('search.hintNavigate') }}
                        </span>

                        <span class="hidden items-center gap-1 sm:flex">
                            <UIcon name="i-lucide-corner-down-left"/>
                            {{ t('search.hintSelect') }}
                        </span>
                    </span>

                    <span class="flex items-center gap-1">
                        <UKbd value="escape"/>
                        {{ t('search.hintClose') }}
                    </span>
                </div>
            </div>
        </template>
    </UModal>
</template>
