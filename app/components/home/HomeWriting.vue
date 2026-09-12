<script lang="ts" setup>
import type {PostCardItem} from '#shared/types/content'

const props = defineProps<{
    posts: PostCardItem[]
}>()

const {t, locale} = useI18n()
const localePath = useLocalePath()

const rows = computed(() =>
    props.posts.map((post, index) => ({
        ...post,
        index: String(index + 1).padStart(2, '0'),
        formattedDate: formatPostDate(post.date, locale.value),
    })),
)
</script>

<template>
    <section class="container-page py-14 lg:py-20">
        <HomeSectionLabel :label="t('home.sections.writing')"/>

        <ol v-if="rows.length" class="mt-8">
            <li
                    v-for="(post, index) in rows"
                    :key="post.path"
                    v-reveal="index * 70"
                    class="reveal border-t border-default last:border-b"
            >
                <NuxtLink
                        :to="post.path"
                        class="group flex items-baseline gap-4 py-5 lg:gap-8"
                >
                    <span class="font-mono text-xs text-dimmed tabular-nums">{{ post.index }}</span>
                    <span class="min-w-0 flex-1">
                        <span class="block text-lg font-bold text-highlighted transition-colors group-hover:text-primary sm:text-xl lg:text-2xl">
                            {{ post.title }}
                        </span>
                        <span
                                v-if="post.description"
                                class="mt-1 block truncate text-sm text-muted"
                        >
                            {{ post.description }}
                        </span>
                    </span>
                    <time
                            :datetime="post.date"
                            class="shrink-0 font-mono text-xs text-muted"
                    >
                        {{ post.formattedDate }}
                    </time>
                </NuxtLink>
            </li>
        </ol>

        <p v-else class="mt-8 text-sm text-muted">{{ t('blog.empty') }}</p>

        <div class="mt-8">
            <UButton
                    :padded="false"
                    :to="localePath('/articles')"
                    trailing-icon="i-lucide-arrow-right"
                    variant="link"
            >
                {{ t('home.writing.viewAll') }}
            </UButton>
        </div>
    </section>
</template>
