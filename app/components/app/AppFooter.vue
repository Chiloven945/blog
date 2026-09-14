<script lang="ts" setup>
import {licenses} from '#shared/config/licenses'
import {siteConfig} from '#shared/config/site'

const {t, locale} = useI18n()
const {featured} = useLinks()

const year = new Date().getFullYear()
const cc = licenses['cc-by-nc-sa-4.0']

function isExternal(url: string): boolean {
    return /^https?:\/\//i.test(url)
}
</script>

<template>
    <footer class="app-footer">
        <div class="container-page grid gap-10 py-12 lg:grid-cols-12 lg:py-16">
            <div class="lg:col-span-7">
                <p class="font-mono text-sm tracking-[0.3em]">{{ siteConfig.mark }}</p>
                <p class="mt-3 text-2xl font-bold">{{ siteConfig.shortName }}</p>
                <p class="mt-2 text-sm opacity-75">
                    © {{ siteConfig.since }}–{{ year }} {{ siteConfig.author }}
                </p>

                <div class="mt-6 flex items-start gap-3">
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

                    <div class="max-w-md text-xs leading-relaxed opacity-70">
                        <p>{{ t('license.siteLabel') }}</p>
                        <p class="mt-1">{{ t('license.siteNote') }}</p>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-5">
                <p class="home-kicker opacity-60">{{ t('common.links') }}</p>

                <ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                    <li
                            v-for="link in featured"
                            :key="link.id"
                    >
                        <a
                                :href="localizeInternalUrl(link.url, locale)"
                                :rel="isExternal(link.url) ? 'noopener noreferrer' : undefined"
                                :target="isExternal(link.url) ? '_blank' : undefined"
                                class="text-sm opacity-85 transition-opacity hover:opacity-100 hover:underline"
                        >
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>
