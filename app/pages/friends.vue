<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'
import type {FriendItem} from '#shared/types/content'
import FriendGrid from '~/components/friends/FriendGrid.vue'

const {t} = useI18n()
const route = useRoute()

const {data} = await useAsyncData('friends-page', () => queryCollection('friends').first())

const friends = computed<FriendItem[]>(() => {
    const items = (data.value?.items ?? []) as FriendItem[]

    return items
        .slice()
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
})

const canonical = computed(() => `${siteConfig.domain}${route.path}`)

useSeoMeta({
    title: () => t('friends.title'),
    description: () => t('friends.description'),
    ogTitle: () => t('friends.title'),
    ogDescription: () => t('friends.description'),
    ogType: 'website',
    ogUrl: () => canonical.value,
    twitterCard: 'summary_large_image',
})

useHead(() => ({
    link: [{rel: 'canonical', href: canonical.value}],
}))
</script>

<template>
    <div>
        <header class="max-w-2xl">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('friends.label') }}
            </p>
            <h1 class="mt-3 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                {{ t('friends.title') }}
            </h1>
            <p class="mt-3 text-base/7 text-muted">{{ t('friends.description') }}</p>
        </header>

        <div v-if="friends.length" class="mt-10">
            <FriendGrid :friends="friends"/>
        </div>

        <div
                v-else
                class="mt-10 rounded-sm border border-dashed border-default px-6 py-16 text-center"
        >
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('friends.emptyEyebrow') }}
            </p>
            <p class="mt-3 text-lg font-bold text-highlighted">{{ t('friends.empty') }}</p>
        </div>
    </div>
</template>
