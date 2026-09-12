<script lang="ts" setup>
import HomeArtBlock from '~/components/home/HomeArtBlock.vue'
import HomeHero from '~/components/home/HomeHero.vue'
import HomeIdentity from '~/components/home/HomeIdentity.vue'
import HomeInterests from '~/components/home/HomeInterests.vue'
import HomeLinks from '~/components/home/HomeLinks.vue'
import HomeManifesto from '~/components/home/HomeManifesto.vue'
import HomeNow from '~/components/home/HomeNow.vue'
import HomeWriting from '~/components/home/HomeWriting.vue'

definePageMeta({layout: 'home'})

const {t} = useI18n()

usePageMeta({
    title: () => t('site.title'),
    description: () => t('site.description'),
})

const {home, latestPosts} = await useHomeData()
</script>

<template>
    <div v-if="home">
        <HomeHero :hero="home.hero" :roles="home.identity?.roles ?? []"/>
        <HomeIdentity v-if="home.identity" :identity="home.identity"/>
        <HomeManifesto :manifesto="home.manifesto"/>
        <HomeInterests :interests="home.interests ?? []"/>
        <HomeNow :now="home.now ?? {}"/>
        <HomeWriting :posts="latestPosts"/>
        <HomeLinks/>
        <HomeArtBlock/>
    </div>
</template>
