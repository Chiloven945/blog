<script lang="ts" setup>
withDefaults(defineProps<{
    square?: boolean
    size?: 'sm' | 'md' | 'lg'
    variant?: 'icon' | 'mobile'
}>(), {
    square: false,
    size: 'md',
    variant: 'icon',
})

const {t} = useI18n()
const {open} = useSettingsModal()
const {enabled} = useNsfwPreferences()

const label = computed(() => t('settings.button'))
</script>

<template>
    <button
            v-if="variant === 'mobile'"
            :aria-label="label"
            class="group relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-sm py-1.5 text-[0.6875rem] font-medium text-muted transition-ui hover:bg-elevated hover:text-highlighted focus-ring"
            type="button"
            @click="open('general')"
    >
        <span class="relative">
            <UIcon class="size-5 shrink-0" name="i-lucide-settings-2"/>
            <span
                    v-if="enabled"
                    aria-hidden="true"
                    class="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-primary"
            />
        </span>
        <span class="truncate">{{ label }}</span>
    </button>

    <UTooltip v-else :text="label">
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
