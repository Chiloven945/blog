<script lang="ts" setup>
withDefaults(defineProps<{
    square?: boolean
    hideChevron?: boolean
    size?: 'sm' | 'md' | 'lg'
}>(), {
    square: false,
    hideChevron: false,
    size: 'md',
})

const {t, setLocale} = useI18n()
const availability = useLocaleAvailability()

const items = computed(() => [
    availability.value.map(item => ({
        label: item.name,
        type: 'checkbox' as const,
        checked: item.current,
        disabled: item.current,
        onSelect: () => {
            if (item.current) {
                return
            }

            if (item.tagDetail) {
                // Tags are locale-local, so go to the target locale's tag
                // index instead of guessing a translated tag key.
                void navigateTo(item.to)
                return
            }

            // setLocale() updates the locale cookie and navigates to the
            // same route in the target locale.
            void setLocale(item.code)
        },
    })),
])

const current = computed(() => availability.value.find(item => item.current)?.name ?? '')
</script>

<template>
    <UDropdownMenu :items="items">
        <UButton
                :aria-label="t('common.language')"
                :size="size"
                :square="square"
                :trailing-icon="square || hideChevron ? undefined : 'i-lucide-chevron-down'"
                color="neutral"
                icon="i-lucide-languages"
                variant="ghost"
        >
            <span v-if="!square" class="hidden xl:inline">{{ current }}</span>
        </UButton>
    </UDropdownMenu>
</template>
