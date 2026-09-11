import {type PostType, postTypes} from '~~/shared/config/post-types'
import {parseDate} from './date'

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

export function extractPostText(body: { value?: unknown } | null | undefined): string {
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

export function getReadingTime(body: { value?: unknown } | null | undefined): number {
    return estimateReadingTime(extractPostText(body))
}

export function resolvePostType(type: string) {
    return postTypes[type as PostType] ?? postTypes.article
}

export interface PostSurroundItem {
    title: string
    path: string
}

export interface PostSurroundResult {
    prev: PostSurroundItem | null
    next: PostSurroundItem | null
}

export function getPostSurround(
    posts: Array<{ path: string; title: string; date: string }>,
    currentPath: string,
): PostSurroundResult {
    const ordered = [...posts].sort((a, b) => {
        const diff = parseDate(a.date).getTime() - parseDate(b.date).getTime()
        return diff !== 0 ? diff : a.path.localeCompare(b.path)
    })

    const index = ordered.findIndex(post => post.path === currentPath)

    if (index === -1) {
        return {prev: null, next: null}
    }

    const prev = ordered[index - 1]
    const next = ordered[index + 1]

    return {
        prev: prev ? {title: prev.title, path: prev.path} : null,
        next: next ? {title: next.title, path: next.path} : null,
    }
}
