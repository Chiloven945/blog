import {normalizeTagKey} from '#shared/utils/taxonomy'

export interface RelatedCandidate {
    path: string
    title: string
    description?: string
    date: string
    subtype?: string
    status?: string
    tags?: string[]
    series?: string
    cover?: string
    coverAlt?: string
    featured?: boolean
}

function year(date: string): number | null {
    const parsed = new Date(date)

    return Number.isNaN(parsed.getTime())
        ? null
        : parsed.getUTCFullYear()
}

/** Deterministic closeness score: series > tags > subtype > recency. */
export function scoreRelated(current: RelatedCandidate, candidate: RelatedCandidate): number {
    let score = 0

    if (current.series && candidate.series && current.series === candidate.series) {
        score += 1000
    }

    const currentTags = new Set((current.tags ?? []).map(normalizeTagKey))

    for (const tag of candidate.tags ?? []) {
        if (currentTags.has(normalizeTagKey(tag))) {
            score += 80
        }
    }

    if (current.subtype && candidate.subtype === current.subtype) {
        score += 40
    }

    const currentYear = year(current.date)
    const candidateYear = year(candidate.date)

    if (currentYear !== null && candidateYear !== null) {
        const distance = Math.abs(currentYear - candidateYear)

        if (distance === 0) {
            score += 20
        } else if (distance === 1) {
            score += 10
        }
    }

    if (candidate.featured) {
        score += 10
    }

    return score
}

/** Rank same-kind candidates for `current`, excluding itself and drafts. */
export function rankRelated<T extends RelatedCandidate>(
    current: RelatedCandidate,
    candidates: T[],
    limit = 3,
): T[] {
    return candidates
        .filter(candidate => candidate.path !== current.path && candidate.status !== 'draft')
        .map(candidate => ({candidate, score: scoreRelated(current, candidate)}))
        .sort((a, b) =>
            b.score - a.score
            || (b.candidate.date ?? '').localeCompare(a.candidate.date ?? '')
            || a.candidate.path.localeCompare(b.candidate.path))
        .slice(0, limit)
        .map(entry => entry.candidate)
}
