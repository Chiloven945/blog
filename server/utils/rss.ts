import {decompressTree} from '@nuxt/content/runtime'
import {queryCollection} from '@nuxt/content/server'
import {toHtml} from 'hast-util-to-html'
import type {H3Event} from 'h3'
import {siteConfig} from '../../shared/config/site'
import enMessages from '../../i18n/locales/en.json'
import zhCnMessages from '../../i18n/locales/zh-cn.json'
import zhTwMessages from '../../i18n/locales/zh-tw.json'

export type RssLocale = 'en' | 'zh-cn' | 'zh-tw'

interface RssLocaleConfig {
    articles: 'articlesEn' | 'articlesZhCn' | 'articlesZhTw'
    novels: 'novelsEn' | 'novelsZhCn' | 'novelsZhTw'
    language: string
    title: string
    description: string
}

const rssLocaleConfig: Record<RssLocale, RssLocaleConfig> = {
    en: {
        articles: 'articlesEn',
        novels: 'novelsEn',
        language: 'en',
        title: enMessages.site.title,
        description: enMessages.site.description,
    },
    'zh-cn': {
        articles: 'articlesZhCn',
        novels: 'novelsZhCn',
        language: 'zh-CN',
        title: zhCnMessages.site.title,
        description: zhCnMessages.site.description,
    },
    'zh-tw': {
        articles: 'articlesZhTw',
        novels: 'novelsZhTw',
        language: 'zh-TW',
        title: zhTwMessages.site.title,
        description: zhTwMessages.site.description,
    },
}

export const rssLocales = Object.keys(rssLocaleConfig) as RssLocale[]

interface RawPost {
    path: string
    title?: string
    description?: string
    date?: string
    status?: string
    subtype?: string
    kind?: 'article' | 'novel'
    body?: unknown
}

interface MinimarkElement {
    type: 'element'
    tag?: string
    props?: Record<string, unknown>
    children?: MinimarkNode[]
}

interface MinimarkText {
    type: 'text'
    value: string
}

type MinimarkNode = MinimarkElement | MinimarkText | { type: 'comment' }

interface StandardElement {
    type: 'element'
    tagName: string
    properties: Record<string, unknown>
    children: StandardNode[]
}

interface StandardText {
    type: 'text'
    value: string
}

type StandardNode = StandardElement | StandardText

const HTML_TAGS = new Set([
    'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'dd', 'del', 'div', 'dl',
    'dt', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
    'img', 'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre', 'q', 's', 'small', 'span',
    'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul',
])

const KEEP_PROPS = new Set([
    'align', 'alt', 'className', 'colSpan', 'height', 'href', 'id', 'loading', 'rowSpan',
    'sizes', 'src', 'srcSet', 'start', 'style', 'title', 'type', 'value', 'width',
])

function siteUrl() {
    return siteConfig.domain.replace(/\/+$/, '')
}

function absoluteUrl(url: string): string {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) {
        return url
    }

    return `${siteUrl()}${url.startsWith('/')
        ? url
        : `/${url}`}`
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

function cdata(value: string): string {
    return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

function elementNode(
    tagName: string,
    properties: Record<string, unknown>,
    children: StandardNode[]
): StandardElement {
    return {type: 'element', tagName, properties, children}
}

function textNode(value: string): StandardText {
    return {type: 'text', value}
}

function readProperties(node: MinimarkElement): Record<string, unknown> {
    const source = node.props ?? {}
    const properties: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(source)) {
        if (!KEEP_PROPS.has(key)
            || value === null
            || typeof value === 'object'
        ) {
            continue
        }

        if ((key === 'href' || key === 'src')
            && typeof value === 'string'
        ) {
            properties[key] = absoluteUrl(value)
            continue
        }

        properties[key] = value
    }

    return properties
}

function cleanNode(
    node: MinimarkNode | undefined | null
): StandardNode | StandardNode[] | null {
    if (!node || typeof node !== 'object') {
        return null
    }

    if (node.type === 'text') {
        return textNode(node.value)
    }

    if (node.type === 'comment') {
        return null
    }

    const tag = node.tag ?? ''

    if (tag === 'style' || tag === 'script') {
        return null
    }

    if (tag === 'link-card') {
        const props = node.props ?? {}
        const href = typeof props.href === 'string'
            ? props.href
            : ''

        if (!href) {
            return null
        }

        const label = typeof props.title === 'string'
            ? props.title
            : href

        return elementNode(
            'p',
            {},
            [elementNode('a', {href: absoluteUrl(href)}, [textNode(label)])]
        )
    }

    const children = (node.children ?? [])
        .map(child => cleanNode(child))
        .filter((child): child is StandardNode | StandardNode[] =>
            child !== null
        )
        .flat()

    if (HTML_TAGS.has(tag)) {
        return elementNode(tag, readProperties(node), children)
    }

    return children.length
        ? children
        : null
}

function renderBody(body: unknown): string {
    if (!body || typeof body !== 'object') {
        return ''
    }

    const tree = decompressTree(body as never)
    const cleaned = cleanNode(tree as unknown as MinimarkNode)

    if (!cleaned) {
        return ''
    }

    return toHtml(cleaned as never)
}

export async function buildRss(
    event: H3Event,
    locale: RssLocale
): Promise<string> {
    const config = rssLocaleConfig[locale]

    const [articles, novels] = await Promise.all([
        queryCollection(event, config.articles)
            .select('path', 'title', 'description', 'date', 'status', 'subtype', 'body')
            .order('date', 'DESC')
            .all(),
        queryCollection(event, config.novels)
            .select('path', 'title', 'description', 'date', 'status', 'subtype', 'body')
            .order('date', 'DESC')
            .all(),
    ])

    const posts = [
        ...articles.map(post => ({...post, kind: 'article' as const})),
        ...novels.map(post => ({...post, kind: 'novel' as const})),
    ].sort((a, b) => {
        const left = a.date ?? ''
        const right = b.date ?? ''
        return left < right
            ? 1
            : left > right
                ? -1
                : 0
    }) as unknown as RawPost[]

    const feedUrl = `${siteUrl()}/${locale}/rss.xml`
    const homeUrl = `${siteUrl()}/${locale}`

    const items = posts
        .filter(post => post.status !== 'draft')
        .map(post => {
            const url = `${siteUrl()}${post.path}`
            const pubDate = post.date
                ? new Date(post.date).toUTCString()
                : new Date().toUTCString()

            return [
                '<item>',
                `<title>${escapeXml(post.title ?? '')}</title>`,
                `<link>${escapeXml(url)}</link>`,
                `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
                `<pubDate>${pubDate}</pubDate>`,
                `<category>${post.kind === 'article'
                    ? 'Article'
                    : 'Novel'}</category>`,
                post.subtype
                    ? `<category>${escapeXml(post.subtype)}</category>`
                    : '',
                post.description
                    ? `<description>${escapeXml(post.description)}</description>`
                    : '',
                `<content:encoded>${cdata(renderBody(post.body))}</content:encoded>`,
                '</item>',
            ]
                .filter(Boolean)
                .join('')
        })
        .join('\n')

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
        '<channel>',
        `<title>${escapeXml(config.title)}</title>`,
        `<link>${homeUrl}</link>`,
        `<description>${escapeXml(config.description)}</description>`,
        `<language>${config.language}</language>`,
        `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
        `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
        items,
        '</channel>',
        '</rss>',
    ].join('\n')

    setResponseHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

    return xml
}
