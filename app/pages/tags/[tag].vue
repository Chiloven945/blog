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
const entries = computed(() => tagEntries(key.value))

if (!tag.value) {
    throw createError({
        statusCode: 404,
        statusMessage: t('error.tagNotFound'),
    })
}

usePageMeta({
    title: () => tag.value
        ? `#${tag.value.label}`
        : t('tags.title'),
    description: () => t('tags.description'),
})
</script>

<template>
    <div v-if="tag" class="container-page py-10 lg:py-14">
        <header class="border-b border-default pb-8">
            <NuxtLink
                    :to="localePath('/tags')"
                    class="focus-ring rounded-xs font-mono text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-primary"
            >
                {{ t('tags.backToTags') }}
            </NuxtLink>

            <h1 class="mt-4 font-display-sans text-4xl font-bold tracking-tight wrap-break-word text-highlighted">
                #{{ tag.label }}
            </h1>

            <p class="mt-3 font-mono text-sm text-muted">
                {{ t('tags.entries', {count: tag.count}) }}
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
    </div>
</template>
