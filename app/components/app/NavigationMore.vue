<script lang="ts" setup>
import NavigationItem from './NavigationItem.vue'
import LocaleSwitcher from './LocaleSwitcher.vue'
import ThemeButton from './ThemeButton.vue'
import {siteConfig} from '#shared/config/site'

const emit = defineEmits<{navigate: []}>()
const {t} = useI18n()
const items = useSiteNavigation()
const activeKey = useActiveNavKey()

const moreItems = computed(() => items.value.filter(item => ['tags', 'archives', 'friends'].includes(item.key)))
</script>

<template>
    <div class="flex flex-col gap-6 pb-2">
        <div class="flex flex-col gap-1">
            <NavigationItem
                    v-for="item in moreItems"
                    :key="item.key"
                    :active="item.key === activeKey"
                    :item="item"
                    variant="row"
                    @click="emit('navigate')"
            />
        </div>

        <div class="border-t border-default pt-4">
            <p class="mb-2 px-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                {{ t('common.settings') }}
            </p>

            <div class="flex items-center justify-between gap-3 rounded-sm px-3 py-2">
                <span class="text-sm text-default">{{ t('common.language') }}</span>
                <LocaleSwitcher/>
            </div>

            <div class="flex items-center justify-between gap-3 rounded-sm px-3 py-2">
                <span class="text-sm text-default">{{ t('common.theme') }}</span>
                <ThemeButton/>
            </div>

            <a
                    :aria-label="siteConfig.social.find(link => link.label === 'RSS')?.label ?? 'RSS'"
                    class="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted transition-ui hover:bg-elevated hover:text-highlighted focus-ring"
                    href="/rss.xml"
            >
                <UIcon class="size-5 shrink-0" name="i-lucide-rss"/>
                <span>RSS</span>
            </a>
        </div>
    </div>
</template>
