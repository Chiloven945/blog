<script lang="ts" setup>
import {tagPath} from '#shared/utils/taxonomy'

const props = defineProps<{
    tag: string
    count?: number
}>()

const localePath = useLocalePath()
const to = computed(() => localePath(tagPath(props.tag)))
</script>

<template>
    <NuxtLink
            :to="to"
            class="tap-target focus-ring rounded-xs font-mono text-xs text-muted transition-colors hover:text-primary"
    >
        #{{ tag }}<span
            v-if="count !== undefined"
            class="ms-1 tabular-nums text-dimmed"
    >{{ count }}</span>
    </NuxtLink>
</template>
