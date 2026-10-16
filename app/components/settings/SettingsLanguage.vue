<script lang="ts" setup>
import type {LocaleOption} from '~/composables/useLocaleAvailability'

const {t, setLocale} = useI18n()
const availability = useLocaleAvailability()

function choose(item: LocaleOption) {
    if (item.current) {
        return
    }

    if (item.tagDetail) {
        // Tags are locale-local, so go to the target locale's tag index.
        void navigateTo(item.to)
        return
    }

    // setLocale() updates the locale cookie and loads the localized route.
    void setLocale(item.code)
}

const tabItems = computed(() => availability.value.map(item => ({
    value: item.code,
    label: item.name,
})))

const current = computed(() => availability.value.find(item => item.current)?.code)

function onSelect(value: string | number) {
    const item = availability.value.find(option => option.code === value)

    if (item) {
        choose(item)
    }
}

const tabUi = {
    list: 'w-auto rounded-sm',
    indicator: 'rounded-sm shadow-none',
    trigger: 'rounded-sm',
} as const
</script>

<template>
    <SettingsRow
            :description="t('settings.general.languageHint')"
            :label="t('settings.general.language')"
    >
        <div :aria-label="t('settings.general.language')" role="group">
            <UTabs
                    :content="false"
                    :items="tabItems"
                    :model-value="current"
                    :ui="tabUi"
                    variant="pill"
                    @update:model-value="onSelect"
            />
        </div>
    </SettingsRow>
</template>
