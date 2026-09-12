<script lang="ts" setup>
import type {HomeData} from '#shared/types/content'

defineProps<{
    manifesto: HomeData['manifesto']
}>()
</script>

<template>
    <section v-reveal class="reveal container-page py-14 lg:py-20">
        <HomeSectionLabel :label="$t('home.sections.manifesto')"/>

        <figure class="mt-8 border-l-2 border-primary pl-6 lg:pl-10">
            <blockquote class="max-w-4xl">
                <p class="font-display-serif text-2xl leading-snug font-bold tracking-tight text-highlighted sm:text-3xl lg:text-4xl">
                    {{ manifesto.body }}
                </p>
            </blockquote>
            <figcaption class="mt-4 font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ manifesto.title }}
            </figcaption>
        </figure>
    </section>
</template>
