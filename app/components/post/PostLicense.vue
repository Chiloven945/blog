<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'

const props = defineProps<{
    license?: string
}>()

const {t} = useI18n()

const license = computed(() => props.license || siteConfig.defaultLicense)

const licenseUrl = computed(() =>
    /^CC BY/i.test(license.value)
        ? 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
        : null,
)
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
            {{ license }}
        </a>
        <span v-else class="ml-3">{{ license }}</span>
    </div>
</template>
