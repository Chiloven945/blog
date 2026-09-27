<script lang="ts" setup>
import NovelReadingPreferencesForm from '../novel/NovelReadingPreferencesForm.vue'

const {t} = useI18n()
const {prefs} = useNovelReadingPreferences()
const wideEnough = useMediaQuery('(min-width: 1024px)')

function reset() {
    prefs.value = {...novelReadingDefaults}
}
</script>

<template>
    <SettingsSection :title="t('settings.features.novelReading')">
        <div class="border-t border-default pt-4">
            <NovelReadingPreferencesForm :include-width="wideEnough"/>
        </div>

        <div class="mt-4 border-t border-default pt-4">
            <UButton color="neutral" icon="i-lucide-rotate-ccw" variant="soft" @click="reset">
                {{ t('settings.features.reset') }}
            </UButton>
        </div>
    </SettingsSection>
</template>
