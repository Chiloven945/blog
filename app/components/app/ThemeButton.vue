<script lang="ts" setup>
withDefaults(defineProps<{
    square?: boolean
    size?: 'sm' | 'md' | 'lg'
}>(), {
    square: false,
    size: 'md',
})

const {t} = useI18n()
const label = computed(() => t('common.theme'))
</script>

<template>
    <UTooltip :text="label">
        <UColorModeButton :aria-label="label" :size="size" :square="square"/>
    </UTooltip>
</template>
