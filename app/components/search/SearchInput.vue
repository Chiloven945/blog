<script lang="ts" setup>
const props = defineProps<{
    modelValue: string
    placeholder?: string
    variant?: 'none' | 'outline' | 'soft' | 'subtle' | 'ghost'
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const input = useTemplateRef<{ inputRef: HTMLInputElement | null }>('input')

function focus() {
    input.value?.inputRef?.focus()
}

function onInput(value: string | number) {
    emit('update:modelValue', String(value))
}

defineExpose({focus})
</script>

<template>
    <UInput
            ref="input"
            :aria-label="props.placeholder"
            :model-value="props.modelValue"
            :placeholder="props.placeholder"
            :variant="props.variant ?? 'none'"
            autofocus
            class="w-full"
            icon="i-lucide-search"
            size="lg"
            @update:model-value="onInput"
    />
</template>
