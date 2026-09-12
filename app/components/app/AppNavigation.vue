<script lang="ts" setup>
const items = useMainNavigation()
</script>

<template>
    <UNavigationMenu
            :items="items"
            :ui="{ link: 'text-sm' }"
            color="neutral"
            highlight
            highlight-color="primary"
            orientation="horizontal"
            variant="link"
    />
</template>
