export const articleStatuses = {
    draft: {labelKey: 'article.status.draft', hidden: true},
    published: {labelKey: 'article.status.published'},
    wip: {labelKey: 'article.status.wip'},
    deprecated: {labelKey: 'article.status.deprecated'},
    archived: {labelKey: 'article.status.archived'},
} as const

export type ArticleStatus = keyof typeof articleStatuses

export const articleStatusKeys = Object.keys(articleStatuses) as [ArticleStatus, ...ArticleStatus[]]

export const novelStatuses = {
    draft: {labelKey: 'novel.status.draft', hidden: true},
    wip: {labelKey: 'novel.status.wip'},
    complete: {labelKey: 'novel.status.complete'},
    paused: {labelKey: 'novel.status.paused'},
    abandoned: {labelKey: 'novel.status.abandoned'},
} as const

export type NovelStatus = keyof typeof novelStatuses

export const novelStatusKeys = Object.keys(novelStatuses) as [NovelStatus, ...NovelStatus[]]

export const seriesStatuses = {
    planned: {labelKey: 'series.status.planned'},
    ongoing: {labelKey: 'series.status.ongoing'},
    complete: {labelKey: 'series.status.complete'},
    paused: {labelKey: 'series.status.paused'},
    abandoned: {labelKey: 'series.status.abandoned'},
} as const

export type SeriesStatus = keyof typeof seriesStatuses

export const seriesStatusKeys = Object.keys(seriesStatuses) as [SeriesStatus, ...SeriesStatus[]]
