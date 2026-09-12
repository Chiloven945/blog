<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
    <section class="border-y border-default bg-elevated">
        <div class="container-page py-14 lg:py-20">
            <HomeSectionLabel :label="t('home.sections.art')"/>

            <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <figure class="overflow-hidden">
                    <NuxtImg
                            alt=""
                            class="aspect-16/10 w-full object-cover"
                            format="webp"
                            loading="lazy"
                            src="/images/home/art-01.webp"
                    />
                </figure>
                <figure class="overflow-hidden">
                    <NuxtImg
                            alt=""
                            class="aspect-16/10 w-full object-cover"
                            format="webp"
                            loading="lazy"
                            src="/images/home/art-02.webp"
                    />
                </figure>
            </div>

            <p class="mt-4 font-mono text-xs tracking-[0.25em] text-muted uppercase">
                {{ t('home.art.caption') }}
            </p>
        </div>
    </section>
</template>
