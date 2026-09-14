// Kind metadata for cross-kind pages (search, archives). Kind is determined
// by the collection (articles vs novels); this only supplies the shared
// label and icon, and never chooses a card renderer.
export const kinds = {
    article: {
        labelKey: 'blog.type.article',
        icon: 'i-lucide-file-text',
    },
    novel: {
        labelKey: 'blog.type.novel',
        icon: 'i-lucide-book-open',
    },
} as const

export type Kind = keyof typeof kinds

export const kindKeys = Object.keys(kinds) as [Kind, ...Kind[]]
