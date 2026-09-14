<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        code?: string
    }>(),
    {
        code: '',
    },
)

const {t} = useI18n()

// The diagram is drawn by a client-only component so Mermaid never enters the
// server bundle. Until it mounts, the raw source is shown as the fallback.
const hydrated = ref(false)
const rendered = ref(false)
const failed = ref(false)
const copied = ref(false)

onMounted(() => {
    hydrated.value = true
})

let timer: ReturnType<typeof setTimeout> | undefined

async function copySource() {
    try {
        await navigator.clipboard.writeText(props.code)
        copied.value = true
        clearTimeout(timer)
        timer = setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch {
        // Clipboard API unavailable (insecure context); ignore.
    }
}
</script>

<template>
    <figure class="mermaid-block" data-mermaid>
        <div class="mermaid-toolbar">
            <span class="mermaid-label">
                <UIcon
                        aria-hidden="true"
                        class="size-3.5"
                        name="i-lucide-share-2"
                />
                <span>Mermaid</span>
            </span>
            <UButton
                    :aria-label="copied ? t('mermaid.copied') : t('mermaid.copySource')"
                    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                    color="neutral"
                    size="xs"
                    variant="ghost"
                    @click="copySource"
            />
        </div>

        <MermaidCanvas
                v-if="hydrated"
                :code="code"
                @failed="failed = true"
                @rendered="rendered = true"
        />

        <pre
                v-if="!rendered"
                class="mermaid-source"
        ><code>{{ code }}</code></pre>

        <p
                v-if="failed"
                class="mermaid-error"
        >
            {{ t('mermaid.error') }}
        </p>
    </figure>
</template>
