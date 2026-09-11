<script lang="ts" setup>
defineOptions({inheritAttrs: false})

const props = withDefaults(
    defineProps<{
        code?: string
        language?: string
        filename?: string
        icon?: string
        highlights?: Array<number | string>
        meta?: string
        hideHeader?: boolean
        copy?: boolean | Record<string, unknown>
    }>(),
    {
        code: '',
        language: '',
        filename: '',
        icon: '',
        highlights: () => [],
        meta: '',
        hideHeader: false,
        copy: true,
    },
)

const copied = ref(false)
const preRef = ref<HTMLElement | null>(null)

const label = computed(() => props.filename || props.language || 'text')
const showHeader = computed(() => !props.hideHeader && Boolean(label.value))
const showCopy = computed(() => props.copy !== false)

let timer: ReturnType<typeof setTimeout> | undefined

async function copyCode() {
    const text = props.code ?? preRef.value?.textContent ?? ''
    try {
        await navigator.clipboard.writeText(text)
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
    <div class="prose-pre group relative my-5">
        <div
                v-if="showHeader"
                class="flex items-center justify-between gap-2 rounded-t-sm border border-b-0 border-default bg-muted px-3 py-1.5"
        >
            <span class="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                <UIcon v-if="icon" :name="icon" class="size-3.5 shrink-0"/>
                <span class="truncate font-mono">{{ label }}</span>
            </span>
            <UButton
                    v-if="showCopy"
                    :aria-label="copied ? 'Copied' : 'Copy code'"
                    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                    color="neutral"
                    size="xs"
                    variant="ghost"
                    @click="copyCode"
            />
        </div>

        <UButton
                v-else-if="showCopy"
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                aria-label="Copy code"
                class="absolute inset-e-2 top-2 z-10 opacity-0 transition group-hover:opacity-100"
                color="neutral"
                size="xs"
                variant="outline"
                @click="copyCode"
        />

        <pre
                ref="preRef"
                class="prose-pre__pre m-0 overflow-x-auto rounded-sm border border-default bg-muted px-4 py-3 font-mono text-sm/6 whitespace-pre"
                v-bind="$attrs"
        ><slot/></pre>
    </div>
</template>
