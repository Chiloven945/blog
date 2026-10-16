<script lang="ts" setup>
import type {NovelLeading, NovelWidth} from '~/composables/useNovelReadingPreferences'

withDefaults(defineProps<{
    includeWidth?: boolean
}>(), {
    includeWidth: false,
})

const {t} = useI18n()
const {prefs} = useNovelReadingPreferences()

const sizeOptions = computed(() => [
    {value: 's' as const, label: t('novel.reading.small')},
    {value: 'm' as const, label: t('novel.reading.medium')},
    {value: 'l' as const, label: t('novel.reading.large')},
])

const leadingOptions = computed(() => [
    {value: 'compact' as const, label: t('novel.reading.compact')},
    {value: 'normal' as const, label: t('novel.reading.normal')},
    {value: 'airy' as const, label: t('novel.reading.airy')},
])

const widthOptions = computed(() => [
    {value: 'narrow' as const, label: t('novel.reading.narrow')},
    {value: 'normal' as const, label: t('novel.reading.normal')},
    {value: 'wide' as const, label: t('novel.reading.wide')},
])

function setSize(value: 's' | 'm' | 'l') {
    prefs.value.size = value
}

function setLeading(value: NovelLeading) {
    prefs.value.leading = value
}

function setWidth(value: NovelWidth) {
    prefs.value.width = value
}

const tabUi = {
    list: 'w-full rounded-sm',
    indicator: 'rounded-sm shadow-none',
    trigger: 'min-h-11 rounded-sm',
} as const
</script>

<template>
    <div class="space-y-5">
        <div :aria-label="t('novel.reading.size')" role="group">
            <p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                {{ t('novel.reading.size') }}
            </p>
            <UTabs
                    class="mt-2"
                    :content="false"
                    :items="sizeOptions"
                    :model-value="prefs.size"
                    :ui="tabUi"
                    variant="pill"
                    @update:model-value="value => setSize(String(value) as 's' | 'm' | 'l')"
            />
        </div>

        <div :aria-label="t('novel.reading.leading')" role="group">
            <p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                {{ t('novel.reading.leading') }}
            </p>
            <UTabs
                    class="mt-2"
                    :content="false"
                    :items="leadingOptions"
                    :model-value="prefs.leading"
                    :ui="tabUi"
                    variant="pill"
                    @update:model-value="value => setLeading(String(value) as NovelLeading)"
            />
        </div>

        <div v-if="includeWidth" :aria-label="t('novel.reading.width')" role="group">
            <p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
                {{ t('novel.reading.width') }}
            </p>
            <UTabs
                    class="mt-2"
                    :content="false"
                    :items="widthOptions"
                    :model-value="prefs.width"
                    :ui="tabUi"
                    variant="pill"
                    @update:model-value="value => setWidth(String(value) as NovelWidth)"
            />
        </div>

        <div class="flex items-center justify-between gap-4">
            <span class="text-sm text-muted">{{ t('novel.reading.indent') }}</span>
            <USwitch v-model="prefs.indent" :aria-label="t('novel.reading.indent')"/>
        </div>
    </div>
</template>
