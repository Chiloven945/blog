<script lang="ts" setup>
import {licenses} from '#shared/config/licenses'
import {siteConfig} from '#shared/config/site'

const {t} = useI18n()
const items = useSiteNavigation()
const year = new Date().getFullYear()

const footerItems = computed(() => items.value.filter(item => item.available))
const cc = licenses['cc-by-nc-sa-4.0']
</script>

<template>
    <UFooter :ui="{ root: 'app-footer border-t border-default' }">
        <template #left>
            <div class="flex flex-col gap-3">
                <p class="text-sm text-muted">
                    © {{ siteConfig.since }}–{{ year }} {{ siteConfig.author }}
                </p>

                <div class="flex items-center gap-3">
                    <a
                            :aria-label="t('license.badgeAlt')"
                            :href="cc.url"
                            class="shrink-0"
                            rel="noopener noreferrer"
                            target="_blank"
                    >
                        <img
                                :alt="t('license.badgeAlt')"
                                :src="cc.badge"
                                class="h-6 w-auto"
                                height="42"
                                width="120"
                        >
                    </a>

                    <div class="flex max-w-md flex-col text-xs text-muted">
                        <span>{{ t('license.siteLabel') }}</span>
                        <span class="text-dimmed">{{ t('license.siteNote') }}</span>
                    </div>
                </div>
            </div>
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
