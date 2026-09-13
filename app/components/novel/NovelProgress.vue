<script lang="ts" setup>
const progress = ref(0)

function update() {
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    progress.value = max > 0
        ? Math.min(
            100,
            Math.max(0, (doc.scrollTop / max) * 100)
        )
        : 0
}

onMounted(() => {
    update()
    window.addEventListener('scroll', update, {passive: true})
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
})
</script>

<template>
    <div aria-hidden="true" class="pointer-events-none fixed inset-x-0 top-0 z-40 h-0.5">
        <div
                :style="{width: `${progress}%`}"
                class="h-full bg-primary transition-[width] duration-150"
        />
    </div>
</template>
