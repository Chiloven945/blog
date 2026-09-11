export const postTypes = {
    article: {
        labelKey: 'blog.type.article',
        icon: 'i-lucide-file-text',
        card: 'editorial',
        tocDefault: true,
    },

    novel: {
        labelKey: 'blog.type.novel',
        icon: 'i-lucide-book-open',
        card: 'literary',
        tocDefault: false,
    },
} as const

export type PostType = keyof typeof postTypes

export type PostCardVariant = (typeof postTypes)[PostType]['card']
