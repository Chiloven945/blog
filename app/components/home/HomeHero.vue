<script lang="ts" setup>
import type {HomeData} from '#shared/types/content'
import {siteConfig} from '#shared/config/site'

const props = defineProps<{
    hero: HomeData['hero']
    roles?: string[]
}>()

const roleLine = computed(() => (props.roles ?? []).join(' / '))
</script>

<template>
    <section class="border-b border-default">
        <div class="container-page pt-10 pb-14 lg:pt-16 lg:pb-20">
            <div v-reveal class="reveal flex items-baseline justify-between gap-6">
                <span class="font-mono text-xs tracking-[0.3em] text-highlighted uppercase">
                    {{ siteConfig.shortName }}
                </span>
                <span class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                    {{ hero.eyebrow }}
                </span>
            </div>

            <div class="mt-12 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-12 lg:items-end">
                <h1 class="home-display font-display-sans text-highlighted lg:col-span-9">
                    <span
                            v-for="(line, index) in hero.title"
                            :key="index"
                            v-reveal="index * 90"
                            class="reveal-text block"
                    >{{ line }}</span>
                </h1>

                <div
                        v-reveal="180"
                        class="reveal flex flex-col items-start gap-2 lg:col-span-3 lg:items-end lg:gap-3"
                >
                    <span class="home-number text-primary tabular-nums">{{ hero.number }}</span>
                    <span class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                        PERSONAL SPACE
                    </span>
                </div>
            </div>

            <div v-reveal="260" class="reveal mt-12 border-t border-default pt-6 lg:mt-20">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <p
                            v-if="roleLine"
                            class="font-mono text-sm tracking-[0.2em] text-toned uppercase"
                    >
                        {{ roleLine }}
                    </p>
                    <p class="max-w-xl text-muted lg:text-right">{{ hero.description }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
