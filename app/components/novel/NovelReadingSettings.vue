<script lang="ts" setup>
withDefaults(defineProps<{
    readingMode: boolean
    includeWidth?: boolean
}>(), {
    includeWidth: false,
})

const emit = defineEmits<{
    'toggle-reading-mode': []
}>()

const {t} = useI18n()
</script>

<template>
    <div class="space-y-5">
        <NovelReadingPreferencesForm :include-width="includeWidth"/>

        <div class="flex items-center justify-between gap-4">
            <span class="text-sm text-muted">{{ t('novel.reading.readingMode') }}</span>
            <USwitch
                    :aria-label="t('novel.reading.readingMode')"
                    :model-value="readingMode"
                    @update:model-value="emit('toggle-reading-mode')"
            />
        </div>
    </div>
</template>
