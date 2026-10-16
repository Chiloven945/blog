import {describe, expect, it} from 'vitest'
import {mergeVisibleContent} from '../../app/composables/useVisibleContent'

interface Item {
    path: string
    date: string
    nsfw?: boolean
}

describe('mergeVisibleContent', () => {
    it('orders merged normal and NSFW items newest-first', () => {
        const normal: Item[] = [
            {path: '/en/articles/a', date: '2026-09-14'},
            {path: '/en/articles/b', date: '2026-09-10'},
        ]
        const nsfw: Item[] = [
            {path: '/en/nsfw/articles/x', date: '2026-09-12', nsfw: true},
        ]

        expect(mergeVisibleContent(normal, nsfw).map(item => item.path)).toEqual([
            '/en/articles/a',
            '/en/nsfw/articles/x',
            '/en/articles/b',
        ])
    })

    it('returns the normal items unchanged when nothing is opted in', () => {
        const normal: Item[] = [{path: '/en/articles/a', date: '2026-01-01'}]

        expect(mergeVisibleContent(normal, [])).toEqual(normal)
    })
})
