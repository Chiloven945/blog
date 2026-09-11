export type SystemNavKey = 'home' | 'blog' | 'archives' | 'friends'

export interface SystemNavItem {
    key: SystemNavKey
    to: string
    icon: string
    order: number
}

export interface NavigationItem {
    label: string
    to: string
    icon?: string
}
