# Font licenses

License files for the font stack. Each bundled family is distributed under the SIL Open Font License
1.1 (OFL). The binaries live alongside these files under ``.

| Font              | Role                    | Files               | License file                                  | Source                                          |
|-------------------|-------------------------|---------------------|-----------------------------------------------|-------------------------------------------------|
| Google Sans Flex  | Latin sans (UI/article) | `google-sans-flex`  | `google-sans-flex/google-sans-flex-OFL.txt`   | https://github.com/googlefonts/googlesans-flex  |
| Google Sans       | Greek/Cyrillic sans     | `google-sans`       | `google-sans/google-sans-OFL.txt`             | https://fonts.google.com/specimen/Google+Sans   |
| Source Han Sans   | CJK sans fallback       | `source-han-sans`   | `source-han-sans/source-han-sans-OFL.txt`     | https://github.com/adobe-fonts/source-han-sans  |
| Libre Baskerville | Latin serif (novel)     | `libre-baskerville` | `libre-baskerville/libre-baskerville-OFL.txt` | https://github.com/impallari/Libre-Baskerville  |
| Source Han Serif  | CJK serif fallback      | `source-han-serif`  | `source-han-serif/source-han-serif-OFL.txt`   | https://github.com/adobe-fonts/source-han-serif |
| Cascadia Code     | Latin mono (code)       | `cascadia-code`     | `cascadia-code/cascadia-code-OFL.txt`         | https://github.com/microsoft/cascadia-code      |
| Sarasa Mono CL    | CJK mono fallback       | `sarasa-mono-cl`    | `sarasa-mono-cl/sarasa-gothic-OFL.txt`        | https://github.com/be5invis/Sarasa-Gothic       |

The stack is unified and locale-independent: the Latin face renders Latin, Google Sans covers the
scripts Google Sans Flex lacks (Greek/Cyrillic), and the CJK face is the fallback for CJK glyphs
(Google Sans Flex → Google Sans → Source Han Sans, Libre Baskerville → system serif → Source Han
Serif, Cascadia Code → system mono → Sarasa Mono CL). Source Han Sans/Serif are the official Adobe
CN region subsets in variable WOFF2; the Latin and mono files are the Fontsource variable subsets,
and Google Sans is subsetted from the upstream variable font to Latin/Greek/Cyrillic. Sarasa Mono CL
is a subsetted Sarasa Gothic web font (Regular, one file, loaded on demand when CJK mono glyphs
appear).

Fonts are self-hosted; retain these license files alongside the binaries and keep the copyright
notices intact.
