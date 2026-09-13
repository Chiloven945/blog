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
            class="site-nav fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-md border border-default bg-default p-1.5 shadow-sm xl:flex"
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

        <span aria-hidden="true" class="my-0.5 h-px w-6 bg-accented"/>

        <NavigationItem
                v-for="item in items"
                :key="item.key"
                :active="item.key === activeKey"
                :item="item"
                variant="rail"
        />

        <span aria-hidden="true" class="my-0.5 h-px w-6 bg-accented"/>

        <SearchButton size="lg" square/>
        <LocaleSwitcher size="lg" square/>
        <ThemeButton size="lg" square/>
    </nav>
</template>
