<script lang="ts" setup>
defineProps<{
    src: string
    alt?: string
}>()
</script>

<template>
    <figure v-reveal class="reveal reveal--fast mt-8">
        <NuxtImg
                :alt="alt"
                :src="src"
                class="w-full rounded-sm border border-default"
                format="webp"
                loading="lazy"
        />
    </figure>
</template>
