<script lang="ts" setup>
import ArticleIndexRow from '~/components/article/ArticleIndexRow.vue'
import NovelCard from '~/components/novel/NovelCard.vue'
import {decodeTaxonomyParam} from '#shared/utils/taxonomy'

const route = useRoute()
const localePath = useLocalePath()
const {t} = useI18n()

const {tags, tagEntries} = await useTagIndex()

const key = computed(() => decodeTaxonomyParam(String(route.params.tag ?? '')))
const tag = computed(() => tags.value.find(item => item.key === key.value) ?? null)
const label = computed(() => tag.value?.label
    ?? decodeURIComponent(String(route.params.tag ?? '')))
const entries = computed(() => tagEntries(key.value))
const hasEntries = computed(() =>
    entries.value.articles.length > 0 || entries.value.novels.length > 0)

// A tag that only exists in opt-in NSFW content resolves here while the
// preference is off, so it renders an empty state instead of a hard 404 and
// must not be indexed.
usePageMeta({
    title: () => `#${label.value}`,
    description: () => t('tags.description'),
    robots: () => hasEntries.value
        ? undefined
        : 'noindex, nofollow, noarchive',
})
</script>

<template>
    <div>
        <header class="border-b border-default pb-8">
            <NuxtLink
                    :to="localePath('/tags')"
                    class="tap-target focus-ring rounded-xs font-mono text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-primary"
            >
                {{ t('tags.backToTags') }}
            </NuxtLink>

            <h1 class="mt-4 font-display-sans text-4xl font-bold tracking-tight wrap-break-word text-highlighted">
                #{{ label }}
            </h1>

            <p class="mt-3 font-mono text-sm text-muted">
                {{ t('tags.entries', {count: tag?.count ?? 0}) }}
            </p>
        </header>

        <section v-if="entries.articles.length" class="mt-12">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('tags.articles') }} / {{ entries.articles.length }}
            </p>

            <ol class="mt-4">
                <ArticleIndexRow
                        v-for="(article, index) in entries.articles"
                        :key="article.path"
                        :article="article"
                        :index="index"
                />
            </ol>
        </section>

        <section v-if="entries.novels.length" class="mt-14">
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('tags.novels') }} / {{ entries.novels.length }}
            </p>

            <div class="mt-4 border-t border-default">
                <NovelCard
                        v-for="novel in entries.novels"
                        :key="novel.path"
                        :novel="novel"
                />
            </div>
        </section>

        <div
                v-if="!hasEntries"
                class="mt-10 rounded-sm border border-dashed border-default px-6 py-16 text-center"
        >
            <p class="font-mono text-xs tracking-[0.3em] text-muted uppercase">
                {{ t('tags.emptyEyebrow') }}
            </p>
            <p class="mt-3 text-lg font-bold text-highlighted">{{ t('tags.empty') }}</p>
            <p class="mt-2 text-sm text-muted">{{ t('tags.emptyDescription') }}</p>
        </div>
    </div>
</template>
