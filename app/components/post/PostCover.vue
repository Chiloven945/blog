<script lang="ts" setup>
defineProps<{
    src: string
    alt?: string
}>()
</script>

<template>
    <figure class="mt-8">
        <NuxtImg
                :src="src"
                :alt="alt"
                class="w-full rounded-sm border border-default"
                format="webp"
                loading="lazy"
        />
    </figure>
</template>
