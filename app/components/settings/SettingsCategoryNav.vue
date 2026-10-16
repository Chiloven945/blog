<script lang="ts" setup>
import type {SettingsSection} from '~/composables/useSettingsModal'

const props = withDefaults(defineProps<{
    variant?: 'rail' | 'strip'
}>(), {
    variant: 'rail',
})

const {t} = useI18n()
const {activeSection, setSection} = useSettingsModal()

const categories: { key: SettingsSection; index: string }[] = [
    {key: 'general', index: '01'},
    {key: 'content', index: '02'},
    {key: 'features', index: '03'},
]

const items = computed(() => categories.map(category => ({
    value: category.key,
    label: t(`settings.categories.${category.key}`),
    index: category.index,
})))

const isRail = computed(() => props.variant === 'rail')

const navUi = computed(() => isRail.value
    ? {
        root: 'w-44 shrink-0 items-start border-r border-default p-3 sm:w-48',
        list: 'w-full flex-col gap-1 rounded-sm',
        indicator: 'rounded-sm shadow-none',
        trigger: 'w-full justify-start rounded-sm',
    }
    : {
        root: 'border-b border-default px-3 py-2',
        list: 'w-full rounded-sm',
        indicator: 'rounded-sm shadow-none',
        trigger: 'flex-none rounded-sm',
    })
</script>

<template>
    <UTabs
            :content="false"
            :items="items"
            :model-value="activeSection"
            :orientation="isRail ? 'vertical' : 'horizontal'"
            :ui="navUi"
            variant="pill"
            @update:model-value="value => setSection(value as SettingsSection)"
    >
        <template #default="{ item }">
            <span
                    :class="isRail ? 'flex-col items-start gap-0.5' : 'flex-row items-center gap-1.5'"
                    class="flex"
            >
                <span class="font-mono text-[0.625rem] tracking-[0.2em] opacity-70">
                    {{ item.index }}
                </span>
                <span class="text-sm font-medium">{{ item.label }}</span>
            </span>
        </template>
    </UTabs>
</template>
