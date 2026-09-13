import {z} from 'zod'

export const linkItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    url: z.string(),

    icon: z.string().optional(),
    image: z.string().optional(),

    featured: z.boolean().default(false),
    order: z.number().default(0),

    description: z.record(z.string(), z.string()).default({}),
})

export type LinkItem = z.infer<typeof linkItemSchema>

export const linksSchema = z.object({
    items: z.array(linkItemSchema).default([]),
})

export type LinksData = z.infer<typeof linksSchema>
