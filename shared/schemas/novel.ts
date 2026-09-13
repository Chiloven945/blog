import {z} from 'zod'
import {licenseKeys} from '../config/licenses'
import {novelSubtypeKeys} from '../config/novel-subtypes'
import {novelStatusKeys} from '../config/statuses'

export const novelSchema = z.object({
    date: z.string(),
    updated: z.string().optional(),

    subtype: z.enum(novelSubtypeKeys),
    status: z.enum(novelStatusKeys).default('complete'),

    tags: z.array(z.string()).default([]),

    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),

    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    license: z.enum(licenseKeys).default('all-rights-reserved'),
    comments: z.boolean().default(true),
    toc: z.boolean().default(false),
    featured: z.boolean().default(false),
})

export type NovelFrontmatter = z.input<typeof novelSchema>
