<script lang="ts" setup>
import type {NavigationItem as NavigationItemData, SystemNavKey,} from '#shared/types/navigation'
import NavigationItem from './NavigationItem.vue'

const props = withDefaults(defineProps<{
    items: NavigationItemData[]
    activeKey?: SystemNavKey | null
    variant?: 'rail' | 'dock' | 'mobile' | 'row'
}>(), {
    activeKey: null,
    variant: 'rail',
})

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const indicator = ref<{ width: string; height: string; transform: string } | null>(null)

const containerClass = computed(() => {
    switch (props.variant) {
        case 'rail':
            return 'flex flex-col items-center gap-1'
        case 'dock':
            return 'flex items-center gap-1'
        case 'mobile':
            // Shares the dock with the More button (4:1 grow ratio).
            return 'flex basis-0 grow-[4] gap-1'
        default:
            return 'flex flex-col gap-1'
    }
})

let observer: ResizeObserver | null = null

function update() {
    const container = containerRef.value

    if (!container || !props.activeKey) {
        indicator.value = null
        return
    }

    const target = container.querySelector<HTMLElement>(
        `[data-nav-key="${props.activeKey}"]`,
    )

    if (!target || !target.offsetWidth) {
        indicator.value = null
        return
    }

    indicator.value = {
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translate(${target.offsetLeft}px, ${target.offsetTop}px)`,
    }
}

onMounted(() => {
    void nextTick(update)

    if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
        observer = new ResizeObserver(() => update())
        observer.observe(containerRef.value)
    }
})

watch(
    [() => props.activeKey, () => props.items],
    () => void nextTick(update),
)

onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
})
</script>

<template>
    <div ref="containerRef" class="relative" :class="containerClass">
        <span
                v-if="indicator"
                aria-hidden="true"
                class="nav-indicator"
                :style="indicator"
        />

        <NavigationItem
                v-for="item in items"
                :key="item.key"
                :active="item.key === activeKey"
                indicator
                :item="item"
                :variant="variant"
        />
    </div>
</template>
