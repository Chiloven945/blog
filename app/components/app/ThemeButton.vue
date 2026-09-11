<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
    <UTooltip :text="t('common.theme')">
        <UColorModeButton :aria-label="t('common.theme')"/>
    </UTooltip>
</template>
