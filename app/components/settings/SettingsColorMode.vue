<script lang="ts" setup>
const {t} = useI18n()
const colorMode = useColorMode()

const options = computed(() => [
    {value: 'light', label: t('settings.general.light')},
    {value: 'dark', label: t('settings.general.dark')},
    {value: 'system', label: t('settings.general.system')},
])
</script>

<template>
    <SettingsRow
            :description="t('settings.general.colorModeHint')"
            :label="t('settings.general.colorMode')"
    >
        <div :aria-label="t('settings.general.colorMode')" class="flex gap-1" role="group">
            <UButton
                    v-for="option in options"
                    :key="option.value"
                    :aria-pressed="colorMode.preference === option.value"
                    :color="colorMode.preference === option.value ? 'primary' : 'neutral'"
                    :variant="colorMode.preference === option.value ? 'solid' : 'soft'"
                    @click="colorMode.preference = option.value"
            >
                {{ option.label }}
            </UButton>
        </div>
    </SettingsRow>
</template>
