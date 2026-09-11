<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'

const items = useMainNavigation()
const year = new Date().getFullYear()
</script>

<template>
    <UFooter :ui="{ root: 'border-t border-default' }">
        <template #left>
            <p class="text-sm text-muted">
                © {{ siteConfig.since }}–{{ year }} {{ siteConfig.author }}
            </p>
        </template>

        <template #right>
            <UButton
                    v-for="item in items"
                    :key="item.to"
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
