<script lang="ts" setup>
import type {NavigationItem} from '#shared/types/navigation'

const props = withDefaults(defineProps<{
    item: NavigationItem
    active?: boolean
    variant?: 'rail' | 'dock' | 'mobile' | 'row'
}>(), {
    active: false,
    variant: 'rail',
})

const {t} = useI18n()

const base = 'group relative flex items-center font-medium transition-ui focus-ring'

const variantClass = computed(() => {
    switch (props.variant) {
        case 'rail':
            return 'size-10 justify-center rounded-sm'
        case 'dock':
            return 'h-10 gap-2 rounded-sm px-3 text-sm'
        case 'row':
            return 'w-full gap-3 rounded-sm px-3 py-2.5 text-sm'
        default:
            return 'min-w-0 flex-1 flex-col gap-0.5 rounded-sm py-1.5 text-[0.6875rem]'
    }
})

const stateClass = computed(() => {
    if (props.active) {
        return 'bg-primary text-inverted'
    }

    if (!props.item.available) {
        return 'cursor-not-allowed text-dimmed'
    }

    return 'text-muted hover:bg-elevated hover:text-highlighted'
})

const labelClass = computed(() => {
    switch (props.variant) {
        case 'rail':
            return 'pointer-events-none absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-sm border border-default bg-default px-2 py-1 text-xs text-highlighted opacity-0 shadow-sm transition-ui group-hover:opacity-100 group-focus-visible:opacity-100'
        case 'dock':
            return 'pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-default bg-default px-2 py-1 text-xs text-highlighted opacity-0 shadow-sm transition-ui group-hover:opacity-100 group-focus-visible:opacity-100 lg:static lg:mt-0 lg:translate-x-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-sm lg:text-inherit lg:opacity-100 lg:shadow-none'
        default:
            return 'truncate'
    }
})
</script>

<template>
    <NuxtLink
            v-if="item.available"
            :aria-current="active ? 'page' : undefined"
            :aria-label="item.label"
            :class="[base, variantClass, stateClass]"
            :to="item.to"
    >
        <UIcon v-if="item.icon" class="size-5 shrink-0" :name="item.icon"/>
        <span :class="labelClass">{{ item.label }}</span>
    </NuxtLink>

    <span
            v-else
            :aria-disabled="true"
            :aria-label="`${item.label} · ${t('common.comingSoon')}`"
            :class="[base, variantClass, stateClass]"
            :title="`${item.label} · ${t('common.comingSoon')}`"
    >
        <UIcon v-if="item.icon" class="size-5 shrink-0" :name="item.icon"/>
        <span :class="labelClass">{{ item.label }}</span>
    </span>
</template>
