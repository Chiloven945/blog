export type SystemNavKey = 'home' | 'articles' | 'novels' | 'tags' | 'archives' | 'friends'

export interface SystemNavItem {
    key: SystemNavKey
    to: string
    icon: string
    order: number
    available: boolean
}

export interface NavigationItem {
    key: SystemNavKey
    label: string
    to: string
    icon?: string
    available: boolean
}
