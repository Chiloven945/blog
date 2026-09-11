<script lang="ts" setup>
const props = defineProps<{
    type?: string
}>()

const {t} = useI18n()

const typeConfig = computed(() => resolvePostType(props.type ?? 'article'))
</script>

<template>
    <UBadge
            :icon="typeConfig.icon"
            :label="t(typeConfig.labelKey)"
            color="neutral"
            size="sm"
            variant="outline"
    />
</template>
