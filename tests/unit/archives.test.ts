import {describe, expect, it} from 'vitest'
import {type ArchivePost, groupArchives} from '../../app/composables/useArchives'

const posts: ArchivePost[] = [
    {path: '/p/sep-late', title: 'Sep Late', date: '2026-09-20', day: 20},
    {path: '/p/sep-early', title: 'Sep Early', date: '2026-09-11', day: 11},
    {path: '/p/jan', title: 'Jan', date: '2026-01-05', day: 5},
    {path: '/p/dec', title: 'Dec', date: '2025-12-20', day: 20},
    {path: '/p/bad', title: 'Bad', date: 'not-a-date', day: 0},
]

describe('archive grouping', () => {
    const years = groupArchives(posts, 'en')

    it('sorts years and months descending', () => {
        expect(years.map(group => group.year)).toEqual([2026, 2025])
        expect(years[0]!.months.map(month => month.month)).toEqual([8, 0])
    })

    it('sorts posts inside a month by date descending', () => {
        expect(years[0]!.months[0]!.posts.map(post => post.path)).toEqual([
            '/p/sep-late',
            '/p/sep-early',
        ])
    })

    it('skips invalid dates', () => {
        const total = years.flatMap(group => group.months).flatMap(month => month.posts)
        expect(total).toHaveLength(4)
        expect(total.some(post => post.path === '/p/bad')).toBe(false)
    })

    it('labels months for the locale', () => {
        expect(years[0]!.months[0]!.label.length).toBeGreaterThan(0)
    })
})
