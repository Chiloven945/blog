<script lang="ts" setup>
import type {SearchResultItem} from '~/utils/search'
import {highlightSegments} from '~/utils/search'

const props = defineProps<{
    item: SearchResultItem
    terms: string[]
    active?: boolean
}>()

defineEmits<{ select: [] }>()

const {t} = useI18n()

const typeConfig = computed(() => resolvePostType(props.item.type ?? 'article'))
const titleSegments = computed(() => highlightSegments(props.item.title, props.terms))
const snippetSegments = computed(() => highlightSegments(props.item.snippet, props.terms))
const breadcrumb = computed(() => props.item.titles.join(' / '))
</script>

<template>
    <button
            :aria-selected="props.active"
            :class="props.active ? 'bg-elevated' : 'hover:bg-elevated'"
            :data-testid="'search-result'"
            class="flex w-full items-start gap-3 rounded-sm px-3 py-3 text-left transition-colors"
            role="option"
            type="button"
            @click="$emit('select')"
    >
        <UIcon :name="typeConfig.icon" class="mt-0.5 size-4 shrink-0 text-muted"/>

        <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2">
                <span class="truncate font-medium text-highlighted">
                    <template v-for="(segment, index) in titleSegments" :key="index">
                        <mark
                                v-if="segment.match"
                                class="rounded-[2px] bg-primary/15 px-0.5 text-primary"
                        >{{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                    </template>
                </span>

                <UBadge
                        :label="t(typeConfig.labelKey)"
                        class="shrink-0"
                        color="neutral"
                        size="sm"
                        variant="outline"
                />
            </span>

            <span
                    v-if="breadcrumb"
                    class="mt-0.5 block truncate font-mono text-xs text-muted"
            >{{ breadcrumb }}</span>

            <span
                    v-if="snippetSegments.length"
                    class="mt-1 line-clamp-2 block text-sm/6 text-muted"
            >
                <template v-for="(segment, index) in snippetSegments" :key="index">
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
