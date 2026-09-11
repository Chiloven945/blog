<script lang="ts" setup>
import type {PostDocument} from '#shared/types/content'

const props = defineProps<{
    post: PostDocument
    readingTime: number
}>()

const {t, locale} = useI18n()

const typeConfig = computed(() => resolvePostType(props.post.type ?? 'article'))
const categories = computed(() => props.post.categories ?? [])
const tags = computed(() => props.post.tags ?? [])
const published = computed(() => formatPostDate(props.post.date, locale.value))
const updated = computed(() =>
    props.post.updated
        ? formatPostDate(props.post.updated, locale.value)
        : null,
)
</script>

<template>
    <header>
        <UBadge
                :icon="typeConfig.icon"
                :label="t(typeConfig.labelKey)"
                color="neutral"
                variant="outline"
        />

        <h1 class="mt-5 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
            {{ post.title }}
        </h1>

        <p v-if="post.description" class="mt-4 text-lg text-muted">
            {{ post.description }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <time :datetime="post.date">{{ published }}</time>

            <template v-if="updated">
                <span aria-hidden="true">·</span>
                <span>{{ t('post.updated') }} {{ updated }}</span>
            </template>

            <span aria-hidden="true">·</span>
            <span>{{ t('post.readingTime', {minutes: readingTime}) }}</span>
        </div>

        <div v-if="categories.length" class="mt-5 flex flex-wrap gap-2">
            <UBadge
                    v-for="category in categories"
                    :key="category"
                    :label="category"
                    color="primary"
                    variant="subtle"
            />
        </div>

        <div v-if="tags.length" class="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <span v-for="tag in tags" :key="tag">#{{ tag }}</span>
        </div>
    </header>
</template>
