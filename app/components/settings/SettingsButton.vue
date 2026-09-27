<script lang="ts" setup>
withDefaults(defineProps<{
    square?: boolean
    size?: 'sm' | 'md' | 'lg'
}>(), {
    square: false,
    size: 'md',
})

const {t} = useI18n()
const {open} = useSettingsModal()
const {enabled} = useNsfwPreferences()

const label = computed(() => t('settings.button'))
</script>

<template>
    <UTooltip :text="label">
        <span class="relative inline-flex">
            <UButton
                    :aria-label="label"
                    :size="size"
                    :square="square"
                    color="neutral"
                    icon="i-lucide-settings-2"
                    variant="ghost"
                    @click="open('general')"
            />
            <span
                    v-if="enabled"
                    aria-hidden="true"
                    class="pointer-events-none absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-primary"
            />
        </span>
    </UTooltip>
</template>
