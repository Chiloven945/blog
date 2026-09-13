<script lang="ts" setup>
import {type LicenseKey, licenses} from '#shared/config/licenses'

const props = defineProps<{
    license?: string
}>()

const {t} = useI18n()

const entry = computed(() =>
    licenses[(props.license ?? 'all-rights-reserved') as LicenseKey] ?? licenses['all-rights-reserved'],
)
const label = computed(() => t(entry.value.labelKey))
const licenseUrl = computed(() => ('url' in entry.value
    ? entry.value.url
    : null))
</script>

<template>
    <div class="novel-colophon mt-16 border-t border-default pt-6 text-sm text-muted">
        <p class="font-mono text-xs tracking-[0.25em] uppercase">
            {{ t('post.license') }}
        </p>

        <a
                v-if="licenseUrl"
                :href="licenseUrl"
                class="link mt-2 inline-block"
                rel="noopener noreferrer"
                target="_blank"
        >
            {{ label }}
        </a>
        <span v-else class="mt-2 inline-block">{{ label }}</span>
    </div>
</template>
