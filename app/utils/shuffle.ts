/** Deterministic 32-bit string hash (FNV-1a). */
export function hashString(value: string): number {
    let hash = 2166136261

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index)
        hash = Math.imul(hash, 16777619)
    }

    return hash >>> 0
}

/** Fast seeded PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
    let state = seed >>> 0

    return () => {
        state = (state + 0x6d2b79f5) >>> 0
        let t = state
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** Deterministic Fisher–Yates shuffle. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
    const random = mulberry32(seed)
    const result = items.slice()

    for (let index = result.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(random() * (index + 1))
        const current = result[index] as T
        result[index] = result[swap] as T
        result[swap] = current
    }

    return result
}

/**
 * Shuffle inside each tier, then interleave the tiers round-robin so larger
 * bricks are distributed instead of clustering. Deterministic for a given
 * seed, so server render and hydration agree.
 */
export function stratifiedShuffle<T>(
    items: readonly T[],
    tierOf: (item: T) => number,
    tierCount: number,
    seed: number,
): T[] {
    const tiers: T[][] = Array.from({length: tierCount}, () => [])

    for (const item of items) {
        const tier = Math.min(Math.max(tierOf(item), 0), tierCount - 1)
        tiers[tier]?.push(item)
    }

    const shuffled = tiers.map((group, index) =>
        seededShuffle(group, seed + index * 0x9e3779b9))
    const longest = shuffled.reduce(
        (max, group) =>
            Math.max(max, group.length), 0
    )
    const result: T[] = []

    for (let position = 0; position < longest; position += 1) {
        for (const group of shuffled) {
            const item = group[position]

            if (item !== undefined) {
                result.push(item)
            }
        }
    }

    return result
}
