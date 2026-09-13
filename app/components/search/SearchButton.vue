<script lang="ts" setup>
withDefaults(defineProps<{
    square?: boolean
    size?: 'sm' | 'md' | 'lg'
}>(), {
    square: false,
    size: 'md',
})

const {t} = useI18n()
const {open} = useSearchModal()
</script>

<template>
    <UButton
            :aria-label="t('nav.search')"
            :size="size"
            :square="square"
            color="neutral"
            icon="i-lucide-search"
            variant="ghost"
            @click="open()"
    />
</template>
