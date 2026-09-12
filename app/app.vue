<script lang="ts" setup>
const {t, locale} = useI18n()
const head = useLocaleHead({seo: false})

useHead(() => ({
    htmlAttrs: head.value.htmlAttrs ?? {},
    meta: [{property: 'og:locale', content: resolveOgLocale(locale.value)}],
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
