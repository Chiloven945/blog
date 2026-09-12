<script lang="ts" setup>
import type {HomeData} from '#shared/types/content'

const props = defineProps<{
    now: NonNullable<HomeData['now']>
}>()

const {t} = useI18n()

const keys = ['building', 'learning', 'reading', 'listening'] as const

const rows = computed(() =>
    keys
        .map(key => ({key, label: t(`home.now.${key}`), value: props.now[key]}))
        .filter(row => Boolean(row.value)),
)
</script>

<template>
    <section class="container-page py-14 lg:py-20">
        <HomeSectionLabel :label="$t('home.sections.now')"/>

        <dl class="mt-8 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
            <div
                    v-for="row in rows"
                    :key="row.key"
                    class="flex items-baseline justify-between gap-6 border-t border-default py-4"
            >
                <dt class="font-mono text-xs tracking-[0.25em] text-muted uppercase">{{
                        row.label
                    }}
                </dt>
                <dd class="max-w-xs text-right text-sm text-default">{{ row.value }}</dd>
            </div>
        </dl>
    </section>
</template>
