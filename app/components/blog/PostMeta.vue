<script lang="ts" setup>
const props = defineProps<{
    date: string
    readingTime?: number
}>()

const {t, locale} = useI18n()

const formatted = computed(() => formatPostDate(props.date, locale.value))
</script>

<template>
    <span class="inline-flex items-center gap-2 text-xs text-muted">
        <time :datetime="date">{{ formatted }}</time>

        <template v-if="readingTime">
            <span aria-hidden="true">·</span>
            <span>{{ t('post.readingTime', {minutes: readingTime}) }}</span>
        </template>
    </span>
</template>
