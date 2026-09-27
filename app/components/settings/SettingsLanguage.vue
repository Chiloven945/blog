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
</script>

<template>
    <SettingsRow
            :description="t('settings.general.languageHint')"
            :label="t('settings.general.language')"
    >
        <div :aria-label="t('settings.general.language')" class="flex flex-wrap gap-1" role="group">
            <UButton
                    v-for="item in availability"
                    :key="item.code"
                    :aria-pressed="item.current"
                    :color="item.current ? 'primary' : 'neutral'"
                    :variant="item.current ? 'solid' : 'soft'"
                    @click="choose(item)"
            >
                {{ item.name }}
            </UButton>
        </div>
    </SettingsRow>
</template>
