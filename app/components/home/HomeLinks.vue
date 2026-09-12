<script lang="ts" setup>
import {siteConfig} from '#shared/config/site'

const {t} = useI18n()

const links = computed(() => siteConfig.social)

function isExternal(to: string) {
    return /^https?:\/\//i.test(to)
}
</script>

<template>
    <section class="container-page py-14 lg:py-20">
        <HomeSectionLabel :label="t('home.sections.links')"/>

        <ul class="mt-8 divide-y divide-default border-y">
            <li
                    v-for="(link, index) in links"
                    :key="link.label"
                    v-reveal="index * 60"
                    class="reveal"
            >
                <a
                        :href="link.to"
                        :rel="isExternal(link.to) ? 'noopener noreferrer' : undefined"
                        :target="isExternal(link.to) ? '_blank' : undefined"
                        class="group flex items-center justify-between gap-4 py-4"
                >
                    <span class="flex items-center gap-3">
                        <UIcon :name="link.icon" class="size-5 text-muted"/>
                        <span class="font-medium text-highlighted transition-colors group-hover:text-primary">
                            {{ link.label }}
                        </span>
                    </span>
                    <UIcon
                            class="size-4 text-dimmed transition-transform group-hover:-translate-y-0.5"
                            name="i-lucide-arrow-up-right"
                    />
                </a>
            </li>
        </ul>
    </section>
</template>
