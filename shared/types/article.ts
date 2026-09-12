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
    categories?: string[]
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

export interface ArticleCardItem {
    path: string
    title: string
    description?: string
    date: string
    subtype?: string
    status?: string
    categories?: string[]
    tags?: string[]
    cover?: string
    coverAlt?: string
}
