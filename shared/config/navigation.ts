import type {SystemNavItem} from '../types/navigation'

// Fixed v2 primary navigation (`Home / Articles / Novels / Tags /
// Archives / Friends`). Flip `available` to true as each page lands; the
// floating nav renders unavailable entries as disabled rather than
// linking to a route that does not exist yet.
export const siteNavigation: SystemNavItem[] = [
    {
        key: 'home',
        to: '/',
        icon: 'i-lucide-house',
        order: 10,
        available: true
    },
    {
        key: 'articles',
        to: '/articles',
        icon: 'i-lucide-file-text',
        order: 20,
        available: true
    },
    {
        key: 'novels',
        to: '/novels',
        icon: 'i-lucide-book-open',
        order: 30,
        available: true
    },
    {
        key: 'tags',
        to: '/tags',
        icon: 'i-lucide-tag',
        order: 40,
        available: true
    },
    {
        key: 'archives',
        to: '/archives',
        icon: 'i-lucide-archive',
        order: 50,
        available: true
    },
    {
        key: 'friends',
        to: '/friends',
        icon: 'i-lucide-users',
        order: 60,
        available: true
    },
]
