<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'

defineProps<{
    stats: ProfileData['stats']
}>()

const failed = reactive<Record<string, boolean>>({})

function pad(value: number): string {
    return String(value).padStart(2, '0')
}
</script>

<template>
    <section
            id="stats"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div class="home-mosaic grid-cols-1 lg:grid-cols-12">
                <div
                        v-for="(stat, index) in stats"
                        :key="stat.id"
                        v-reveal="index * 90"
                        class="reveal flex flex-col p-6 lg:p-8"
                        :class="index === 0 ? 'home-tone-soft lg:col-span-7' : 'home-tone-faint lg:col-span-5'"
                >
                    <div class="flex items-center justify-between gap-4">
                        <span class="home-kicker opacity-60">STAT / {{ pad(index + 1) }}</span>
                        <a
                                :aria-label="stat.label"
                                :href="stat.url"
                                class="link text-xs"
                                rel="noopener noreferrer"
                                target="_blank"
                        >
                            {{ stat.label }} ↗
                        </a>
                    </div>

                    <!-- The metrics cards are tall (480x1150+) and keep their own
                         artwork; they are shown directly with no frame or radius. -->
                    <div class="mt-5 flex flex-1 items-start justify-center">
                        <img
                                v-if="stat.image && !failed[stat.id]"
                                :alt="stat.label"
                                :src="stat.image"
                                class="block h-auto w-full max-w-[480px]"
                                loading="lazy"
                                @error="failed[stat.id] = true"
                        >
                        <p
                                v-else
                                class="py-16 text-center font-mono text-xs text-muted"
                        >
                            {{ stat.label }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
