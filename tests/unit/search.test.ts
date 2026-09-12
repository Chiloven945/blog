import {describe, expect, it} from 'vitest'
import {
    buildSnippet,
    highlightSegments,
    scoreSearchSection,
    type SearchSection,
    searchSections,
    tokenizeSearchQuery,
} from '../../app/utils/search'

function section(partial: Partial<SearchSection>): SearchSection {
    return {
        id: partial.id ?? '/p/x',
        path: partial.path ?? '/p/x',
        title: partial.title ?? '',
        titles: partial.titles ?? [],
        level: partial.level ?? 2,
        content: partial.content ?? '',
        ...partial,
    }
}

describe('search tokenizing', () => {
    it('lowercases and splits on whitespace', () => {
        expect(tokenizeSearchQuery('  Java  Spring ')).toEqual(['java', 'spring'])
    })

    it('returns an empty list for blank input', () => {
        expect(tokenizeSearchQuery('   ')).toEqual([])
    })
})

describe('search scoring', () => {
    it('scores an exact title highest', () => {
        const exact = scoreSearchSection(section({title: 'Java'}), ['java'])
        const prefix = scoreSearchSection(section({title: 'Java basics'}), ['java'])
        const contains = scoreSearchSection(section({title: 'Intro to Java'}), ['java'])
        expect(exact).toBeGreaterThan(prefix)
        expect(prefix).toBeGreaterThan(contains)
    })

    it('ranks title over heading over body over metadata', () => {
        const title = scoreSearchSection(section({title: 'Java'}), ['java'])
        const heading = scoreSearchSection(section({titles: ['Java']}), ['java'])
        const body = scoreSearchSection(section({content: 'java'}), ['java'])
        const metadata = scoreSearchSection(section({categories: ['java']}), ['java'])
        expect(title).toBeGreaterThan(heading)
        expect(heading).toBeGreaterThan(body)
        expect(body).toBeGreaterThan(metadata)
    })

    it('requires every term to be present', () => {
        const s = section({title: 'Java', content: 'virtual threads'})
        expect(scoreSearchSection(s, ['java', 'threads'])).toBeGreaterThan(0)
        expect(scoreSearchSection(s, ['java', 'kotlin'])).toBe(0)
    })

    it('returns zero without terms', () => {
        expect(scoreSearchSection(section({title: 'Java'}), [])).toBe(0)
    })
})

describe('search results', () => {
    const sections: SearchSection[] = [
        section({id: '1', path: '/p/a', title: 'Kotlin', content: 'java interop'}),
        section({id: '2', path: '/p/b', title: 'Java', content: 'jvm'}),
        section({id: '3', path: '/p/c', title: 'Other', content: 'nothing'}),
    ]

    it('sorts by score and drops non-matches', () => {
        const results = searchSections(sections, 'java')
        expect(results.map(result => result.title)).toEqual(['Java', 'Kotlin'])
        expect(results[0]!.score).toBeGreaterThan(results[1]!.score)
    })

    it('honours the result limit', () => {
        expect(searchSections(sections, 'java', 1)).toHaveLength(1)
    })

    it('builds a snippet around the match', () => {
        const snippet = buildSnippet(`${'a'.repeat(100)} needle ${'b'.repeat(100)}`, ['needle'])
        expect(snippet).toContain('needle')
        expect(snippet.startsWith('…')).toBe(true)
        expect(snippet.endsWith('…')).toBe(true)
    })

    it('highlights matching segments', () => {
        const segments = highlightSegments('Java and java', ['java'])
        expect(segments.filter(segment => segment.match).map(segment => segment.text)).toEqual([
            'Java',
            'java',
        ])
    })
})
