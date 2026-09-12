export function isDraft(item: { status?: string }): boolean {
    return item.status === 'draft'
}

export function draftsEnabled(): boolean {
    return !import.meta.dev
        ? false
        : useRoute().query.drafts === '1';
}

export function filterDrafts<T extends { status?: string }>(items: T[]): T[] {
    return draftsEnabled()
        ? items
        : items.filter(item => !isDraft(item))
}
