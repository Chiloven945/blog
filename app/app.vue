<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'
import {fontPreloadLink, resolveFontFiles} from '~/utils/fonts'

const {t, locale} = useI18n()
const head = useLocaleHead({seo: false})

// Restore the NSFW preference after hydration. The state is shared via
// `useState`, so the settings UI and NSFW surfaces read the same values.
useNsfwPreferences()

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
            href: `${siteConfig.domain}/${locale.value}/rss.xml`,
        },
        // Only the active locale's UI sans is preloaded; the reading serif
        // is preloaded per route (see pages/articles/[slug].vue and
        // pages/novels/[slug].vue).
        fontPreloadLink(resolveFontFiles(locale.value).sans),
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
        <SettingsModal/>
    </UApp>
</template>
