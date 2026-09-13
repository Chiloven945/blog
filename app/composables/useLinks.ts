import type {LinkItem, LinksData} from '#shared/schemas/links'

/** Single source for personal links: `content/data/links.yml`. */
export function useLinks() {
    const {data} = useAsyncData(
        'links',
        () => queryCollection('links').first() as Promise<LinksData | null>,
    )

    const items = computed<LinkItem[]>(() => {
        const list = (data.value as LinksData | null)?.items ?? []
        return [...list].sort((a, b) => a.order - b.order)
    })

    const featured = computed(() => items.value.filter(item => item.featured))

    return {items, featured}
}
