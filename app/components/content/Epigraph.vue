<script lang="ts" setup>
defineProps<{
    text?: string
    source?: string
}>()
</script>

<template>
    <figure class="novel-epigraph my-10">
        <blockquote class="text-center">
            <slot>{{ text }}</slot>
        </blockquote>
        <figcaption v-if="source" class="mt-3 text-center text-sm text-muted">
            — {{ source }}
        </figcaption>
    </figure>
</template>
