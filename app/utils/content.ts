export function isDraft(item: { draft?: boolean }): boolean {
    return item.draft === true
}

export function draftsEnabled(): boolean {
    return !import.meta.dev
        ? false
        : useRoute().query.drafts === '1';
}

export function filterDrafts<T extends { draft?: boolean }>(items: T[]): T[] {
    return draftsEnabled()
        ? items
        : items.filter(item => !isDraft(item))
}
