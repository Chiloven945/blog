<script lang="ts" setup>
import type {NovelLeading, NovelWidth} from '~/composables/useNovelReadingPreferences'

defineProps<{
    readingMode: boolean
}>()

const emit = defineEmits<{
    'toggle-reading-mode': []
}>()

const {t} = useI18n()
const {prefs} = useNovelReadingPreferences()

const sheetOpen = ref(false)

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

function toggleIndent() {
    prefs.value.indent = !prefs.value.indent
}

function toggleReadingMode() {
    emit('toggle-reading-mode')
    sheetOpen.value = false
}
</script>

<template>
    <!-- Desktop: a quiet floating toolbar. -->
    <div
            :aria-label="t('novel.reading.settings')"
            class="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-3 rounded-md border border-default bg-default px-3 py-2 shadow-sm lg:flex"
            role="group"
    >
        <div :aria-label="t('novel.reading.size')" class="flex items-center gap-1" role="group">
            <UButton
                    v-for="option in sizeOptions"
                    :key="option.value"
                    :aria-pressed="prefs.size === option.value"
                    :color="prefs.size === option.value ? 'primary' : 'neutral'"
                    :variant="prefs.size === option.value ? 'solid' : 'soft'"
                    size="xs"
                    @click="setSize(option.value)"
            >
                {{ option.label }}
            </UButton>
        </div>

        <span aria-hidden="true" class="h-5 w-px bg-accented"/>

        <div :aria-label="t('novel.reading.leading')" class="flex items-center gap-1" role="group">
            <UButton
                    v-for="option in leadingOptions"
                    :key="option.value"
                    :aria-pressed="prefs.leading === option.value"
                    :color="prefs.leading === option.value ? 'primary' : 'neutral'"
                    :variant="prefs.leading === option.value ? 'solid' : 'soft'"
                    size="xs"
                    @click="setLeading(option.value)"
            >
                {{ option.label }}
            </UButton>
        </div>

        <span aria-hidden="true" class="h-5 w-px bg-accented"/>

        <div :aria-label="t('novel.reading.width')" class="flex items-center gap-1" role="group">
            <UButton
                    v-for="option in widthOptions"
                    :key="option.value"
                    :aria-pressed="prefs.width === option.value"
                    :color="prefs.width === option.value ? 'primary' : 'neutral'"
                    :variant="prefs.width === option.value ? 'solid' : 'soft'"
                    size="xs"
                    @click="setWidth(option.value)"
            >
                {{ option.label }}
            </UButton>
        </div>

        <span aria-hidden="true" class="h-5 w-px bg-accented"/>

        <UButton
                :aria-pressed="prefs.indent"
                :color="prefs.indent ? 'primary' : 'neutral'"
                :variant="prefs.indent ? 'solid' : 'soft'"
                size="xs"
                @click="toggleIndent"
        >
            {{ t('novel.reading.indent') }} · {{
                prefs.indent
                        ? t('novel.reading.on')
                        : t('novel.reading.off')
            }}
        </UButton>

        <UButton
                :aria-pressed="readingMode"
                :color="readingMode ? 'primary' : 'neutral'"
                :icon="readingMode ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
                :variant="readingMode ? 'solid' : 'soft'"
                size="xs"
                @click="toggleReadingMode"
        >
            {{
                readingMode
                        ? t('novel.reading.exit')
                        : t('novel.reading.readingMode')
            }}
        </UButton>
    </div>

    <!-- Mobile: a floating trigger that opens the settings sheet. It drops
         down into the freed space once reading mode hides the bottom dock. -->
    <button
            :aria-label="t('novel.reading.settings')"
            :class="readingMode
                ? 'bottom-[calc(1rem+env(safe-area-inset-bottom))]'
                : 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]'"
            class="focus-ring fixed right-4 z-40 flex size-11 items-center justify-center rounded-md border border-default bg-default text-highlighted shadow-sm transition-ui hover:bg-elevated lg:hidden"
            type="button"
            @click="sheetOpen = true"
    >
        <UIcon class="size-5" name="i-lucide-sliders-horizontal"/>
    </button>

    <USlideover
            v-model:open="sheetOpen"
            :description="t('novel.reading.settingsHint')"
            :title="t('novel.reading.settings')"
            :ui="{content: 'rounded-t-md'}"
            side="bottom"
    >
        <template #body>
            <div class="space-y-6">
                <div :aria-label="t('novel.reading.size')" role="group">
                    <p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
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
                    <p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">
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

                <UButton
                        :aria-pressed="prefs.indent"
                        :color="prefs.indent ? 'primary' : 'neutral'"
                        :variant="prefs.indent ? 'solid' : 'soft'"
                        block
                        class="min-h-11 justify-center"
                        @click="toggleIndent"
                >
                    {{ t('novel.reading.indent') }} · {{
                        prefs.indent
                                ? t('novel.reading.on')
                                : t('novel.reading.off')
                    }}
                </UButton>

                <UButton
                        :aria-pressed="readingMode"
                        :color="readingMode ? 'primary' : 'neutral'"
                        :icon="readingMode ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
                        :variant="readingMode ? 'solid' : 'soft'"
                        block
                        class="min-h-11 justify-center"
                        @click="toggleReadingMode"
                >
                    {{
                        readingMode
                                ? t('novel.reading.exit')
                                : t('novel.reading.readingMode')
                    }}
                </UButton>
            </div>
        </template>
    </USlideover>
</template>
