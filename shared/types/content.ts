import {z} from 'zod'
import type {Kind} from '../config/kinds'

export interface TocLinkLike {
    id: string
    text: string
    depth: number
    children?: TocLinkLike[]
}

/** Unified list item shape used by the transitional merged listings. */
export interface PostCardItem {
    path: string
    title: string
    description?: string
    date: string
    kind: Kind
    subtype?: string
    status?: string
    tags?: string[]
    cover?: string
    coverAlt?: string
}

/** Unified document shape used by the transitional unified reader. */
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
    kind: Kind
    subtype?: string
    status?: string
    tags?: string[]
    series?: string
    seriesOrder?: number
    cover?: string
    coverAlt?: string
    license?: string
    comments?: boolean
    toc?: boolean
    featured?: boolean
}

export const pageNavigationSchema = z.union([
    z.boolean(),
    z.object({
        title: z.string().optional(),
        icon: z.string().optional(),
        order: z.number().default(50),
    }),
])

export const pageSchema = z.object({
    navigation: pageNavigationSchema.optional(),

    cover: z.string().optional(),
    coverAlt: z.string().optional(),
})

export interface CustomPageNavigation {
    title?: string
    icon?: string
    order?: number
}

export interface CustomPageDocument {
    path: string
    title: string
    description?: string
    body?: { value?: unknown }
    navigation?: boolean | CustomPageNavigation
    cover?: string
    coverAlt?: string
}

export const homeSchema = z.object({
    hero: z.object({
        eyebrow: z.string(),
        title: z.array(z.string()).min(1),
        number: z.string(),
        description: z.string(),
    }),

    identity: z
        .object({
            roles: z.array(z.string()).default([]),
            statement: z.string().default(''),
            bio: z.string().default(''),
            facts: z
                .array(
                    z.object({
                        label: z.string(),
                        value: z.string(),
                    }),
                )
                .default([]),
            notes: z
                .array(
                    z.object({
                        id: z.string(),
                        text: z.string(),
                    }),
                )
                .default([]),
        })
        .default({}),

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
