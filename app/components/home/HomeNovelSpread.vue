<script lang="ts" setup>
import type {NovelCardItem} from '#shared/types/novel'
import {resolveNovelStatus, resolveNovelSubtype} from '~/utils/novel'

const props = defineProps<{
    novels: NovelCardItem[]
}>()

const {t, locale} = useI18n()
const localePath = useLocalePath()

const lead = computed(() => props.novels[0] ?? null)
const rest = computed(() => props.novels.slice(1))

function subtypeLabel(item: NovelCardItem): string {
    const subtype = resolveNovelSubtype(item.subtype)
    return subtype
        ? t(subtype.labelKey)
        : t('novels.kind')
}

function statusLabel(item: NovelCardItem): string {
    return t(resolveNovelStatus(item.status).labelKey)
}

function date(item: NovelCardItem): string {
    return formatPostDate(item.date, locale.value)
}
</script>

<template>
    <section
            id="fiction"
            class="home-paper border-b border-default"
    >
        <div class="container-page py-14 lg:py-20">
            <div
                    v-reveal
                    class="reveal flex items-end justify-between gap-4 border-b border-default pb-3"
            >
                <h2 class="font-display-serif text-2xl font-bold text-highlighted lg:text-3xl">
                    FICTION</h2>
                <NuxtLink
                        :to="localePath('/novels')"
                        class="link tap-target text-sm"
                >
                    ALL FICTION →
                </NuxtLink>
            </div>

            <article
                    v-if="lead"
                    v-reveal
                    class="reveal mt-8 border-t border-default pt-8"
            >
                <NuxtLink
                        :to="lead.path"
                        class="group block"
                >
                    <p class="home-kicker text-primary">{{ subtypeLabel(lead) }} · {{
                            statusLabel(lead)
                        }}</p>
                    <h3 class="mt-3 font-display-serif text-3xl leading-tight font-bold text-highlighted transition-colors group-hover:text-primary lg:text-5xl">
                        {{ lead.title }}
                    </h3>
                    <p
                            v-if="lead.description"
                            class="mt-5 line-clamp-4 max-w-2xl font-display-serif text-lg/relaxed text-toned"
                    >
                        {{ lead.description }}
                    </p>
                    <div class="mt-5 flex items-center gap-4 font-mono text-xs text-dimmed">
                        <time>{{ date(lead) }}</time>
                        <span v-if="lead.series">{{ lead.series }}</span>
                    </div>
                </NuxtLink>
            </article>

            <div
                    v-if="rest.length"
                    class="mt-10 grid gap-8 sm:grid-cols-2"
            >
                <article
                        v-for="(novel, index) in rest"
                        :key="novel.path"
                        v-reveal="index * 80"
                        class="reveal border-l-4 border-primary pl-5"
                >
                    <NuxtLink
                            :to="novel.path"
                            class="group block"
                    >
                        <p class="home-kicker text-muted">{{ subtypeLabel(novel) }} · {{
                                statusLabel(novel)
                            }}</p>
                        <h3 class="mt-2 font-display-serif text-xl font-bold text-highlighted transition-colors group-hover:text-primary lg:text-2xl">
                            {{ novel.title }}
                        </h3>
                        <p
                                v-if="novel.description"
                                class="mt-2 line-clamp-3 font-display-serif text-sm/relaxed text-muted"
                        >
                            {{ novel.description }}
                        </p>
                        <time class="mt-3 block font-mono text-xs text-dimmed">{{
                                date(novel)
                            }}
                        </time>
                    </NuxtLink>
                </article>
            </div>

            <p
                    v-if="!lead"
                    class="mt-8 font-display-serif text-sm text-muted"
            >
                {{ t('novels.empty') }}
            </p>
        </div>
    </section>
</template>
