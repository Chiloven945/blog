<script lang="ts" setup>
import {useId} from 'vue'
import {buildMermaidThemeVariables} from '~/utils/mermaid'

const props = withDefaults(
    defineProps<{
        code?: string
    }>(),
    {
        code: '',
    },
)

const emit = defineEmits<{
    rendered: []
    failed: []
}>()

const colorMode = useColorMode()
const container = ref<HTMLElement | null>(null)
const rendered = ref(false)
const diagramId = useId()

let renderCount = 0

function themeVariables() {
    const styles = getComputedStyle(document.documentElement)
    return buildMermaidThemeVariables(name => styles.getPropertyValue(name))
}

async function renderDiagram() {
    const source = props.code.trim()

    if (!source || !container.value) {
        return
    }

    const id = `${diagramId}-${renderCount++}`

    try {
        const mermaid = (await import('mermaid')).default

        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'base',
            themeVariables: themeVariables(),
            flowchart: {htmlLabels: false, curve: 'basis'},
        })

        await mermaid.parse(source)

        const {svg, bindFunctions} = await mermaid.render(id, source)
        container.value.innerHTML = svg
        bindFunctions?.(container.value)
        rendered.value = true
        emit('rendered')
    } catch {
        emit('failed')
    }
}

// For client-only components the template ref binds after onMounted, so render
// when it appears instead of reading it once.
watch(container, el => {
    if (el) {
        void renderDiagram()
    }
})

// Diagrams must follow the active theme; re-render when it changes.
watch(() => colorMode.value, () => {
    void renderDiagram()
})
</script>

<template>
    <div
            v-show="rendered"
            ref="container"
            class="mermaid-diagram"
            role="img"
    />
</template>
