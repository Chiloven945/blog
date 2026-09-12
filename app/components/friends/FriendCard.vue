<script lang="ts" setup>
import type {FriendItem} from '#shared/types/content'

const props = defineProps<{
    friend: FriendItem
}>()

const {locale} = useI18n()

const description = computed(
    () =>
        props.friend.description?.[locale.value] ??
        props.friend.description?.['zh-cn'] ??
        props.friend.description?.['en'] ??
        '',
)

const domain = computed(() => {
    try {
        return new URL(props.friend.url).hostname.replace(/^www\./, '')
    } catch {
        return props.friend.url
    }
})

const isRemote = computed(() => /^https?:\/\//i.test(props.friend.avatar ?? ''))
</script>

<template>
    <a
            :href="friend.url"
            class="group transition-ui flex h-full flex-col rounded-sm border border-default bg-default p-5 hover:-translate-y-0.5 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            rel="noopener noreferrer"
            target="_blank"
    >
        <div class="flex items-center gap-3">
            <div
                    class="size-12 shrink-0 overflow-hidden rounded-sm border border-default bg-elevated"
            >
                <NuxtImg
                        v-if="friend.avatar && !isRemote"
                        :alt="friend.name"
                        :src="friend.avatar"
                        class="h-full w-full object-cover"
                        format="webp"
                        height="96"
                        loading="lazy"
                        width="96"
                />

                <!-- Remote avatars stay remote (ROADMAP §31.4); add their host
                     to `image.domains` in nuxt.config to optimize them. -->
                <img
                        v-else-if="isRemote"
                        :alt="friend.name"
                        :src="friend.avatar"
                        class="h-full w-full object-cover"
                        loading="lazy"
                        referrerpolicy="no-referrer"
                >

                <div v-else class="flex h-full w-full items-center justify-center text-muted">
                    <UIcon aria-hidden="true" class="size-5" name="i-lucide-user"/>
                </div>
            </div>

            <div class="min-w-0 flex-1">
                <p class="truncate font-bold text-highlighted transition-colors group-hover:text-primary">
                    {{ friend.name }}
                </p>
                <p class="truncate font-mono text-xs text-muted">{{ domain }}</p>
            </div>

            <UIcon
                    aria-hidden="true"
                    class="size-4 shrink-0 text-dimmed transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    name="i-lucide-arrow-up-right"
            />
        </div>

        <p v-if="description" class="mt-4 line-clamp-3 text-sm/6 text-muted">
            {{ description }}
        </p>
    </a>
</template>
