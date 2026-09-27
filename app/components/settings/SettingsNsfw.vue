<script lang="ts" setup>
import {isNsfwPath} from '~/utils/nsfw'

const {t, locale} = useI18n()
const route = useRoute()
const {enabled, blur, enable, disable, setBlur} = useNsfwPreferences()

const confirmOpen = ref(false)

function onShowUpdate(value: boolean) {
    if (value) {
        // Enabling is an explicit, confirmed choice.
        confirmOpen.value = true
        return
    }

    disableContent()
}

function confirmEnable() {
    enable()
    confirmOpen.value = false
}

function disableContent() {
    disable()

    // Leaving the preference on while viewing protected content would expose
    // it, so drop to the matching normal list page first.
    if (!isNsfwPath(route.path)) {
        return
    }

    const kind = route.path.match(/\/nsfw\/(articles|novels|series)\b/)?.[1] ?? 'articles'
    void navigateTo(`/${locale.value}/${kind}`)
}
</script>

<template>
    <div>
        <SettingsRow
                :description="t('settings.content.nsfwHint')"
                :label="t('settings.content.nsfw')"
        >
            <USwitch
                    :aria-label="t('settings.content.nsfw')"
                    :model-value="enabled"
                    @update:model-value="onShowUpdate"
            />
        </SettingsRow>

        <SettingsRow
                :description="t('settings.content.blurHint')"
                :disabled="!enabled"
                :label="t('settings.content.blur')"
        >
            <USwitch
                    :aria-label="t('settings.content.blur')"
                    :disabled="!enabled"
                    :model-value="blur"
                    @update:model-value="setBlur"
            />
        </SettingsRow>

        <UModal
                v-model:open="confirmOpen"
                :description="t('settings.content.confirmBody')"
                :title="t('settings.content.confirmTitle')"
                :ui="{ content: 'max-w-md rounded-md shadow-none' }"
        >
            <template #footer>
                <div class="flex w-full justify-end gap-2">
                    <UButton color="neutral" variant="soft" @click="confirmOpen = false">
                        {{ t('settings.content.cancel') }}
                    </UButton>
                    <UButton color="primary" @click="confirmEnable">
                        {{ t('settings.content.enable') }}
                    </UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
