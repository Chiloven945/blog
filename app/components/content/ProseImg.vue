<script lang="ts" setup>
const props = defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
}>()

// Remote images are never mirrored, and NSFW assets must keep their
// protected `/nsfw-assets/*` namespace (Nuxt Image would emit an
// unprotected `/_ipx/` copy).
const isExternal = computed(() =>
    /^https?:\/\//i.test(props.src) || props.src.startsWith('/nsfw-assets/'),
)
</script>

<template>
    <img
            v-if="isExternal"
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
