<script lang="ts" setup>
const props = withDefaults(defineProps<{
    id: string
    nsfw?: boolean
    mode?: 'card' | 'row' | 'feature' | 'search'
}>(), {
    nsfw: false,
    mode: 'card',
})

const {t} = useI18n()
const {effectiveBlur, isRevealed, reveal} = useNsfwPreferences()

const blurred = computed(() =>
    props.nsfw && effectiveBlur.value && !isRevealed(props.id),
)
</script>

<template>
    <div :class="`nsfw-guard--${mode}`" class="nsfw-guard">
        <!-- `inert` keeps the obscured links out of the pointer and tab order
             while the guard is active. -->
        <div
                :inert="blurred ? true : undefined"
                class="nsfw-guard__content"
        >
            <slot/>
        </div>

        <div v-if="blurred" class="nsfw-guard__overlay" data-nsfw-overlay>
            <div class="nsfw-guard__controls">
                <span aria-hidden="true" class="nsfw-badge">NSFW</span>
                <button
                        :aria-label="t('nsfw.reveal')"
                        class="nsfw-guard__reveal"
                        type="button"
                        @click="reveal(props.id)"
                >
                    <UIcon aria-hidden="true" class="size-4" name="i-lucide-eye"/>
                    <span>{{ t('nsfw.reveal') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>
