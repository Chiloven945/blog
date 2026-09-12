export const articleSubtypes = {
    note: {labelKey: 'article.subtype.note'},
    essay: {labelKey: 'article.subtype.essay'},
    journal: {labelKey: 'article.subtype.journal'},
    documentation: {labelKey: 'article.subtype.documentation'},
    tutorial: {labelKey: 'article.subtype.tutorial'},
    translation: {labelKey: 'article.subtype.translation'},
    reference: {labelKey: 'article.subtype.reference'},
    experiment: {labelKey: 'article.subtype.experiment'},
} as const

export type ArticleSubtype = keyof typeof articleSubtypes

export const articleSubtypeKeys = Object.keys(articleSubtypes) as [
    ArticleSubtype,
    ...ArticleSubtype[],
]
