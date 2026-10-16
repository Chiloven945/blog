<script lang="ts" setup>
import SettingsCategoryNav from './SettingsCategoryNav.vue'
import SettingsLanguage from './SettingsLanguage.vue'
import SettingsColorMode from './SettingsColorMode.vue'
import SettingsNsfw from './SettingsNsfw.vue'
import SettingsNovelReading from './SettingsNovelReading.vue'

const {t} = useI18n()
const route = useRoute()
const isMobile = useMediaQuery('(max-width: 767px)')
const {isOpen, activeSection, close} = useSettingsModal()

// Close on route changes (e.g. a language switch) so modal state does not
// survive a full localized navigation.
watch(() => route.fullPath, () => {
    if (isOpen.value) {
        close()
    }
})

const modalUi = computed(() => ({
    content: isMobile.value
        ? 'rounded-none shadow-none'
        : 'h-[min(42rem,82vh)] max-w-5xl rounded-md shadow-none',
}))
</script>

<template>
    <UModal
            v-model:open="isOpen"
            :description="t('settings.subtitle')"
            :fullscreen="isMobile"
            :title="t('settings.title')"
            :ui="modalUi"
    >
        <template #content>
            <div class="flex h-full flex-col">
                <header class="flex items-start justify-between gap-4 border-b border-default px-5 py-4">
                    <div>
                        <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                            {{ t('settings.eyebrow') }}
                        </p>
                        <h2 class="mt-1 text-xl font-bold text-highlighted">
                            {{ t('settings.title') }}
                        </h2>
                    </div>

                    <UButton
                            :aria-label="t('settings.close')"
                            color="neutral"
                            icon="i-lucide-x"
                            variant="ghost"
                            @click="close()"
                    />
                </header>

                <div
                        :class="isMobile ? 'flex-col' : 'flex-row'"
                        class="flex min-h-0 flex-1"
                >
                    <SettingsCategoryNav :variant="isMobile ? 'strip' : 'rail'"/>

                    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                        <section
                                v-if="activeSection === 'general'"
                                id="settings-panel-general"
                                :aria-label="t('settings.categories.general')"
                                role="tabpanel"
                        >
                            <h3 class="mb-1 font-display-sans text-lg font-bold text-highlighted">
                                {{ t('settings.categories.general') }}
                            </h3>
                            <SettingsLanguage/>
                            <SettingsColorMode/>
                        </section>

                        <section
                                v-if="activeSection === 'content'"
                                id="settings-panel-content"
                                :aria-label="t('settings.categories.content')"
                                role="tabpanel"
                        >
                            <h3 class="mb-1 font-display-sans text-lg font-bold text-highlighted">
                                {{ t('settings.categories.content') }}
                            </h3>
                            <SettingsNsfw/>
                        </section>

                        <section
                                v-if="activeSection === 'features'"
                                id="settings-panel-features"
                                :aria-label="t('settings.categories.features')"
                                role="tabpanel"
                        >
                            <h3 class="mb-1 font-display-sans text-lg font-bold text-highlighted">
                                {{ t('settings.categories.features') }}
                            </h3>
                            <SettingsNovelReading/>
                        </section>
                    </div>
                </div>
            </div>
        </template>
    </UModal>
</template>
