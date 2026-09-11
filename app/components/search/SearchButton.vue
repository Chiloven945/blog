<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
    <UButton
            :aria-label="t('nav.search')"
            color="neutral"
            icon="i-lucide-search"
            variant="ghost"
    >
        <span class="hidden md:inline">{{ t('nav.search') }}</span>
        <span class="hidden items-center gap-0.5 md:inline-flex">
            <UKbd value="meta"/>
            <UKbd value="k"/>
        </span>
    </UButton>
</template>
