<script lang="ts" setup>
import type {TaxonomyTag} from '~/composables/useTagIndex'
import {tagPath} from '#shared/utils/taxonomy'
import {tagLabelClass, tagSpanClass, tagSurfaceClass} from '~/utils/tag-tiles'

const props = defineProps<{
    tag: TaxonomyTag
    index: number
}>()

const localePath = useLocalePath()
const to = computed(() => localePath(tagPath(props.tag.key)))

const spanClass = computed(() => tagSpanClass(props.tag.count))
const labelClass = computed(() => tagLabelClass(props.tag.count))
const surfaceClass = computed(() => tagSurfaceClass(props.tag.count))
const ordinal = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
    <!-- The wrapper is the direct grid child: it owns the span and the
         per-tile reveal, while the link keeps its own background/transition. -->
    <div v-reveal="index * 40" :class="[spanClass, 'reveal reveal--fast']">
        <NuxtLink
                :class="surfaceClass"
                :to="to"
                class="tag-block focus-ring h-full"
        >
            <span class="tag-block__index">{{ ordinal }}</span>

            <span :class="labelClass" class="tag-block__label">
                #{{ tag.label }}
            </span>

            <span class="flex items-baseline justify-end font-mono text-xs">
                <span class="tabular-nums text-muted">{{ tag.count }}</span>
            </span>
        </NuxtLink>
    </div>
</template>
