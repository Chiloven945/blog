/**
 * Handles the edge Worker's blocked-NSFW handoff.
 *
 * When a reader without the `blog_nsfw` preference opens an NSFW document, the
 * Worker redirects to a safe normal page and attaches
 * `?nsfw=required&next=/<locale>/nsfw/...`. This composable explains the
 * situation, opens Settings -> Content, and — only after the reader opts in —
 * navigates to the validated target.
 */

const SAFE_NSFW_NEXT = /^\/(en|zh-cn|zh-tw)\/nsfw(?:\/|$)/

/**
 * A safe handoff target is a same-origin, localized NSFW path. Anything that is
 * not a plain absolute path (protocol-relative, external, `javascript:`) is
 * rejected to prevent an open redirect.
 */
export function isSafeNsfwNext(value: unknown): value is string {
    return typeof value === 'string'
        && value.startsWith('/')
        && !value.startsWith('//')
        && SAFE_NSFW_NEXT.test(value)
}

// Only the first consumer registers the cancellation watcher so the shared
// state is not observed twice.
let bound = false

export function useNsfwLinkHandoff() {
    const route = useRoute()
    const router = useRouter()
    const {open, isOpen} = useSettingsModal()

    // The validated target survives the Settings modal being opened/closed, so
    // it is shared application state rather than a local ref.
    const pendingNext = useState<string | null>('nsfw-pending-next', () => null)

    function clearQuery() {
        if (!('nsfw' in route.query) && !('next' in route.query)) {
            return
        }

        const query = {...route.query}
        delete query.nsfw
        delete query.next
        void router.replace({path: route.path, hash: route.hash, query})
    }

    /** React to a blocked-NSFW handoff present on the current route. */
    function handle() {
        if (route.query.nsfw !== 'required') {
            return
        }

        const next = route.query.next
        pendingNext.value = isSafeNsfwNext(next)
            ? next
            : null

        open('content')
    }

    /** Take the pending target, used after the reader opts in. */
    function consume(): string | null {
        const next = pendingNext.value
        pendingNext.value = null
        return next
    }

    /** Decline the handoff and strip its query parameters from the URL. */
    function cancel() {
        pendingNext.value = null
        clearQuery()
    }

    // Closing Settings without opting in counts as a cancel, so the handoff
    // query never lingers on the address bar.
    if (import.meta.client && !bound) {
        bound = true

        watch(isOpen, value => {
            if (!value && pendingNext.value) {
                cancel()
            }
        })
    }

    return {pendingNext, handle, consume, cancel, clearQuery}
}
