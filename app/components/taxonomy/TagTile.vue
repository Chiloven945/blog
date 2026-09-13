<script lang="ts" setup>
import type {TaxonomyTag} from '~/composables/useTagIndex'
import {tagPath} from '#shared/utils/taxonomy'

const props = defineProps<{
    tag: TaxonomyTag
}>()

const localePath = useLocalePath()
const to = computed(() => localePath(tagPath(props.tag.key)))

// Block area buckets (1 / 2–3 / 4–7 / 8+). Sizes step up in fixed tiers
// instead of scaling continuously with the count.
const sizeClass = computed(() => {
    if (props.tag.count >= 8) {
        return 'min-h-40'
    }
    if (props.tag.count >= 4) {
        return 'min-h-32'
    }
    if (props.tag.count >= 2) {
        return 'min-h-28'
    }
    return 'min-h-24'
})

const labelClass = computed(() => {
    if (props.tag.count >= 8) {
        return 'text-3xl'
    }
    if (props.tag.count >= 4) {
        return 'text-2xl'
    }
    if (props.tag.count >= 2) {
        return 'text-xl'
    }
    return 'text-lg'
})
</script>

<template>
    <NuxtLink
            :class="sizeClass"
            :to="to"
            class="focus-ring group flex flex-col justify-between rounded-sm border border-default bg-default p-4 transition-ui hover:border-primary"
    >
        <span
                :class="labelClass"
                class="font-display-sans leading-tight font-bold tracking-tight break-words text-highlighted transition-colors group-hover:text-primary"
        >
            #{{ tag.label }}
        </span>

        <span class="mt-4 flex items-baseline justify-between font-mono text-xs">
            <span class="tabular-nums text-highlighted">{{ tag.count }}</span>
            <span class="tabular-nums text-muted">{{ tag.articles }}A / {{ tag.novels }}N</span>
        </span>
    </NuxtLink>
</template>
