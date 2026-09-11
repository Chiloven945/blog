<script lang="ts" setup>
import type {ArchiveMonthGroup} from '~/composables/useArchives'
import ArchiveItem from './ArchiveItem.vue'

defineProps<{
    month: ArchiveMonthGroup
}>()
</script>

<template>
    <div>
        <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            {{ month.label }}
        </p>

        <ul class="mt-2 divide-y divide-default">
            <ArchiveItem v-for="post in month.posts" :key="post.path" :post="post"/>
        </ul>
    </div>
</template>
