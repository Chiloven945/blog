<script lang="ts" setup>
defineProps<{
    title: string
    description?: string
}>()
</script>

<template>
    <section class="space-y-1">
        <header class="mb-1">
            <h3 class="font-display-sans text-lg font-bold text-highlighted">{{ title }}</h3>
            <p v-if="description" class="mt-1 text-xs/5 text-muted">{{ description }}</p>
        </header>

        <slot/>
    </section>
</template>
