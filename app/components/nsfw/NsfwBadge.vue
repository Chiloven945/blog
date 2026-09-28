<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
    <span
            :aria-label="t('nsfw.badge')"
            class="nsfw-badge"
    >
        NSFW
    </span>
</template>
