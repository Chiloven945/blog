<script lang="ts" setup>
import type {NovelLeading, NovelWidth} from '~/composables/useNovelReadingPreferences'

withDefaults(defineProps<{
    readingMode: boolean
    includeWidth?: boolean
}>(), {
    includeWidth: false,
})

const emit = defineEmits<{
    'toggle-reading-mode': []
}>()

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
</script>

<template>
    <div class="space-y-5">
        <div :aria-label="t('novel.reading.size')" role="group">
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {{ t('novel.reading.size') }}
            </p>
            <div class="mt-2 flex gap-1">
                <UButton
                        v-for="option in sizeOptions"
                        :key="option.value"
                        :aria-pressed="prefs.size === option.value"
                        :color="prefs.size === option.value ? 'primary' : 'neutral'"
                        :variant="prefs.size === option.value ? 'solid' : 'soft'"
                        class="min-h-11 flex-1 justify-center"
                        @click="setSize(option.value)"
                >
                    {{ option.label }}
                </UButton>
            </div>
        </div>

        <div :aria-label="t('novel.reading.leading')" role="group">
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {{ t('novel.reading.leading') }}
            </p>
            <div class="mt-2 flex gap-1">
                <UButton
                        v-for="option in leadingOptions"
                        :key="option.value"
                        :aria-pressed="prefs.leading === option.value"
                        :color="prefs.leading === option.value ? 'primary' : 'neutral'"
                        :variant="prefs.leading === option.value ? 'solid' : 'soft'"
                        class="min-h-11 flex-1 justify-center"
                        @click="setLeading(option.value)"
                >
                    {{ option.label }}
                </UButton>
            </div>
        </div>

        <div v-if="includeWidth" :aria-label="t('novel.reading.width')" role="group">
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {{ t('novel.reading.width') }}
            </p>
            <div class="mt-2 flex gap-1">
                <UButton
                        v-for="option in widthOptions"
                        :key="option.value"
                        :aria-pressed="prefs.width === option.value"
                        :color="prefs.width === option.value ? 'primary' : 'neutral'"
                        :variant="prefs.width === option.value ? 'solid' : 'soft'"
                        class="min-h-11 flex-1 justify-center"
                        @click="setWidth(option.value)"
                >
                    {{ option.label }}
                </UButton>
            </div>
        </div>

        <div class="flex items-center justify-between gap-4">
            <span class="text-sm text-muted">{{ t('novel.reading.indent') }}</span>
            <USwitch v-model="prefs.indent" :aria-label="t('novel.reading.indent')"/>
        </div>

        <div class="flex items-center justify-between gap-4">
            <span class="text-sm text-muted">{{ t('novel.reading.readingMode') }}</span>
            <USwitch
                    :aria-label="t('novel.reading.readingMode')"
                    :model-value="readingMode"
                    @update:model-value="emit('toggle-reading-mode')"
            />
        </div>
    </div>
</template>
