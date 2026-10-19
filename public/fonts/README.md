# Font licenses and build pipeline

License files for the font stack. Each bundled family is distributed under the SIL Open Font License
1.1 (OFL). Keep the license files alongside the fonts and preserve the copyright notices.

| Font              | Role                    | Files                     | License file                                       | Source                                          |
|-------------------|-------------------------|---------------------------|----------------------------------------------------|-------------------------------------------------|
| Google Sans Flex  | Latin sans (UI/article) | `google-sans-flex`        | `google-sans-flex/google-sans-flex-OFL.txt`        | https://github.com/googlefonts/googlesans-flex  |
| Google Sans       | Greek/Cyrillic sans     | `google-sans`             | `google-sans/google-sans-OFL.txt`                  | https://fonts.google.com/specimen/Google+Sans   |
| Source Han Sans   | CJK sans fallback       | `slices/source-han-sans`  | `slices/source-han-sans/source-han-sans-OFL.txt`   | https://github.com/adobe-fonts/source-han-sans  |
| Libre Baskerville | Latin serif (novel)     | `libre-baskerville`       | `libre-baskerville/libre-baskerville-OFL.txt`      | https://github.com/impallari/Libre-Baskerville  |
| Source Han Serif  | CJK serif fallback      | `slices/source-han-serif` | `slices/source-han-serif/source-han-serif-OFL.txt` | https://github.com/adobe-fonts/source-han-serif |
| Cascadia Code     | Latin mono (code)       | `cascadia-code`           | `cascadia-code/cascadia-code-OFL.txt`              | https://github.com/microsoft/cascadia-code      |
| Sarasa Mono CL    | CJK mono fallback       | `slices/sarasa-mono-cl`   | `slices/sarasa-mono-cl/sarasa-gothic-OFL.txt`      | https://github.com/be5invis/Sarasa-Gothic       |

The stack is unified and locale-independent: the Latin face renders Latin, Google Sans covers the
scripts Google Sans Flex lacks (Greek/Cyrillic), and the CJK face is the fallback for CJK glyphs
(Google Sans Flex → Google Sans → Source Han Sans, Libre Baskerville → system serif → Source Han
Serif, Cascadia Code → system mono → Sarasa Mono CL).

## CJK chunking

The full CJK binaries live in `assets/font-sources/` and are **not** deployed. They are split into
`unicode-range` chunks under `public/fonts/slices/` by `tools/split-fonts.mjs`, so a page only
downloads the glyph ranges it actually renders. The matching `@font-face` rules are generated into
`app/assets/css/fonts.generated.css` (imported by `app/assets/css/main.css`).

Run the splitter after changing a source font:

```sh
bun run fonts:split
```

The splitter must run with Node (the Bun build of `cn-font-split` cannot load its native library on
all platforms). Generated chunk names are content-hashed, so Cloudflare serves them with an
immutable cache header (see `public/_headers`).

Source Han Sans/Serif are the official Adobe CN region subsets in variable WOFF2; the Latin and mono
files are the Fontsource variable subsets, and Google Sans is subsetted from the upstream variable
font to Latin/Greek/Cyrillic. Sarasa Mono CL is a subsetted Sarasa Gothic web font (Regular).

Fonts are self-hosted, so there is no third-party CDN dependency.
