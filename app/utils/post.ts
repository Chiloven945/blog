import {type Kind, kinds} from '~~/shared/config/kinds'

const skipTags = new Set(['pre', 'style', 'script'])

function collectText(node: unknown): string {
    if (typeof node === 'string') {
        return node
    }

    if (!Array.isArray(node) || node.length < 2) {
        return ''
    }

    const [tag, , ...children] = node as [string, unknown, ...unknown[]]

    if (skipTags.has(tag)) {
        return ''
    }

    return children.map(child => collectText(child)).join(' ')
}

export function extractPostText(
    body: { value?: unknown } | null | undefined
): string {
    const value = body?.value

    if (!Array.isArray(value)) {
        return ''
    }

    return value.map(node => collectText(node)).join(' ')
}

const cjkPattern = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/g
const wordPattern = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g

export function estimateReadingTime(text: string): number {
    const cjkCount = (text.match(cjkPattern) ?? []).length
    const wordCount = (text.replace(cjkPattern, ' ').match(wordPattern) ?? []).length

    return Math.max(1, Math.ceil(cjkCount / 300 + wordCount / 200))
}

export function getReadingTime(
    body: { value?: unknown } | null | undefined
): number {
    return estimateReadingTime(extractPostText(body))
}

export function resolveKind(kind: string) {
    return kinds[kind as Kind] ?? kinds.article
}
