import {extname, join, normalize} from 'node:path'

const root = join(import.meta.dir, '..', '..', '.output', 'public')
const port = Number(process.env.PORT ?? 4173)

const contentTypes: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.map': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm',
}

function typeFor(path: string): string {
    return contentTypes[extname(path).toLowerCase()] ?? 'application/octet-stream'
}

async function resolveFile(pathname: string) {
    const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
    const candidates = clean.endsWith('/')
        ? [join(clean, 'index.html')]
        : [clean, `${clean}.html`, join(clean, 'index.html')]

    for (const candidate of candidates) {
        const file = Bun.file(join(root, candidate))

        if (await file.exists()) {
            return {file, path: candidate}
        }
    }

    return null
}

const server = Bun.serve({
    port,
    async fetch(request) {
        const url = new URL(request.url)
        const found = await resolveFile(url.pathname)

        if (found) {
            return new Response(found.file, {
                headers: {'content-type': typeFor(found.path)},
            })
        }

        const fallback = Bun.file(join(root, '404.html'))

        if (await fallback.exists()) {
            return new Response(fallback, {
                status: 404,
                headers: {'content-type': typeFor('404.html')},
            })
        }

        return new Response('Not Found', {status: 404})
    },
})

console.log(`static server listening on http://localhost:${server.port}`)
