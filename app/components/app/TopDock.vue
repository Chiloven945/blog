<script lang="ts" setup>
import NavigationItem from './NavigationItem.vue'
import LocaleSwitcher from './LocaleSwitcher.vue'
import ThemeButton from './ThemeButton.vue'
import SearchButton from '../search/SearchButton.vue'
import {siteConfig} from '#shared/config/site'

const items = useSiteNavigation()
const activeKey = useActiveNavKey()
const localePath = useLocalePath()
const {t} = useI18n()
</script>

<template>
    <nav
            :aria-label="t('nav.primary')"
            class="site-nav fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 items-center gap-1 rounded-md border border-default bg-default p-1.5 shadow-sm md:flex xl:hidden"
    >
        <NuxtLink
                :aria-label="siteConfig.name"
                :to="localePath('/')"
                class="flex size-10 items-center justify-center overflow-hidden rounded-sm"
        >
            <NuxtImg
                    :alt="siteConfig.name"
                    class="size-full object-cover"
                    format="webp"
                    height="80"
                    loading="eager"
                    src="/images/avatar/avatar.png"
                    width="80"
            />
        </NuxtLink>

        <span aria-hidden="true" class="mx-1 h-6 w-px bg-accented"/>

        <NavigationItem
                v-for="item in items"
                :key="item.key"
                :active="item.key === activeKey"
                :item="item"
                variant="dock"
        />

        <span aria-hidden="true" class="mx-1 h-6 w-px bg-accented"/>

        <SearchButton/>
        <LocaleSwitcher hide-chevron/>
        <ThemeButton/>
    </nav>
</template>
