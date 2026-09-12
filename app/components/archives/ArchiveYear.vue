<script lang="ts" setup>
import type {ArchiveYearGroup} from '~/composables/useArchives'
import ArchiveMonth from './ArchiveMonth.vue'

defineProps<{
    group: ArchiveYearGroup
}>()
</script>

<template>
    <section
            v-reveal
            class="reveal reveal--fast border-t border-default py-10 lg:grid lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-12">
        <h2 class="text-3xl font-bold tracking-tight text-highlighted tabular-nums sm:text-4xl">
            {{ group.year }}
        </h2>

        <div class="mt-6 space-y-8 lg:mt-0">
            <ArchiveMonth v-for="month in group.months" :key="month.key" :month="month"/>
        </div>
    </section>
</template>
