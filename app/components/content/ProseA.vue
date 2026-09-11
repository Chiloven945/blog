<script lang="ts" setup>
const props = defineProps<{ href?: string }>()

const isExternal = computed(() => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href ?? ''))

const linkClass = [
    'text-primary font-medium border-b border-transparent transition-colors',
    'hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
].join(' ')
</script>

<template>
    <ULink
            :class="linkClass"
            :href="href"
            :target="isExternal ? '_blank' : undefined"
            raw
    >
        <slot/>
        <UIcon
                v-if="isExternal"
                class="ms-0.5 inline-block size-3.5 align-baseline"
                name="i-lucide-arrow-up-right"
        />
    </ULink>
</template>
