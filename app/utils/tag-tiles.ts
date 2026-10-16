/**
 * Count → brick sizing for the tags mosaic. The same tiers drive the
 * stratified shuffle so large bricks spread across the grid.
 */

const spanByTier = [
    'col-span-2 row-span-2',
    'col-span-2',
    'col-span-1',
    'col-span-1',
] as const

const labelByTier = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg'] as const

const surfaceByTier = ['tag-block--large', 'tag-block--medium', '', ''] as const

/** Size tiers ordered largest → smallest. */
export function tagTier(count: number): number {
    if (count >= 8) {
        return 0
    }
    if (count >= 4) {
        return 1
    }
    if (count >= 2) {
        return 2
    }
    return 3
}

export const tagTierCount = spanByTier.length

export function tagSpanClass(count: number): string {
    return spanByTier[tagTier(count)] ?? 'col-span-1'
}

export function tagLabelClass(count: number): string {
    return labelByTier[tagTier(count)] ?? 'text-lg'
}

export function tagSurfaceClass(count: number): string {
    return surfaceByTier[tagTier(count)] ?? ''
}
