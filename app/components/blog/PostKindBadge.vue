<script lang="ts" setup>
const props = defineProps<{
    kind?: string
}>()

const {t} = useI18n()

const kindConfig = computed(() => resolveKind(props.kind ?? 'article'))
</script>

<template>
    <UBadge
            :icon="kindConfig.icon"
            :label="t(kindConfig.labelKey)"
            color="neutral"
            size="sm"
            variant="outline"
    />
</template>
