<script lang="ts" setup>
import type {SettingsSection} from '~/composables/useSettingsModal'

withDefaults(defineProps<{
    variant?: 'rail' | 'strip'
}>(), {
    variant: 'rail',
})

const {t} = useI18n()
const {activeSection, setSection} = useSettingsModal()
const {enabled} = useNsfwPreferences()

const categories: { key: SettingsSection; index: string }[] = [
    {key: 'general', index: '01'},
    {key: 'content', index: '02'},
    {key: 'features', index: '03'},
]

function isActive(section: SettingsSection) {
    return activeSection.value === section
}
</script>

<template>
    <div
            :aria-orientation="variant === 'rail' ? 'vertical' : 'horizontal'"
            :class="variant === 'rail'
                ? 'flex w-44 shrink-0 flex-col gap-1 border-r border-default p-3 sm:w-48'
                : 'flex gap-1 overflow-x-auto border-b border-default px-3 py-2'"
            role="tablist"
    >
        <button
                v-for="category in categories"
                :id="`settings-tab-${category.key}`"
                :key="category.key"
                :aria-controls="`settings-panel-${category.key}`"
                :aria-selected="isActive(category.key)"
                :class="[
                    variant === 'rail'
                        ? 'flex flex-col items-start gap-0.5 rounded-sm px-3 py-2 text-left'
                        : 'flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 py-2 text-sm',
                    isActive(category.key)
                        ? 'bg-primary text-inverted'
                        : 'text-muted transition-ui hover:bg-elevated hover:text-highlighted',
                    'focus-ring',
                ]"
                role="tab"
                type="button"
                @click="setSection(category.key)"
        >
            <span
                    :class="isActive(category.key) ? 'text-inverted/70' : 'text-dimmed'"
                    class="font-mono text-[0.625rem] tracking-[0.2em]"
            >
                {{ category.index }}
            </span>

            <span class="flex items-center gap-1.5 text-sm font-medium">
                {{ t(`settings.categories.${category.key}`) }}
                <span
                        v-if="category.key === 'content' && enabled"
                        :class="isActive(category.key) ? 'bg-inverted' : 'bg-primary'"
                        aria-hidden="true"
                        class="size-1.5 rounded-full"
                />
            </span>
        </button>
    </div>
</template>
