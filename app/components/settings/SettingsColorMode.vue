<script lang="ts" setup>
const {t} = useI18n()
const colorMode = useColorMode()

const options = computed(() => [
    {value: 'light', label: t('settings.general.light')},
    {value: 'dark', label: t('settings.general.dark')},
    {value: 'system', label: t('settings.general.system')},
])

const tabUi = {
    list: 'w-auto rounded-sm',
    indicator: 'rounded-sm shadow-none',
    trigger: 'rounded-sm',
} as const
</script>

<template>
    <SettingsRow
            :description="t('settings.general.colorModeHint')"
            :label="t('settings.general.colorMode')"
    >
        <div :aria-label="t('settings.general.colorMode')" role="group">
            <UTabs
                    :content="false"
                    :items="options"
                    :model-value="colorMode.preference"
                    :ui="tabUi"
                    variant="pill"
                    @update:model-value="value => colorMode.preference = String(value)"
            />
        </div>
    </SettingsRow>
</template>
