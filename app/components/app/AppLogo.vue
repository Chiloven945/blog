<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'

const localePath = useLocalePath()
</script>

<template>
    <NuxtLink
            :aria-label="siteConfig.name"
            :to="localePath('/')"
            class="inline-flex items-baseline gap-1.5 font-bold tracking-tight"
    >
        <span class="text-xl leading-none text-highlighted">{{ siteConfig.shortName }}</span>
        <span class="font-mono text-xs leading-none text-muted">{{ siteConfig.since }}</span>
    </NuxtLink>
</template>
