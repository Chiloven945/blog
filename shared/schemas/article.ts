import {z} from 'zod'
import {articleSubtypeKeys} from '../config/article-subtypes'
import {licenseKeys} from '../config/licenses'
import {articleStatusKeys} from '../config/statuses'

export const sourceSchema = z.object({
    title: z.string().optional(),
    url: z.string().url().optional(),
    authors: z.array(z.string()).default([]),
    note: z.string().optional(),
})

export const articleSchema = z.object({
    date: z.string(),
    updated: z.string().optional(),

    subtype: z.enum(articleSubtypeKeys),
    status: z.enum(articleStatusKeys).default('published'),

    tags: z.array(z.string()).default([]),

    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),

    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    source: sourceSchema.optional(),

    license: z.enum(licenseKeys).default('cc-by-nc-sa-4.0'),
    comments: z.boolean().default(true),
    toc: z.boolean().default(true),
    featured: z.boolean().default(false),
})

export type ArticleFrontmatter = z.input<typeof articleSchema>
