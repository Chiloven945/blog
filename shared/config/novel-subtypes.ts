export const novelSubtypes = {
    'short-story': {labelKey: 'novel.subtype.shortStory'},
    vignette: {labelKey: 'novel.subtype.vignette'},
    novella: {labelKey: 'novel.subtype.novella'},
    serial: {labelKey: 'novel.subtype.serial'},
    prose: {labelKey: 'novel.subtype.prose'},
    fragment: {labelKey: 'novel.subtype.fragment'},
} as const

export type NovelSubtype = keyof typeof novelSubtypes

export const novelSubtypeKeys = Object.keys(novelSubtypes) as [NovelSubtype, ...NovelSubtype[]]
