<script lang="ts" setup>
import NavigationItem from './NavigationItem.vue'
import NavigationMore from './NavigationMore.vue'

const {t} = useI18n()
const items = useSiteNavigation()
const activeKey = useActiveNavKey()

const dockItems = computed(() => items.value.filter(item => ['home', 'articles', 'novels', 'friends'].includes(item.key)))
const moreOpen = ref(false)
</script>

<template>
    <nav
            :aria-label="t('nav.primary')"
            class="site-nav fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 flex items-stretch gap-1 rounded-md border border-default bg-default p-1.5 shadow-sm md:hidden"
    >
        <NavigationItem
                v-for="item in dockItems"
                :key="item.key"
                :active="item.key === activeKey"
                :item="item"
                variant="mobile"
        />

        <button
                :aria-label="t('common.more')"
                class="group flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-sm py-1.5 text-[0.6875rem] font-medium text-muted transition-ui hover:bg-elevated hover:text-highlighted focus-ring"
                type="button"
                @click="moreOpen = true"
        >
            <UIcon class="size-5 shrink-0" name="i-lucide-ellipsis"/>
            <span class="truncate">{{ t('common.more') }}</span>
        </button>
    </nav>

    <USlideover
            v-model:open="moreOpen"
            :description="t('site.description')"
            :title="t('common.more')"
            side="bottom"
            :ui="{ content: 'rounded-t-md' }"
    >
        <template #body>
            <NavigationMore @navigate="moreOpen = false"/>
        </template>
    </USlideover>
</template>
