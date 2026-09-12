// Transitional kind display config. Kind is determined by the collection
// (articles vs novels); this only supplies the shared icon/card variant until
// the dedicated Article and Novel readers replace the unified post UI.
export const kinds = {
    article: {
        labelKey: 'blog.type.article',
        icon: 'i-lucide-file-text',
        card: 'editorial'
    },
    novel: {
        labelKey: 'blog.type.novel',
        icon: 'i-lucide-book-open',
        card: 'literary'
    },
} as const

export type Kind = keyof typeof kinds

export const kindKeys = Object.keys(kinds) as [Kind, ...Kind[]]
