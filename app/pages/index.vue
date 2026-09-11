<script lang="ts" setup>
definePageMeta({layout: 'home'})
</script>

<template>
    <section class="container-page py-16 lg:py-24">
        <p class="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            PERSONAL SPACE / 001
        </p>
        <h1 class="mt-6 text-5xl font-bold tracking-tight text-highlighted sm:text-7xl">
            {{ $t('site.title') }}
        </h1>
        <p class="mt-4 max-w-xl text-muted">
            {{ $t('site.description') }}
        </p>
    </section>
</template>
