<script lang="ts" setup>
import type {ArticleCardItem} from '#shared/types/article'
import {resolveArticleSubtype} from '~/utils/article'

const props = defineProps<{
    articles: ArticleCardItem[]
}>()

const {t, locale} = useI18n()
const localePath = useLocalePath()

const lead = computed(() => props.articles[0] ?? null)
const rest = computed(() => props.articles.slice(1))

function subtypeLabel(item: ArticleCardItem): string {
    const subtype = resolveArticleSubtype(item.subtype)
    return subtype
        ? t(subtype.labelKey)
        : t('articles.kind')
}

function date(item: ArticleCardItem): string {
    return formatPostDate(item.date, locale.value)
}

function pad(value: number): string {
    return String(value).padStart(2, '0')
}
</script>

<template>
    <section
            id="writing"
            class="border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div
                    v-reveal
                    class="reveal flex items-end justify-between gap-4 border-b border-default pb-3"
            >
                <h2 class="home-kicker text-muted">ARTICLES / LATEST</h2>
                <NuxtLink
                        :to="localePath('/articles')"
                        class="link tap-target text-sm"
                >
                    ALL ARTICLES →
                </NuxtLink>
            </div>

            <div
                    v-if="lead"
                    class="mt-8 grid gap-8 md:grid-cols-12 md:gap-10 lg:grid-cols-12 lg:gap-10"
            >
                <NuxtLink
                        v-reveal
                        :to="lead.path"
                        class="reveal group col-span-1 border-t-2 border-primary pt-4 md:col-span-7 lg:col-span-7"
                >
                    <span class="home-kicker text-dimmed">01 / {{ subtypeLabel(lead) }}</span>
                    <h3 class="mt-3 font-display-sans text-2xl font-bold text-highlighted transition-colors group-hover:text-primary lg:text-4xl">
                        {{ lead.title }}
                    </h3>
                    <p
                            v-if="lead.description"
                            class="mt-3 line-clamp-3 max-w-2xl text-sm/6 text-toned"
                    >
                        {{ lead.description }}
                    </p>

                    <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
                        <time>{{ date(lead) }}</time>
                        <span
                                v-for="tag in lead.tags?.slice(0, 3)"
                                :key="tag"
                                class="text-primary"
                        >#{{ tag }}</span>
                    </div>

                    <NuxtImg
                            v-if="lead.cover"
                            :alt="lead.coverAlt || lead.title"
                            :src="lead.cover"
                            class="mt-6 aspect-[16/9] w-full rounded-sm border border-default object-cover"
                            format="webp"
                            height="360"
                            loading="lazy"
                            width="640"
                    />
                </NuxtLink>

                <div class="col-span-1 flex flex-col md:col-span-5 lg:col-span-5">
                    <NuxtLink
                            v-for="(article, index) in rest"
                            :key="article.path"
                            v-reveal="index * 70"
                            :to="article.path"
                            class="reveal group grid grid-cols-[2rem_1fr] gap-4 border-t border-default py-5"
                    >
                        <span class="home-kicker text-dimmed tabular-nums">{{
                                pad(index + 2)
                            }}</span>
                        <div class="min-w-0">
                            <p class="home-kicker text-primary">{{ subtypeLabel(article) }}</p>
                            <h3 class="mt-2 text-lg leading-snug font-bold text-highlighted transition-colors group-hover:text-primary">
                                {{ article.title }}
                            </h3>
                            <p
                                    v-if="article.description"
                                    class="mt-1 line-clamp-2 text-sm text-muted"
                            >
                                {{ article.description }}
                            </p>
                            <time class="mt-2 block font-mono text-xs text-dimmed">{{
                                    date(article)
                                }}
                            </time>
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <p
                    v-else
                    class="mt-8 font-mono text-sm text-muted"
            >
                {{ t('home.noArticles') }}
            </p>
        </div>
    </section>
</template>
