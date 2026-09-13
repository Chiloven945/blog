/**
 * Tag keys are normalized for stable URLs and comparison, while the
 * original label keeps its own casing.
 */
export function normalizeTaxonomyKey(value: string): string {
    return value
        .normalize('NFKC')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
}

export const normalizeTagKey = normalizeTaxonomyKey

/** Percent-encode one taxonomy path segment (CJK safe). */
export function encodeTaxonomyPath(segment: string): string {
    return encodeURIComponent(segment)
}

export function tagPath(tag: string): string {
    return `/tags/${encodeTaxonomyPath(normalizeTagKey(tag))}`
}

/** Normalize a (already router-decoded) taxonomy route parameter. */
export function decodeTaxonomyParam(param: string): string {
    try {
        return normalizeTaxonomyKey(decodeURIComponent(param))
    } catch {
        return normalizeTaxonomyKey(param)
    }
}
