<script lang="ts" setup>
const props = defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
}>()

const isRemote = computed(() => /^https?:\/\//i.test(props.src))
</script>

<template>
    <img
            v-if="isRemote"
            :alt="alt ?? ''"
            :height="height"
            :src="src"
            :width="width"
            class="mx-auto my-6 block h-auto max-w-full rounded-sm border border-default"
            loading="lazy"
            referrerpolicy="no-referrer"
    >
    <NuxtImg
            v-else
            :alt="alt ?? ''"
            :height="height"
            :src="src"
            :width="width"
            class="mx-auto my-6 block h-auto max-w-full rounded-sm border border-default"
            loading="lazy"
    />
</template>
