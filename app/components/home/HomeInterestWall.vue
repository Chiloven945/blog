<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'

defineProps<{
    interests: ProfileData['interests']
}>()

const spans = [
    'col-span-2 row-span-2 lg:col-span-3 lg:row-span-2',
    'col-span-1 lg:col-span-1',
    'col-span-1 row-span-2 lg:col-span-2',
    'col-span-2 lg:col-span-2',
    'col-span-1 lg:col-span-1',
    'col-span-2 lg:col-span-2',
    'col-span-1 lg:col-span-1',
    'col-span-1 row-span-2 lg:col-span-1 lg:row-span-2',
    'col-span-2 lg:col-span-2',
    'col-span-1 lg:col-span-1',
]

const tones = ['home-tone-faint', 'home-tone-soft', 'home-tone-faint', 'home-tone-strong']

function spanClass(index: number): string {
    return spans[index % spans.length] ?? 'col-span-1'
}

function toneClass(index: number): string {
    return tones[index % tones.length] ?? 'home-tone-faint'
}
</script>

<template>
    <section
            id="interests"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div
                    v-reveal
                    class="reveal flex items-baseline justify-between gap-4 border-b border-default pb-3"
            >
                <h2 class="home-kicker text-muted">INTERESTS</h2>
                <span class="font-mono text-xs text-dimmed tabular-nums">{{ interests.length }}</span>
            </div>

            <div
                    class="home-mosaic mt-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                    style="grid-auto-flow: dense"
            >
                <div
                        v-for="(interest, index) in interests"
                        :key="interest.text"
                        v-reveal="index * 45"
                        class="reveal flex min-h-[5.5rem] flex-col justify-between p-4 lg:min-h-[7rem] lg:p-5"
                        :class="[spanClass(index), toneClass(index)]"
                >
                    <span class="text-xl">{{ interest.icon }}</span>
                    <p class="mt-3 text-base leading-snug font-bold lg:text-lg">
                        {{ interest.text }}
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
