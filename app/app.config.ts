export default defineAppConfig({
    ui: {
        // Semantic colors (ROADMAP §19.5). Only one brand color: `brand` → primary.
        colors: {
            primary: 'brand',
            secondary: 'blue',
            success: 'green',
            info: 'sky',
            warning: 'amber',
            error: 'red',
            neutral: 'zinc',
        },

        // Sharper radii than Nuxt UI defaults (ROADMAP §19.2).
        button: {
            slots: {
                base: (base: string) => base.replace('rounded-md', 'rounded-sm'),
            },
        },
        input: {
            slots: {
                base: (base: string) => base.replace('rounded-md', 'rounded-sm'),
            },
        },
        card: {
            slots: {
                root: (base: string) => base.replace('rounded-lg', 'rounded-sm'),
            },
        },
        modal: {
            slots: {
                content: (base: string) => base.replace('rounded-lg', 'rounded-md'),
            },
        },
    },
})
