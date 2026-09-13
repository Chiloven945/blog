<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'

const props = defineProps<{
    trying: ProfileData['trying']
    notes: ProfileData['notes']
}>()

const noteRefs = computed(() =>
    props.trying
        .map(item => item.note)
        .filter((id): id is string => typeof id === 'string' && Boolean(props.notes[id])),
)

function noteIndex(id?: string): number {
    if (!id) {
        return 0
    }

    return noteRefs.value.indexOf(id) + 1
}

function pad(value: number): string {
    return String(value).padStart(2, '0')
}
</script>

<template>
    <section
            id="process"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <h2
                    v-reveal
                    class="reveal font-display-serif text-4xl font-bold text-highlighted lg:text-6xl"
            >
                Trying
            </h2>

            <div class="home-mosaic mt-8 sm:grid-cols-2">
                <div
                        v-for="(item, index) in trying"
                        :key="item.text"
                        v-reveal="index * 55"
                        :class="index % 4 === 3 ? 'home-tone-soft sm:col-span-2' : 'home-tone-faint'"
                        class="reveal flex min-h-[6rem] items-start gap-4 p-5"
                >
                    <span class="font-display-serif text-3xl font-bold text-primary tabular-nums">
                        {{ pad(index + 1) }}
                    </span>

                    <p
                            :class="item.struck ? 'text-dimmed line-through' : ''"
                            class="pt-1 text-lg leading-snug font-semibold"
                    >
                        <span class="me-2">{{ item.icon }}</span>{{ item.text }}<sup
                            v-if="item.note"
                            class="ms-1 font-mono text-xs text-primary"
                    >{{ noteIndex(item.note) }}</sup>
                    </p>
                </div>
            </div>

            <div
                    v-if="noteRefs.length"
                    class="mt-6 grid gap-3 text-xs text-muted sm:grid-cols-2"
            >
                <p
                        v-for="(id, index) in noteRefs"
                        :key="id"
                        class="flex gap-2"
                >
                    <sup class="font-mono text-primary">{{ index + 1 }}</sup>
                    <span>{{ notes[id] }}</span>
                </p>
            </div>
        </div>
    </section>
</template>
