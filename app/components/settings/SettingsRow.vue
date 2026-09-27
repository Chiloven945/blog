<script lang="ts" setup>
withDefaults(defineProps<{
    label: string
    description?: string
    disabled?: boolean
}>(), {
    disabled: false,
})
</script>

<template>
    <div class="flex flex-col gap-2 border-b border-default py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div :class="disabled ? 'opacity-50' : undefined" class="min-w-0">
            <p class="text-sm font-medium text-highlighted">{{ label }}</p>
            <p v-if="description" class="mt-0.5 text-xs/5 text-muted">{{ description }}</p>
        </div>

        <div class="shrink-0 sm:text-right">
            <slot/>
        </div>
    </div>
</template>
