<script lang="ts" setup>
defineProps<{
    interests: string[]
}>()
</script>

<template>
    <section class="container-page py-14 lg:py-20">
        <HomeSectionLabel :label="$t('home.sections.interests')"/>

        <ul class="mt-8 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
            <li
                    v-for="(interest, index) in interests"
                    :key="interest"
                    class="flex items-baseline gap-3 border-t border-default pt-4"
            >
                <span class="font-mono text-[0.7rem] text-dimmed tabular-nums">
                    {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="text-2xl font-bold tracking-tight text-highlighted uppercase sm:text-3xl lg:text-4xl">
                    {{ interest }}
                </span>
            </li>
        </ul>
    </section>
</template>
