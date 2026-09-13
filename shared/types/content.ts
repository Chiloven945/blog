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
