<script lang="ts" setup>
import type {ArchivePost} from '~/composables/useArchives'

defineProps<{
    post: ArchivePost
}>()
</script>

<template>
    <li>
        <NuxtLink
                :to="post.path"
                class="group flex items-baseline gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            <time
                    :datetime="post.date"
                    class="w-8 shrink-0 font-mono text-sm tabular-nums text-muted"
            >
                {{ String(post.day).padStart(2, '0') }}
            </time>

            <span
                    class="min-w-0 flex-1 truncate font-medium text-highlighted transition-colors group-hover:text-primary"
            >
                {{ post.title }}
            </span>

            <UIcon
                    aria-hidden="true"
                    class="size-4 shrink-0 text-dimmed opacity-0 transition-opacity group-hover:opacity-100"
                    name="i-lucide-arrow-right"
            />
        </NuxtLink>
    </li>
</template>
