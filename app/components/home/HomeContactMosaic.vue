<script lang="ts" setup>
import type {LinkItem} from '#shared/schemas/links'

defineProps<{
    links: LinkItem[]
}>()

const {locale} = useI18n()
const rssHref = computed(() => `/${locale.value}/rss.xml`)

function description(link: LinkItem): string {
    return link.description[locale.value] ?? link.description.en ?? ''
}

function isExternal(link: LinkItem): boolean {
    return /^https?:\/\//i.test(link.url)
}

function blockClass(link: LinkItem, index: number): string {
    const span = link.featured
        ? 'col-span-2'
        : 'col-span-1'

    if (link.id === 'underground') {
        return `${span} home-tone-deep`
    }

    return `${span} ${index % 2 === 0
        ? 'home-tone-soft'
        : 'home-tone-faint'}`
}
</script>

<template>
    <section
            id="links"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div
                    v-reveal
                    class="reveal flex items-end justify-between gap-4 border-b border-default pb-3"
            >
                <h2 class="font-display-sans text-4xl font-bold tracking-tight text-highlighted lg:text-6xl">
                    CONTACT
                </h2>
                <a
                        :href="rssHref"
                        class="link text-sm"
                >RSS →</a>
            </div>

            <div class="home-mosaic mt-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <a
                        v-for="(link, index) in links"
                        :key="link.id"
                        v-reveal="index * 40"
                        :aria-label="link.label"
                        :class="blockClass(link, index)"
                        :href="localizeInternalUrl(link.url, locale)"
                        :rel="isExternal(link) ? 'noopener noreferrer' : undefined"
                        :target="isExternal(link) ? '_blank' : undefined"
                        class="reveal group flex min-h-[4.5rem] flex-col justify-between p-5 lg:min-h-[7rem]"
                >
                    <div class="flex items-center justify-between gap-3">
                        <span class="text-base font-bold">{{ link.label }}</span>

                        <UIcon
                                v-if="link.icon && !link.image"
                                :name="link.icon"
                                class="size-5 shrink-0"
                        />
                        <img
                                v-else-if="link.image"
                                :alt="link.label"
                                :src="link.image"
                                class="size-6 shrink-0 object-contain"
                                loading="lazy"
                        >
                    </div>

                    <p class="mt-3 line-clamp-2 text-xs opacity-75">
                        {{ description(link) }}
                    </p>
                </a>
            </div>
        </div>
    </section>
</template>
