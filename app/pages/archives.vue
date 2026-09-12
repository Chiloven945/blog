<script lang="ts" setup>
import ArchiveYear from '~/components/archives/ArchiveYear.vue'

const {t} = useI18n()

const {years} = await useArchives()

usePageMeta({
    title: () => t('archives.title'),
    description: () => t('archives.description'),
})
</script>

<template>
    <div>
        <header class="max-w-2xl">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('archives.label') }}
            </p>
            <h1 class="mt-3 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ t('archives.title') }}
            </h1>
            <p class="mt-3 text-base/7 text-muted">{{ t('archives.description') }}</p>
        </header>

        <div v-if="years.length" class="mt-10">
            <ArchiveYear v-for="group in years" :key="group.year" :group="group"/>
        </div>

        <div
                v-else
                class="mt-10 rounded-sm border border-dashed border-default px-6 py-16 text-center"
        >
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('archives.emptyEyebrow') }}
            </p>
            <p class="mt-3 text-lg font-bold text-highlighted">{{ t('archives.empty') }}</p>
        </div>
    </div>
</template>
