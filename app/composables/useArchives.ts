import type {Kind} from '#shared/config/kinds'
import {parseDate} from '~/utils/date'
import {resolveDateLocale} from '~/utils/locale'

export interface ArchivePost {
    path: string
    title: string
    date: string
    day: number
    kind: Kind
    subtype?: string
}

export interface ArchiveMonthGroup {
    key: string
    month: number
    label: string
    posts: ArchivePost[]
}

export interface ArchiveYearGroup {
    year: number
    months: ArchiveMonthGroup[]
}

function monthLabel(
    year: number,
    month: number,
    locale: string
): string {
    return new Intl.DateTimeFormat(resolveDateLocale(locale), {
        month: 'short',
        timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month, 1)))
}

export function groupArchives(
    posts: ArchivePost[],
    locale: string
): ArchiveYearGroup[] {
    const years = new Map<number, Map<number, ArchivePost[]>>()

    for (const post of posts) {
        const date = parseDate(post.date)

        if (Number.isNaN(date.getTime())) {
            continue
        }

        const year = date.getUTCFullYear()
        const month = date.getUTCMonth()

        if (!years.has(year)) {
            years.set(year, new Map())
        }

        const months = years.get(year)!

        if (!months.has(month)) {
            months.set(month, [])
        }

        months.get(month)!.push(post)
    }

    return [...years.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([year, months]) => (
            {
                year,
                months: [...months.entries()]
                    .sort((a, b) => b[0] - a[0])
                    .map(([month, items]) => (
                        {
                            key: `${year}-${month}`,
                            month,
                            label: monthLabel(year, month, locale),
                            posts: items
                                .slice()
                                .sort((a, b) =>
                                    parseDate(b.date).getTime() - parseDate(a.date).getTime()
                                ),
                        }
                    )),
            }
        ))
}

export async function useArchives() {
    const {locale} = useI18n()
    const active = useActiveContentCollection()
    const key = computed(() =>
        `${active.value.articles}-${active.value.novels}-${locale.value}`)

    const {data} = await useAsyncData(
        () => `archives-${key.value}`,
        async () => {
            const [articles, novels] = await Promise.all([
                applyPublicStatus(
                    queryCollection(active.value.articles)
                        .select('path', 'title', 'date', 'subtype', 'status')
                )
                    .order('date', 'DESC')
                    .all(),
                applyPublicStatus(
                    queryCollection(active.value.novels)
                        .select('path', 'title', 'date', 'subtype', 'status')
                )
                    .order('date', 'DESC')
                    .all(),
            ])

            return [
                ...articles.map(item => (
                    {...item, kind: 'article' as const}
                )),
                ...novels.map(item => (
                    {...item, kind: 'novel' as const}
                )),
            ]
        },
    )

    const posts = computed<ArchivePost[]>(() =>
        (data.value ?? [])
            .map(post => (
                {
                    path: post.path,
                    title: post.title,
                    date: post.date,
                    day: parseDate(post.date).getUTCDate(),
                    kind: post.kind,
                    subtype: post.subtype,
                }
            )),
    )

    const years = computed(() =>
        groupArchives(posts.value, locale.value))

    return {posts, years}
}
