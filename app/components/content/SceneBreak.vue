<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
    <div
            :aria-label="t('novel.sceneBreak')"
            class="novel-scene-break my-10 text-center"
            role="separator"
    >
        <span aria-hidden="true" class="text-muted">* * *</span>
    </div>
</template>
