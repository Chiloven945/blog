<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
    <div
            class="mb-5 flex items-start gap-3 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2.5"
            data-nsfw-required
            role="status"
    >
        <UIcon
                aria-hidden="true"
                class="mt-0.5 size-4 shrink-0 text-primary"
                name="i-lucide-eye-off"
        />
        <p class="text-sm/6 text-muted">{{ t('nsfw.required') }}</p>
    </div>
</template>
