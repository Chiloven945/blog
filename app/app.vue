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
    // Reveal animation is an enhancement: without JS the content must still
    // be visible. The directive reveals it when JS is on.
    noscript: [
        {
            innerHTML: '<style>.reveal,.reveal-text,.reveal-mask{opacity:1!important;transform:none!important;clip-path:none!important}</style>',
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
