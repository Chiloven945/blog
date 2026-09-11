<script lang="ts" setup>
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
import LocaleSwitcher from './LocaleSwitcher.vue'
import MobileNavigation from './MobileNavigation.vue'
import ThemeButton from './ThemeButton.vue'

const localePath = useLocalePath()
const {t} = useI18n()
</script>

<template>
    <UHeader
            :menu="{ title: t('common.menu'), description: t('site.description') }"
            :to="localePath('/')"
            :ui="{ root: 'bg-default backdrop-blur-none' }"
            mode="slideover"
    >
        <template #left>
            <AppLogo/>
        </template>

        <template #default>
            <AppNavigation/>
        </template>

        <template #right>
            <div class="hidden items-center gap-1 lg:flex">
                <SearchButton/>
                <LocaleSwitcher/>
                <ThemeButton/>
            </div>
        </template>

        <template #body>
            <MobileNavigation/>
        </template>
    </UHeader>
</template>
