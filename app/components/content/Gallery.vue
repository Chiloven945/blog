<script lang="ts" setup>
interface GalleryImage {
    src: string
    alt?: string
    caption?: string
}

const props = withDefaults(
    defineProps<{
        images?: GalleryImage[]
    }>(),
    {
        images: () => [],
    },
)
</script>

<template>
    <div
            :class="props.images.length >= 3 ? 'lg:grid-cols-3' : ''"
            class="my-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
        <slot v-if="!props.images.length"/>

        <figure v-for="(image, index) in props.images" :key="index" class="m-0">
            <NuxtImg
                    :alt="image.alt ?? ''"
                    :src="image.src"
                    class="w-full rounded-sm border border-default"
                    loading="lazy"
            />
            <figcaption v-if="image.caption" class="mt-1.5 text-center text-xs text-muted">
                {{ image.caption }}
            </figcaption>
        </figure>
    </div>
</template>
