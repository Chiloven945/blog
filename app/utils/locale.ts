const dateLocales: Record<string, string> = {
    'zh-cn': 'zh-CN',
    'zh-tw': 'zh-TW',
    en: 'en-US',
}

export function resolveDateLocale(locale: string): string {
    return dateLocales[locale] ?? 'zh-CN'
}

const ogLocales: Record<string, string> = {
    'zh-cn': 'zh_CN',
    'zh-tw': 'zh_TW',
    en: 'en_US',
}

export function resolveOgLocale(locale: string): string {
    return ogLocales[locale] ?? 'zh_CN'
}
