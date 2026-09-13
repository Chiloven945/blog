<script lang="ts" setup>
import {defaultNovelLicense, resolveLicense} from '#shared/config/licenses'
import {siteConfig} from '#shared/config/site'

const props = defineProps<{
    license?: string
    date?: string
}>()

const {t, locale} = useI18n()

const entry = computed(() => resolveLicense(props.license, defaultNovelLicense))
const label = computed(() => entry.value.labelKey
    ? t(entry.value.labelKey)
    : entry.value.label)
const licenseUrl = computed(() => entry.value.url ?? null)
const published = computed(() => (props.date
    ? formatPostDate(props.date, locale.value)
    : ''))
</script>

<template>
    <footer class="novel-colophon mt-16 border-t border-default pt-6 text-center text-sm text-muted">
        <p class="font-mono text-xs tracking-[0.25em] uppercase">
            {{ t('post.license') }}
        </p>

        <p class="mt-3">© {{ siteConfig.author }}</p>

        <p class="mt-0.5">
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
        </p>

        <p v-if="published" class="mt-1 text-xs text-dimmed">
            {{ t('novel.firstPublished', {date: published}) }}
        </p>
    </footer>
</template>
