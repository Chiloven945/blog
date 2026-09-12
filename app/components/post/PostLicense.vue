<script lang="ts" setup>
import {type LicenseKey, licenses} from '#shared/config/licenses'

const props = defineProps<{
    license?: string
}>()

const {t} = useI18n()

const entry = computed(() => licenses[(props.license ?? 'cc-by-nc-sa-4.0') as LicenseKey] ?? licenses['cc-by-nc-sa-4.0'])
const label = computed(() => t(entry.value.labelKey))
const licenseUrl = computed(() => ('url' in entry.value ? entry.value.url : null))
</script>

<template>
    <div class="mt-12 border-t border-default pt-4 text-sm text-muted">
        <span class="font-mono text-xs uppercase tracking-[0.2em]">
            {{ t('post.license') }}
        </span>

        <a
                v-if="licenseUrl"
                :href="licenseUrl"
                class="link ml-3"
                rel="noopener noreferrer"
                target="_blank"
        >
            {{ label }}
        </a>
        <span v-else class="ml-3">{{ label }}</span>
    </div>
</template>
