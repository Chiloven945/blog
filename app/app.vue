<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'

const {t, locale} = useI18n()
const head = useLocaleHead({seo: false})

useHead(() => ({
    htmlAttrs: head.value.htmlAttrs ?? {},
    meta: [
        {property: 'og:locale', content: resolveOgLocale(locale.value)},
        {property: 'og:site_name', content: siteConfig.name},
    ],
    link: [
        {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: siteConfig.name,
            href: `${siteConfig.domain}/rss.xml`,
        },
    ],
}))
</script>

<template>
    <UApp>
        <a class="skip-link" href="#main">{{ t('common.skipToContent') }}</a>

        <NuxtLayout>
            <NuxtPage/>
        </NuxtLayout>

        <SearchModal/>
    </UApp>
</template>
