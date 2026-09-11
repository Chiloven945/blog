const dateLocales: Record<string, string> = {
    'zh-cn': 'zh-CN',
    'zh-tw': 'zh-TW',
    en: 'en-US',
}

export function resolveDateLocale(locale: string): string {
    return dateLocales[locale] ?? 'zh-CN'
}

export function parseDate(value: string): Date {
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
    return new Date(dateOnly ? `${value}T00:00:00Z` : value)
}

export function formatPostDate(value: string, locale: string): string {
    const date = parseDate(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat(resolveDateLocale(locale), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(date)
}
