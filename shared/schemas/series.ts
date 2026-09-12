import {z} from 'zod'
import {kindKeys} from '../config/kinds'
import {seriesStatusKeys} from '../config/statuses'

export const seriesSchema = z.object({
    kind: z.enum(kindKeys),
    status: z.enum(seriesStatusKeys).default('ongoing'),

    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),

    startDate: z.string().optional(),
    endDate: z.string().optional(),
    featured: z.boolean().default(false),
})

export type SeriesFrontmatter = z.input<typeof seriesSchema>
