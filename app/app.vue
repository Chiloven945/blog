<script lang="ts" setup>
const {t} = useI18n()
const head = useLocaleHead({seo: false})

useHead(() => ({
    htmlAttrs: head.value.htmlAttrs ?? {},
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
