import type {SystemNavItem} from '../types/navigation'

// Fixed v2 primary navigation (`Home / Articles / Novels / Tags /
// Archives / Friends`). The novel and tag indexes ship in later
// milestones, so they are flagged unavailable: the floating nav renders
// them as disabled rather than linking to a route that does not exist
// yet. Flip `available` to true as each page lands.
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
        available: false
    },
    {
        key: 'tags',
        to: '/tags',
        icon: 'i-lucide-tag',
        order: 40,
        available: false
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
