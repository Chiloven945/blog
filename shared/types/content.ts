import {z} from 'zod'

export const postSchema = z.object({
    date: z.string(),

    updated: z.string().optional(),

    type: z.string().min(1).default('article'),

    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    license: z.string().optional(),

    comments: z.boolean().default(true),
    toc: z.boolean().default(true),

    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
})

export type PostFrontmatter = z.input<typeof postSchema>

export interface TocLinkLike {
    id: string
    text: string
    depth: number
    children?: TocLinkLike[]
}

export interface PostDocument {
    path: string
    title: string
    description?: string
    body?: {
        value?: unknown
        toc?: { links: TocLinkLike[] }
    }
    date: string
    updated?: string
    type?: string
    categories?: string[]
    tags?: string[]
    cover?: string
    coverAlt?: string
    license?: string
    comments?: boolean
    toc?: boolean
    draft?: boolean
    featured?: boolean
}

export interface PostCardItem {
    path: string
    title: string
    description?: string
    date: string
    type?: string
    categories?: string[]
    tags?: string[]
    cover?: string
    coverAlt?: string
    draft?: boolean
}

export const homeSchema = z.object({
    hero: z.object({
        eyebrow: z.string(),
        title: z.array(z.string()).min(1),
        number: z.string(),
        description: z.string(),
    }),

    manifesto: z.object({
        title: z.string(),
        body: z.string(),
    }),

    interests: z.array(z.string()).default([]),

    now: z
        .object({
            building: z.string().optional(),
            learning: z.string().optional(),
            reading: z.string().optional(),
            listening: z.string().optional(),
        })
        .default({}),

    writing: z
        .object({
            limit: z.number().int().positive().default(3),
        })
        .default({}),
})

export type HomeData = z.infer<typeof homeSchema>

export const friendItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    avatar: z.string().optional(),

    description: z.record(z.string(), z.string()).optional(),

    order: z.number().default(0),
})

export type FriendItem = z.infer<typeof friendItemSchema>

export const friendsSchema = z.object({
    items: z.array(friendItemSchema).default([]),
})

export type FriendsData = z.infer<typeof friendsSchema>
