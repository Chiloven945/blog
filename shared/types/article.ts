import type {TocLinkLike} from './content'

export interface ArticleDocument {
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
    source?: ArticleSource
    license?: string
    comments?: boolean
    toc?: boolean
    featured?: boolean
}

export interface ArticleSource {
    title?: string
    url?: string
    authors?: string[]
    note?: string
}

export interface ArticleCardItem {
    path: string
    title: string
    description?: string
    date: string
    updated?: string
    subtype?: string
    status?: string
    tags?: string[]
    series?: string
    cover?: string
    coverAlt?: string
    featured?: boolean
}
