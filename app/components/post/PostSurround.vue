<script lang="ts" setup>
defineProps<{
    prev: { title: string; path: string } | null
    next: { title: string; path: string } | null
}>()

const {t} = useI18n()
</script>

<template>
    <nav class="mt-12 grid gap-4 border-t border-default pt-6 sm:grid-cols-2">
        <NuxtLink
                v-if="prev"
                :to="prev.path"
                class="group flex flex-col gap-1 border border-default p-4 transition-colors hover:border-primary"
        >
            <span class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                ← {{ t('post.previous') }}
            </span>
            <span class="text-sm font-bold text-highlighted group-hover:text-primary">
                {{ prev.title }}
            </span>
        </NuxtLink>

        <NuxtLink
                v-if="next"
                :to="next.path"
                class="group flex flex-col gap-1 border border-default p-4 transition-colors hover:border-primary sm:col-start-2 sm:items-end sm:text-right"
        >
            <span class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {{ t('post.next') }} →
            </span>
            <span class="text-sm font-bold text-highlighted group-hover:text-primary">
                {{ next.title }}
            </span>
        </NuxtLink>
    </nav>
</template>
