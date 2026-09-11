import type {SystemNavItem} from '../types/navigation'

export const systemNavigation: SystemNavItem[] = [
    {key: 'home', to: '/', icon: 'i-lucide-house', order: 10},
    {key: 'blog', to: '/blog', icon: 'i-lucide-notebook-pen', order: 20},
    {key: 'archives', to: '/archives', icon: 'i-lucide-archive', order: 30},
    {key: 'friends', to: '/friends', icon: 'i-lucide-users', order: 40},
]
