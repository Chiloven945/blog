// Theme variables for Mermaid diagrams. The values are read from the active
// design tokens at render time so diagrams follow the light/dark theme.

export type MermaidThemeVariables = Record<string, string>

type TokenMap = Record<string, { token: string; fallback: string }>

// Mermaid's `base` theme is driven by these variables. Each one maps to a
// project token so diagrams read as part of the page rather than a widget.
const tokens: TokenMap = {
    primaryColor: {token: '--ui-bg-elevated', fallback: '#f4f4f5'},
    primaryTextColor: {token: '--ui-text-highlighted', fallback: '#18181b'},
    primaryBorderColor: {token: '--ui-primary', fallback: '#527398'},
    lineColor: {token: '--ui-primary', fallback: '#527398'},
    secondaryColor: {token: '--ui-bg-muted', fallback: '#fafafa'},
    tertiaryColor: {token: '--ui-bg', fallback: '#ffffff'},
    textColor: {token: '--ui-text', fallback: '#3f3f46'},
    background: {token: '--ui-bg', fallback: '#ffffff'},
    mainBkg: {token: '--ui-bg-elevated', fallback: '#f4f4f5'},
    nodeBorder: {token: '--ui-border-accented', fallback: '#d4d4d8'},
    clusterBkg: {token: '--ui-bg-muted', fallback: '#fafafa'},
    clusterBorder: {token: '--ui-border', fallback: '#e4e4e7'},
    edgeLabelBackground: {token: '--ui-bg', fallback: '#ffffff'},
    fontFamily: {token: '--font-ui-sans', fallback: 'ui-sans-serif, system-ui, sans-serif'},
}

/** Build Mermaid `themeVariables` from any CSS-variable reader (defaults safe). */
export function buildMermaidThemeVariables(
    read: (name: string) => string,
): MermaidThemeVariables {
    const variables: MermaidThemeVariables = {fontSize: '14px'}

    for (const [key, {token, fallback}] of Object.entries(tokens)) {
        const value = read(token).trim()
        variables[key] = value || fallback
    }

    return variables
}
