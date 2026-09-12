<script lang="ts" setup>
defineProps<{
    label: string
}>()
</script>

<template>
    <div class="border-t border-default pt-4">
        <span class="font-mono text-xs tracking-[0.3em] text-muted uppercase">{{ label }}</span>
    </div>
</template>
