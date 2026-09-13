<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'

defineProps<{
    facts: ProfileData['facts']
    languages: ProfileData['languages']
}>()
</script>

<template>
    <section
            id="facts"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <h2
                    v-reveal
                    class="reveal font-display-sans text-4xl font-bold tracking-tight text-highlighted lg:text-6xl"
            >
                FYI
            </h2>

            <div class="home-mosaic mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                <div
                        v-reveal
                        class="reveal home-tone-deep col-span-1 flex min-h-[10rem] flex-col justify-between p-6 lg:col-span-4 lg:row-span-2 lg:p-8"
                >
                    <span class="text-4xl lg:text-5xl">{{ facts[0]?.icon }}</span>
                    <p class="text-2xl font-bold lg:text-3xl">{{ facts[0]?.text }}</p>
                </div>

                <div
                        v-reveal="90"
                        class="reveal home-tone-soft col-span-1 min-h-[10rem] p-6 sm:col-span-1 lg:col-span-2 lg:row-span-2"
                >
                    <span class="home-kicker opacity-60">LANGUAGES</span>
                    <ul class="mt-4">
                        <li
                                v-for="language in languages"
                                :key="language.name"
                                class="flex items-baseline justify-between gap-3 border-b border-default py-2 last:border-b-0"
                        >
                            <span class="text-lg font-bold">{{ language.name }}</span>
                            <span class="font-mono text-xs text-muted">{{ language.level }}</span>
                        </li>
                    </ul>
                </div>

                <div
                        v-for="(fact, index) in facts.slice(1)"
                        :key="fact.text"
                        v-reveal="120 + index * 70"
                        :class="index % 2 === 0 ? 'home-tone-strong' : 'home-tone-faint'"
                        class="reveal col-span-1 flex min-h-[7rem] flex-col justify-between p-5 sm:col-span-1 lg:col-span-2"
                >
                    <span class="text-2xl">{{ fact.icon }}</span>
                    <p class="text-lg font-semibold">{{ fact.text }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
