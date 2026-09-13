<script lang="ts" setup>
import {defaultArticleLicense, resolveLicense} from '#shared/config/licenses'

const props = defineProps<{
    license?: string
}>()

const {t} = useI18n()

const entry = computed(() => resolveLicense(props.license, defaultArticleLicense))
const label = computed(() => entry.value.labelKey
    ? t(entry.value.labelKey)
    : entry.value.label)
const licenseUrl = computed(() => entry.value.url ?? null)
const badge = computed(() => entry.value.badge ?? null)
</script>

<template>
    <div class="mt-12 border-t border-default pt-4 text-sm text-muted">
        <p class="font-mono text-xs tracking-[0.2em] uppercase">
            {{ t('post.license') }}
        </p>

        <div class="mt-3 flex items-center gap-3">
            <a
                    v-if="badge && licenseUrl"
                    :aria-label="label"
                    :href="licenseUrl"
                    class="shrink-0"
                    rel="noopener noreferrer"
                    target="_blank"
            >
                <img
                        :alt="label"
                        :src="badge"
                        class="h-6 w-auto"
                        height="42"
                        width="120"
                >
            </a>

            <div class="flex min-w-0 flex-col">
                <a
                        v-if="licenseUrl"
                        :href="licenseUrl"
                        class="link"
                        rel="noopener noreferrer"
                        target="_blank"
                >
                    {{ label }}
                </a>
                <span v-else>{{ label }}</span>

                <span v-if="licenseUrl" class="text-xs text-dimmed">
                    {{ t('license.articleStatement', {license: label}) }}
                </span>
            </div>
        </div>
    </div>
</template>
