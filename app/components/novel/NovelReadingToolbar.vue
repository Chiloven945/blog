<script lang="ts" setup>
defineProps<{
    readingMode: boolean
}>()

const emit = defineEmits<{
    'toggle-reading-mode': []
}>()

const {t} = useI18n()
const sheetOpen = ref(false)
</script>

<template>
    <!-- Desktop: compact corner controls. The trigger opens the settings
         panel; reading mode has its own quick toggle. -->
    <div class="novel-reading-controls fixed bottom-6 right-6 z-40 hidden items-center gap-2 lg:flex">
        <UPopover :content="{align: 'end', side: 'top'}" mode="click">
            <UButton
                    :aria-label="t('novel.reading.settings')"
                    color="neutral"
                    icon="i-lucide-sliders-horizontal"
                    size="lg"
                    square
                    variant="outline"
            />
            <template #content>
                <div class="w-80 p-4">
                    <NovelReadingSettings
                            :include-width="true"
                            :reading-mode="readingMode"
                            @toggle-reading-mode="emit('toggle-reading-mode')"
                    />
                </div>
            </template>
        </UPopover>

        <UButton
                :aria-label="readingMode ? t('novel.reading.exit') : t('novel.reading.readingMode')"
                :aria-pressed="readingMode"
                :color="readingMode ? 'primary' : 'neutral'"
                :icon="readingMode ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
                :variant="readingMode ? 'solid' : 'outline'"
                size="lg"
                square
                @click="emit('toggle-reading-mode')"
        />
    </div>

    <!-- Mobile: a reading-mode toggle and the settings trigger. They rise
         into the freed space once reading mode hides the bottom dock. -->
    <div
            :class="readingMode
                ? 'bottom-[calc(1rem+env(safe-area-inset-bottom))]'
                : 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]'"
            class="novel-reading-controls fixed right-4 z-40 flex items-center gap-2 lg:hidden"
    >
        <button
                :aria-label="readingMode ? t('novel.reading.exit') : t('novel.reading.readingMode')"
                :aria-pressed="readingMode"
                :class="readingMode
                    ? 'border-primary bg-primary text-inverted'
                    : 'border-default bg-default text-highlighted hover:bg-elevated'"
                class="focus-ring flex size-11 items-center justify-center rounded-md border shadow-sm transition-ui"
                type="button"
                @click="emit('toggle-reading-mode')"
        >
            <UIcon
                    :name="readingMode ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
                    class="size-5"
            />
        </button>

        <button
                :aria-label="t('novel.reading.settings')"
                class="focus-ring flex size-11 items-center justify-center rounded-md border border-default bg-default text-highlighted shadow-sm transition-ui hover:bg-elevated"
                type="button"
                @click="sheetOpen = true"
        >
            <UIcon class="size-5" name="i-lucide-sliders-horizontal"/>
        </button>
    </div>

    <USlideover
            v-model:open="sheetOpen"
            :description="t('novel.reading.settingsHint')"
            :title="t('novel.reading.settings')"
            :ui="{content: 'rounded-t-md'}"
            side="bottom"
    >
        <template #body>
            <NovelReadingSettings
                    :include-width="false"
                    :reading-mode="readingMode"
                    @toggle-reading-mode="emit('toggle-reading-mode')"
            />
        </template>
    </USlideover>
</template>
