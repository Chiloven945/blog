<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        href: string
        title: string
        description?: string
        icon?: string
    }>(),
    {
        description: '',
        icon: 'i-lucide-link',
    },
)

const isExternal = computed(() => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href))
</script>

<template>
    <ULink
            :href="href"
            :target="isExternal ? '_blank' : undefined"
            class="link-card group my-6 flex items-start gap-3 rounded-sm border border-default p-4 transition-colors hover:border-primary"
            raw
    >
        <UIcon :name="icon" class="mt-0.5 size-5 shrink-0 text-primary"/>
        <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1 font-medium text-highlighted">
                <span>{{ title }}</span>
                <UIcon
                        v-if="isExternal"
                        class="size-3.5 text-muted"
                        name="i-lucide-arrow-up-right"
                />
            </div>
            <p v-if="description" class="mt-1 text-sm text-muted">
                {{ description }}
            </p>
        </div>
    </ULink>
</template>
