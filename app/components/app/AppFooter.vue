<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'

const items = useSiteNavigation()
const year = new Date().getFullYear()

const footerItems = computed(() => items.value.filter(item => item.available))
</script>

<template>
    <UFooter :ui="{ root: 'app-footer border-t border-default' }">
        <template #left>
            <p class="text-sm text-muted">
                © {{ siteConfig.since }}–{{ year }} {{ siteConfig.author }}
            </p>
        </template>

        <template #right>
            <UButton
                    v-for="item in footerItems"
                    :key="item.key"
                    :to="item.to"
                    color="neutral"
                    size="sm"
                    variant="link"
            >
                {{ item.label }}
            </UButton>
        </template>
    </UFooter>
</template>
