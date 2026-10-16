<script lang="ts" setup>
import {isNsfwPath} from '~/utils/nsfw'

const {t, locale} = useI18n()
const route = useRoute()
const {enabled, blur, enable, disable, setBlur} = useNsfwPreferences()
const {pendingNext, consume, cancel} = useNsfwLinkHandoff()

const confirmOpen = ref(false)
const acknowledged = ref(false)

function onShowUpdate(value: boolean) {
    if (value) {
        // Enabling is an explicit choice that must be acknowledged in the
        // warning dialog.
        acknowledged.value = false
        confirmOpen.value = true
        return
    }

    disableContent()
}

function confirmEnable() {
    if (!acknowledged.value) {
        return
    }

    enable()
    confirmOpen.value = false

    // If Settings was opened from a blocked NSFW deep link, continue to the
    // validated target now that the reader has opted in.
    const next = consume()

    if (next) {
        void navigateTo(next, {replace: true})
    }
}

function cancelConfirm() {
    confirmOpen.value = false
}

// Dismissing the warning without enabling counts as a cancel: reset the
// acknowledgement and drop any pending blocked-link handoff.
watch(confirmOpen, open => {
    if (open) {
        return
    }

    acknowledged.value = false

    if (!enabled.value) {
        cancel()
    }
})

function disableContent() {
    disable()

    // Leaving the preference on while viewing protected content would expose
    // it, so drop to the matching normal list page first.
    if (!isNsfwPath(route.path)) {
        return
    }

    const kind = route.path.match(/\/nsfw\/(articles|novels|series)\b/)?.[1] ?? 'articles'
    // Replace so the browser Back button does not return to the route the
    // reader has just disabled.
    void navigateTo(`/${locale.value}/${kind}`, {replace: true})
}
</script>

<template>
    <div>
        <NsfwRequiredNotice v-if="pendingNext"/>

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
                :ui="{ content: 'max-w-lg rounded-md shadow-none' }"
        >
            <template #content>
                <div class="flex max-h-[85vh] flex-col">
                    <header
                            class="shrink-0 border-b px-5 py-4"
                            :style="{borderColor: 'color-mix(in oklab, var(--ui-error) 45%, var(--ui-border))'}"
                    >
                        <p
                                class="font-mono text-[0.6875rem] tracking-[0.3em] uppercase"
                                :style="{color: 'var(--ui-error)'}"
                        >
                            {{ t('settings.content.confirmEyebrow') }}
                        </p>
                        <h2 class="mt-2 font-display-sans text-xl font-bold text-highlighted">
                            {{ t('settings.content.confirmTitle') }}
                        </h2>
                    </header>

                    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-5">
                        <div
                                class="flex gap-3 rounded-sm border border-s-2 border-default px-4 py-3"
                                :style="{
                                    borderInlineStartColor: 'var(--ui-error)',
                                    backgroundColor: 'color-mix(in oklab, var(--ui-error) 7%, transparent)',
                                }"
                        >
                            <UIcon
                                    aria-hidden="true"
                                    class="mt-1 size-4 shrink-0"
                                    name="i-lucide-circle-alert"
                                    :style="{color: 'var(--ui-error)'}"
                            />
                            <div class="min-w-0 flex-1 space-y-2 text-sm/7 text-default">
                                <p>{{ t('settings.content.legalNotice') }}</p>
                                <p>{{ t('settings.content.legalDisclaimer') }}</p>
                            </div>
                        </div>

                        <UCheckbox
                                v-model="acknowledged"
                                :label="t('settings.content.acknowledge')"
                                data-testid="nsfw-consent"
                        />
                    </div>

                    <footer class="flex shrink-0 justify-end gap-2 border-t border-default px-5 py-4">
                        <UButton
                                autofocus
                                color="neutral"
                                variant="soft"
                                @click="cancelConfirm"
                        >
                            {{ t('settings.content.cancel') }}
                        </UButton>
                        <UButton
                                :disabled="!acknowledged"
                                color="error"
                                @click="confirmEnable"
                        >
                            {{ t('settings.content.enable') }}
                        </UButton>
                    </footer>
                </div>
            </template>
        </UModal>
    </div>
</template>
