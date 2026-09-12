<script lang="ts" setup>
import AppLogo from './AppLogo.vue'
import SiteRail from './SiteRail.vue'
import TopDock from './TopDock.vue'
import MobileDock from './MobileDock.vue'
</script>

<template>
    <div>
        <!-- Mobile keeps only a minimal floating brand; primary navigation
             lives in the bottom dock. -->
        <AppLogo class="fixed left-4 top-4 z-40 md:hidden"/>

        <SiteRail/>
        <TopDock/>
        <MobileDock/>
    </div>
</template>
