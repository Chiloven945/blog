<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'
import {siteConfig} from '#shared/config/site'

defineProps<{
    profile: ProfileData
}>()

const letters = ['CHI', 'LOV', 'EN'] as const
</script>

<template>
    <section
            id="identity"
            class="border-b border-default"
    >
        <div class="container-page pt-7 pb-12 lg:pt-12 lg:pb-20">
            <div class="home-mosaic grid-cols-1 md:grid-cols-12 lg:grid-cols-12">
                <!-- Name letters -->
                <div
                        v-reveal
                        class="reveal home-tone-strong col-span-1 flex min-h-[13rem] flex-col justify-between p-5 md:col-span-7 md:min-h-[26rem] md:p-8 lg:col-span-7 lg:min-h-[26rem] lg:p-8"
                >
                    <div class="home-kicker flex items-center justify-between opacity-75">
                        <span>{{ siteConfig.shortName }}</span>
                        <span>PERSONAL SPACE</span>
                    </div>

                    <h1 class="home-display font-display-sans text-white">
                        <span
                                v-for="(line, index) in letters"
                                :key="line"
                                v-reveal="index * 110"
                                class="reveal-text block"
                        >{{ line }}</span>
                    </h1>
                </div>

                <!-- Right column: avatar top, 945 below. Each cell keeps the
                     tone that originally sat there. -->
                <div class="home-mosaic grid-cols-2 md:col-span-5 md:grid-cols-1 lg:col-span-5">
                    <div
                            v-reveal
                            class="reveal home-tone-deep flex min-h-[7rem] items-center justify-center p-5 md:items-start md:justify-end lg:items-start lg:justify-end lg:p-5"
                    >
                        <NuxtImg
                                v-reveal="120"
                                :alt="siteConfig.author"
                                class="reveal-mask aspect-square w-36 max-w-full object-cover xl:w-44"
                                format="webp"
                                height="352"
                                loading="lazy"
                                src="/images/avatar/avatar.png"
                                width="352"
                        />
                    </div>

                    <div
                            v-reveal="180"
                            class="reveal home-tone-soft flex min-h-[7rem] items-center justify-center p-5"
                    >
                        <span class="home-number tabular-nums">945</span>
                    </div>
                </div>

                <!-- Motto -->
                <div
                        v-reveal="300"
                        class="reveal home-paper col-span-1 flex min-h-[9rem] items-end p-5 md:col-span-8 md:min-h-[11rem] md:p-8 lg:col-span-8 lg:min-h-[11rem] lg:p-8"
                >
                    <p class="font-display-serif text-2xl leading-snug text-highlighted sm:text-3xl lg:text-4xl">
                        {{ profile.motto }}
                    </p>
                </div>

                <!-- Since: label top-left, year bottom-right -->
                <div
                        v-reveal="240"
                        class="reveal home-tone-faint col-span-1 flex min-h-[9rem] flex-col justify-between p-5 md:col-span-4 md:min-h-[11rem] lg:col-span-4 lg:min-h-[11rem]"
                >
                    <span class="home-kicker opacity-70">SINCE</span>
                    <span class="self-end text-3xl font-bold tabular-nums">{{
                            siteConfig.since
                        }}</span>
                </div>
            </div>
        </div>
    </section>
</template>
