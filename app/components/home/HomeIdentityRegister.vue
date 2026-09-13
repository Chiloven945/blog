<script lang="ts" setup>
import type {ProfileData} from '#shared/schemas/profile'

const props = defineProps<{
    names: ProfileData['names']
    notes: ProfileData['notes']
}>()

function pad(value: number): string {
    return String(value).padStart(2, '0')
}

const noteList = computed(() => {
    const seen: string[] = []

    for (const name of props.names) {
        if (name.note && !seen.includes(name.note)) {
            seen.push(name.note)
        }
    }

    return seen
        .filter(id => Boolean(props.notes[id]))
        .map((id, index) => ({id, index: index + 1, text: props.notes[id] as string}))
})

function noteIndex(id?: string): number {
    if (!id) {
        return 0
    }

    return noteList.value.find(item => item.id === id)?.index ?? 0
}
</script>

<template>
    <section
            id="about"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div class="grid gap-6 md:grid-cols-12 md:gap-12 lg:grid-cols-12 lg:gap-12">
                <div class="md:col-span-1 lg:col-span-1">
                    <span class="home-kicker home-vertical hidden text-muted md:inline lg:inline">NAMES</span>
                    <span class="home-kicker text-muted md:hidden lg:hidden">NAMES</span>
                </div>

                <div class="md:col-span-11 lg:col-span-11">
                    <ol class="border-t border-default">
                        <li
                                v-for="(name, index) in names"
                                :key="name.primary"
                                v-reveal="index * 70"
                                class="reveal grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-b border-default py-5 lg:py-7"
                        >
                            <span class="home-kicker text-dimmed tabular-nums">{{
                                    pad(index + 1)
                                }}</span>

                            <div class="min-w-0">
                                <p class="text-2xl leading-tight font-bold text-highlighted lg:text-4xl">
                                    <span class="font-display-sans">{{ name.primary }}</span>
                                    <span
                                            v-if="name.middle"
                                            class="font-display-serif font-normal italic text-toned"
                                    > ({{ name.middle }})</span>
                                    <span
                                            v-if="name.suffix"
                                            class="font-mono text-primary"
                                    >{{ name.suffix }}</span>
                                </p>

                                <p
                                        v-if="name.pronunciation"
                                        class="mt-1.5 font-mono text-xs text-muted"
                                >
                                    {{ name.pronunciation }}
                                </p>
                            </div>

                            <sup
                                    v-if="name.note"
                                    class="font-mono text-xs text-primary"
                            >{{ noteIndex(name.note) }}</sup>
                        </li>
                    </ol>

                    <div
                            v-if="noteList.length"
                            class="mt-6 grid gap-3 text-xs text-muted sm:grid-cols-2"
                    >
                        <p
                                v-for="note in noteList"
                                :key="note.id"
                                class="flex gap-2"
                        >
                            <sup class="font-mono text-primary">{{ note.index }}</sup>
                            <span>{{ note.text }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
