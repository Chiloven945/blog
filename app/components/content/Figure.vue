<script setup lang="ts">
defineProps<{
    src: string
    alt?: string
    caption?: string
    width?: string | number
    height?: string | number
}>()
</script>

<template>
    <figure class="my-8">
        <NuxtImg
            :src="src"
            :alt="alt ?? ''"
            :width="width"
            :height="height"
            loading="lazy"
            class="mx-auto block h-auto max-w-full rounded-sm border border-default"
        />
        <figcaption v-if="caption" class="mt-2 text-center text-sm text-muted">
            {{ caption }}
        </figcaption>
    </figure>
</template>
