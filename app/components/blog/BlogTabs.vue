<script lang="ts" setup>
defineProps<{
    modelValue: string
    items: Array<{ value: string; label: string; icon?: string }>
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <UTabs
            :content="false"
            :items="items"
            :model-value="modelValue"
            variant="link"
            @update:model-value="value => emit('update:modelValue', String(value))"
    />
</template>
