<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'

defineProps<{
    skills: ProfileData['skills']
}>()

const failed = ref(false)
</script>

<template>
    <section
            aria-label="Tools"
            class="home-tone-deep border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div
                    v-reveal
                    class="reveal grid gap-8 lg:grid-cols-12 lg:items-center"
            >
                <div class="lg:col-span-4">
                    <p class="home-kicker opacity-60">TOOLS / USED / NOT CLAIMED MASTERY</p>
                    <p
                            v-if="skills.description"
                            class="mt-5 text-lg/relaxed opacity-90"
                    >
                        {{ skills.description }}
                    </p>
                </div>

                <div class="lg:col-span-8">
                    <div class="rounded-sm border border-white/15 bg-black/25 p-4">
                        <img
                                v-if="skills.image && !failed"
                                :src="skills.image"
                                alt="Tools used"
                                class="w-full"
                                loading="lazy"
                                @error="failed = true"
                        >
                        <p
                                v-else
                                class="home-kicker py-8 text-center opacity-60"
                        >
                            TOOLS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
