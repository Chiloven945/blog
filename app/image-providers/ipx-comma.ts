import type {ImageProvider} from '@nuxt/image'
import {encodeParam, encodePath, joinURL} from 'ufo'

/**
 * IPX provider with comma-separated modifiers.
 *
 * The built-in IPX provider joins modifiers with `&`, which produces URLs like
 * `/_ipx/f_webp&s_80x80/...`. Cloudflare's static asset handler redirects those
 * paths to their percent-encoded form (`%26`) before serving the prerendered
 * file, adding a round trip to every transformed image. IPX accepts `,` as a
 * separator too, and commas need no encoding, so the redirect disappears.
 */

const keyMap: Record<string, string> = {
    format: 'f',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b',
    position: 'pos',
}

export default function ipxComma(): ImageProvider<Record<string, unknown>> {
    return {
        validateDomains: true,
        supportsAlias: true,
        getImage(src, {modifiers, baseURL}, ctx) {
            const mods: Record<string, unknown> = {...modifiers}
            if (mods.width && mods.height) {
                mods.resize = `${mods.width}x${mods.height}`
                delete mods.width
                delete mods.height
            }

            const params = Object.entries(mods)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => (
                    `${encodeParam(keyMap[key] ?? key)}_${encodeParam(String(value))}`
                ))
                .join(',') || '_'

            const base = typeof baseURL === 'string' && baseURL
                ? baseURL
                : joinURL(ctx.options.nuxt.baseURL, '/_ipx')

            return {url: joinURL(base, params, encodePath(src as string))}
        },
    }
}
