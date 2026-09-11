<script lang="ts" setup>
defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
}>()
</script>

<template>
    <NuxtImg
            :alt="alt ?? ''"
            :height="height"
            :src="src"
            :width="width"
            class="mx-auto my-6 block h-auto max-w-full rounded-sm border border-default"
            loading="lazy"
    />
</template>
