import {z} from 'zod'

const noteId = z.string()

export const profileSchema = z.object({
    meta: z
        .object({
            description: z.string().default(''),
        })
        .default({}),

    motto: z.string(),

    names: z
        .array(
            z.object({
                primary: z.string(),
                middle: z.string().optional(),
                suffix: z.string().optional(),
                pronunciation: z.string().optional(),
                note: noteId.optional(),
            }),
        )
        .default([]),

    facts: z
        .array(
            z.object({
                icon: z.string().optional(),
                text: z.string(),
            }),
        )
        .default([]),

    languages: z
        .array(
            z.object({
                name: z.string(),
                level: z.string(),
            }),
        )
        .default([]),

    interests: z
        .array(
            z.object({
                icon: z.string().optional(),
                text: z.string(),
            }),
        )
        .default([]),

    trying: z
        .array(
            z.object({
                icon: z.string().optional(),
                text: z.string(),
                note: noteId.optional(),
                struck: z.boolean().default(false),
            }),
        )
        .default([]),

    stats: z
        .array(
            z.object({
                id: z.string(),
                label: z.string(),
                image: z.string(),
                url: z.string(),
            }),
        )
        .default([]),

    skills: z
        .object({
            description: z.string().default(''),
            image: z.string().default(''),
        })
        .default({}),

    notes: z.record(z.string(), z.string()).default({}),
})

export type ProfileData = z.infer<typeof profileSchema>
