import type {TocLinkLike} from './content'

export interface NovelDocument {
    path: string
    title: string
    description?: string
    body?: {
        value?: unknown
        toc?: { links: TocLinkLike[] }
    }
    date: string
    updated?: string
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

export interface NovelCardItem {
    path: string
    title: string
    description?: string
    date: string
    updated?: string
    subtype?: string
    status?: string
    tags?: string[]
    series?: string
    seriesOrder?: number
    cover?: string
    coverAlt?: string
    featured?: boolean
}
