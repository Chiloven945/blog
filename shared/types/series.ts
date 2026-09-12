export interface SeriesDocument {
    path: string
    title: string
    description?: string
    body?: { value?: unknown }
    kind?: string
    status?: string
    cover?: string
    coverAlt?: string
    tags?: string[]
    startDate?: string
    endDate?: string
    featured?: boolean
}
