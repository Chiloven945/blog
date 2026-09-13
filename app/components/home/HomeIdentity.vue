<script lang="ts" setup>
import type {HomeData} from '#shared/types/content'

defineProps<{
    identity: NonNullable<HomeData['identity']>
}>()
</script>

<template>
    <section v-reveal class="reveal container-page py-14 lg:py-20">
        <HomeSectionLabel :label="$t('home.sections.identity')"/>

        <div class="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div class="lg:col-span-7">
                <p
                        v-if="identity.statement"
                        class="text-3xl leading-[1.1] font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl"
                >
                    {{ identity.statement }}
                </p>
                <p v-if="identity.bio" class="mt-6 max-w-xl text-base/7 text-toned">
                    {{ identity.bio }}
                </p>
            </div>

            <dl v-if="identity.facts?.length" class="lg:col-span-5">
                <div
                        v-for="fact in identity.facts"
                        :key="fact.label"
                        class="flex items-baseline justify-between gap-6 border-t border-default py-3 last:border-b"
                >
                    <dt class="font-mono text-xs tracking-[0.2em] text-muted uppercase">{{
                            fact.label
                        }}
                    </dt>
                    <dd class="text-right text-sm text-default">{{ fact.value }}</dd>
                </div>
            </dl>
        </div>

        <ol
                v-if="identity.notes?.length"
                class="mt-10 space-y-2 border-t border-default pt-6 text-sm text-muted lg:mt-12"
        >
            <li
                    v-for="(note, index) in identity.notes"
                    :key="note.id"
                    class="flex gap-3"
            >
                <span class="font-mono text-xs text-dimmed tabular-nums">
                    {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span>{{ note.text }}</span>
            </li>
        </ol>
    </section>
</template>
