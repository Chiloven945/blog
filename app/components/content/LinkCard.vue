<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        href: string
        title: string
        description?: string
        icon?: string
        image?: string
    }>(),
    {
        description: '',
        icon: 'i-lucide-link',
        image: '',
    },
)

const isExternal = computed(() => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href))
const hasImage = computed(() => props.image.length > 0)
const isRemoteImage = computed(() => /^https?:\/\//i.test(props.image))
</script>

<template>
    <ULink
            :href="href"
            :target="isExternal ? '_blank' : undefined"
            class="link-card group my-6 flex items-start gap-3 rounded-sm border border-default p-4 transition-colors hover:border-primary"
            raw
    >
        <img
                v-if="hasImage && isRemoteImage"
                :alt="title"
                :src="image"
                class="mt-0.5 size-5 shrink-0 rounded-sm object-contain"
                loading="lazy"
                referrerpolicy="no-referrer"
        >
        <NuxtImg
                v-else-if="hasImage"
                :alt="title"
                :src="image"
                class="mt-0.5 size-5 shrink-0 rounded-sm object-contain"
                format="webp"
                loading="lazy"
        />
        <UIcon v-else :name="icon" class="mt-0.5 size-5 shrink-0 text-primary"/>
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
