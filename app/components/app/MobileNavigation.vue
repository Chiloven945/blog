<script lang="ts" setup>
import LocaleSwitcher from './LocaleSwitcher.vue'
import ThemeButton from './ThemeButton.vue'

const items = useMainNavigation()
</script>

<template>
    <div class="flex flex-col gap-6">
        <UNavigationMenu
                :items="items"
                color="neutral"
                orientation="vertical"
        />

        <div class="flex items-center gap-1 border-t border-default pt-4">
            <SearchButton/>
            <LocaleSwitcher/>
            <ThemeButton/>
        </div>
    </div>
</template>
