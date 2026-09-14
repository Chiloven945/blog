import {describe, expect, it} from 'vitest'
import {
    buildSnippet,
    highlightSegments,
    scoreSearchSection,
    type SearchSection,
    searchSections,
} from '../../app/utils/search'

function section(partial: Partial<SearchSection>): SearchSection {
    return {
        id: partial.id ?? '/x',
        path: partial.path ?? '/x',
        title: partial.title ?? '',
        titles: partial.titles ?? [],
        level: partial.level ?? 2,
        content: partial.content ?? '',
        ...partial,
    }
}

describe(
    'search scoring',
    () => {
        it(
            'ranks title over heading over body over metadata',
            () => {
                const title = scoreSearchSection(section({title: 'Java'}), ['java'])
                const heading = scoreSearchSection(section({titles: ['Java']}), ['java'])
                const body = scoreSearchSection(section({content: 'java'}), ['java'])
                const metadata = scoreSearchSection(section({tags: ['java']}), ['java'])

                expect(title).toBeGreaterThan(heading)
                expect(heading).toBeGreaterThan(body)
                expect(body).toBeGreaterThan(metadata)
            }
        )

        it(
            'requires every term to be present',
            () => {
                const s = section({title: 'Java', content: 'virtual threads'})

                expect(scoreSearchSection(s, ['java', 'threads'])).toBeGreaterThan(0)
                expect(scoreSearchSection(s, ['java', 'kotlin'])).toBe(0)
            }
        )
    }
)

describe(
    'search results',
    () => {
        const sections: SearchSection[] = [
            section({id: '1', path: '/a', title: 'Kotlin', content: 'java interop'}),
            section({id: '2', path: '/b', title: 'Java', content: 'jvm'}),
            section({id: '3', path: '/c', title: 'Other', content: 'nothing'}),
        ]

        it(
            'sorts by score, drops non-matches and honours the limit',
            () => {
                const results = searchSections(sections, 'java')

                expect(results.map(result => result.title)).toEqual(['Java', 'Kotlin'])
                expect(searchSections(
                    sections,
                    'java',
                    1
                )).toHaveLength(1)
            }
        )

        it(
            'builds a snippet and highlights regex-special matches',
            () => {
                const snippet = buildSnippet(
                    `${'a'.repeat(100)} C++ ${'b'.repeat(100)}`,
                    ['c++']
                )

                expect(snippet).toContain('C++')
                expect(snippet.startsWith('…')).toBe(true)

                const segments = highlightSegments('C++ and (java)', ['c++', '(java)'])

                expect(segments
                    .filter(segment => segment.match)
                    .map(segment => segment.text)
                ).toEqual(['C++', '(java)'])
            }
        )
    }
)
