<script lang="ts" setup>
type CalloutType = 'info' | 'warning' | 'danger' | 'success' | 'note'

const props = withDefaults(
    defineProps<{
        type?: CalloutType
        title?: string
    }>(),
    {
        type: 'info',
        title: '',
    },
)

const config: Record<CalloutType, { color: string, icon: string }> = {
    info: {color: 'var(--ui-info)', icon: 'i-lucide-info'},
    warning: {color: 'var(--ui-warning)', icon: 'i-lucide-triangle-alert'},
    danger: {color: 'var(--ui-error)', icon: 'i-lucide-circle-alert'},
    success: {color: 'var(--ui-success)', icon: 'i-lucide-circle-check'},
    note: {color: 'var(--ui-text-muted)', icon: 'i-lucide-sticky-note'},
}

const current = computed(() => config[props.type] ?? config.info)

const rootStyle = computed(() => ({
    borderInlineStartColor: current.value.color,
    backgroundColor: `color-mix(in oklab, ${current.value.color} 7%, transparent)`,
}))
</script>

<template>
    <div
            :style="rootStyle"
            class="callout my-6 flex gap-3 rounded-sm border border-s-2 border-default px-4 py-3"
    >
        <UIcon
                :name="current.icon"
                :style="{color: current.color}"
                class="mt-1 size-4 shrink-0"
        />
        <div class="min-w-0 flex-1">
            <p v-if="title" class="mb-1 font-semibold text-highlighted">{{ title }}</p>
            <div class="callout__body text-sm/7 text-default [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <slot/>
            </div>
        </div>
    </div>
</template>
