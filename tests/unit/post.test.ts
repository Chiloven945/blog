import {describe, expect, it} from 'vitest'
import {estimateReadingTime, extractPostText, getPostSurround} from '../../app/utils/post'

describe('post text extraction', () => {
    const body = {
        value: [
            ['h1', {id: 'x'}, 'Hello'],
            ['p', {}, 'World ', ['strong', {}, 'bold']],
            ['pre', {className: 'shiki'}, ['code', {}, 'ignored code']],
            ['style', {}, 'ignored style'],
        ],
    }

    it('collects text but skips code and style', () => {
        const text = extractPostText(body)
        expect(text).toContain('Hello')
        expect(text).toContain('bold')
        expect(text).not.toContain('ignored code')
        expect(text).not.toContain('ignored style')
    })

    it('returns an empty string for missing bodies', () => {
        expect(extractPostText(null)).toBe('')
        expect(extractPostText({})).toBe('')
    })
})

describe('reading time', () => {
    it('scales with Latin words', () => {
        expect(estimateReadingTime(Array.from({length: 400}, () => 'word').join(' '))).toBe(2)
    })

    it('scales with CJK characters', () => {
        expect(estimateReadingTime('中'.repeat(300))).toBe(1)
        expect(estimateReadingTime('中'.repeat(301))).toBe(2)
    })
})

describe('post surround', () => {
    const posts = [
        {path: '/p/b', title: 'B', date: '2026-02-01'},
        {path: '/p/a', title: 'A', date: '2026-01-01'},
        {path: '/p/c', title: 'C', date: '2026-03-01'},
    ]

    it('orders by date and returns older/newer neighbours', () => {
        const result = getPostSurround(posts, '/p/b')
        expect(result.prev).toEqual({title: 'A', path: '/p/a'})
        expect(result.next).toEqual({title: 'C', path: '/p/c'})
    })

    it('returns null at the edges', () => {
        expect(getPostSurround(posts, '/p/a').prev).toBeNull()
        expect(getPostSurround(posts, '/p/c').next).toBeNull()
    })

    it('returns both null for an unknown path', () => {
        expect(getPostSurround(posts, '/p/zzz')).toEqual({prev: null, next: null})
    })
})
