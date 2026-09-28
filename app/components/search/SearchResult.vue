<script lang="ts" setup>
import type {SearchResultItem} from '~/utils/search'
import {highlightSegments} from '~/utils/search'

const props = defineProps<{
    item: SearchResultItem
    terms: string[]
    index: number
    active?: boolean
}>()

const emit = defineEmits<{ select: [] }>()

const {t} = useI18n()
const {effectiveBlur, isRevealed, reveal} = useNsfwPreferences()

const typeConfig = computed(() => resolveKind(props.item.kind ?? 'article'))
const titleSegments = computed(() => highlightSegments(props.item.title, props.terms))
const snippetSegments = computed(() => highlightSegments(props.item.snippet, props.terms))
const breadcrumb = computed(() => props.item.titles.join(' / '))

const identity = computed(() => nsfwIdentity({path: props.item.path}))
const blurred = computed(() =>
    Boolean(props.item.nsfw)
    && effectiveBlur.value
    && !isRevealed(identity.value),
)

// A blurred result reveals on first activation; only a revealed result
// navigates, so keyboard and pointer share the same two-step flow.
function activate() {
    if (blurred.value) {
        reveal(identity.value)
        return
    }

    emit('select')
}
</script>

<template>
    <button
            :id="`search-result-${props.index}`"
            :aria-selected="props.active"
            :class="props.active ? 'bg-elevated' : 'hover:bg-elevated'"
            :data-testid="'search-result'"
            class="flex w-full items-start gap-3 rounded-sm px-3 py-3 text-left transition-colors"
            role="option"
            type="button"
            @click="activate"
    >
        <UIcon :name="typeConfig.icon" class="mt-0.5 size-4 shrink-0 text-muted"/>

        <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2">
                <span
                        :class="blurred ? 'blur-[6px] select-none' : ''"
                        class="line-clamp-2 font-medium text-highlighted md:line-clamp-1"
                >
                    <template v-for="(segment, segmentIndex) in titleSegments" :key="segmentIndex">
                        <mark
                                v-if="segment.match"
                                class="rounded-[2px] bg-primary/15 px-0.5 text-primary"
                        >{{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                    </template>
                </span>

                <NsfwBadge v-if="item.nsfw" class="shrink-0"/>

                <UBadge
                        :label="t(typeConfig.labelKey)"
                        class="shrink-0"
                        color="neutral"
                        size="sm"
                        variant="outline"
                />

                <span
                        v-if="blurred"
                        aria-hidden="true"
                        class="nsfw-guard__reveal shrink-0"
                >
                    <UIcon class="size-4" name="i-lucide-eye"/>
                    <span>{{ t('nsfw.reveal') }}</span>
                </span>
            </span>

            <span
                    v-if="breadcrumb"
                    class="mt-0.5 block truncate font-mono text-xs text-muted"
            >{{ breadcrumb }}</span>

            <span
                    v-if="snippetSegments.length"
                    :class="blurred ? 'blur-[6px] select-none' : ''"
                    class="mt-1 line-clamp-2 block text-sm/6 text-muted"
            >
                <template v-for="(segment, segmentIndex) in snippetSegments" :key="segmentIndex">
                    <mark
                            v-if="segment.match"
                            class="rounded-[2px] bg-primary/15 px-0.5 text-primary"
                    >{{ segment.text }}
                    </mark>
                    <template v-else>{{ segment.text }}</template>
                </template>
            </span>
        </span>

        <UIcon
                :class="props.active ? 'opacity-100' : 'opacity-0'"
                class="mt-1 size-4 shrink-0 text-dimmed transition-opacity"
                name="i-lucide-corner-down-left"
        />
    </button>
</template>
