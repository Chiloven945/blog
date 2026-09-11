<script lang="ts" setup>
import type {LocaleObject} from '@nuxtjs/i18n'

const {t, locale, locales} = useI18n()
const switchLocalePath = useSwitchLocalePath()

const items = computed(() =>
    (locales.value as LocaleObject[]).map(item => ({
        label: item.name,
        type: 'checkbox' as const,
        checked: item.code === locale.value,
        onSelect: () => {
            navigateTo(switchLocalePath(item.code))
        },
    })),
)

const current = computed(() => {
    const match = (locales.value as LocaleObject[]).find(item => item.code === locale.value)
    return match?.name ?? locale.value
})
</script>

<template>
    <UDropdownMenu :items="items">
        <UButton
                :aria-label="t('common.language')"
                color="neutral"
                icon="i-lucide-languages"
                trailing-icon="i-lucide-chevron-down"
                variant="ghost"
        >
            <span class="hidden xl:inline">{{ current }}</span>
        </UButton>
    </UDropdownMenu>
</template>
