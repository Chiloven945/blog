<script lang="ts" setup>
import HomeArticleStrip from '~/components/home/HomeArticleStrip.vue'
import HomeContactMosaic from '~/components/home/HomeContactMosaic.vue'
import HomeFactMatrix from '~/components/home/HomeFactMatrix.vue'
import HomeHeroMosaic from '~/components/home/HomeHeroMosaic.vue'
import HomeIdentityRegister from '~/components/home/HomeIdentityRegister.vue'
import HomeInterestWall from '~/components/home/HomeInterestWall.vue'
import HomeMetricsPanel from '~/components/home/HomeMetricsPanel.vue'
import HomeNovelSpread from '~/components/home/HomeNovelSpread.vue'
import HomeSkillsBand from '~/components/home/HomeSkillsBand.vue'
import HomeTryingPoster from '~/components/home/HomeTryingPoster.vue'

definePageMeta({layout: 'home'})

const {t} = useI18n()

const {profile} = useProfile()
const {items: links} = useLinks()

usePageMeta({
    title: () => t('site.title'),
    description: () => profile.value?.meta.description || t('site.description'),
})

const {latestArticles, latestNovels} = await useHomeData()
</script>

<template>
    <div v-if="profile">
        <HomeHeroMosaic :profile="profile"/>
        <HomeIdentityRegister
                :names="profile.names"
                :notes="profile.notes"
        />
        <HomeFactMatrix
                :facts="profile.facts"
                :languages="profile.languages"
        />
        <HomeArticleStrip :articles="latestArticles"/>
        <HomeInterestWall :interests="profile.interests"/>
        <HomeNovelSpread :novels="latestNovels"/>
        <HomeTryingPoster
                :notes="profile.notes"
                :trying="profile.trying"
        />
        <HomeMetricsPanel :stats="profile.stats"/>
        <HomeSkillsBand :skills="profile.skills"/>
        <HomeContactMosaic :links="links"/>
    </div>
</template>
