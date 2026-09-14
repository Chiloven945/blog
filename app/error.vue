<script lang="ts" setup>
import type {NuxtError} from '#app'

const props = defineProps<{ error: NuxtError }>()
const {t} = useI18n()

const isNotFound = computed(() => props.error.statusCode === 404)

function handleBackHome() {
    clearError({redirect: '/'})
}
</script>

<template>
    <UApp>
        <div class="app-shell">
            <AppFloatingNavigation/>

            <main
                    id="main"
                    class="container-page flex flex-1 flex-col items-start justify-center py-16"
                    tabindex="-1">
                <template v-if="isNotFound">
                    <p class="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                        {{ t('error.notFoundEyebrow') }}
                    </p>
                    <h1 class="mt-6 max-w-2xl font-display-serif text-3xl leading-snug tracking-tight text-highlighted whitespace-pre-line sm:text-4xl lg:text-5xl">
                        {{ t('error.notFoundTitle') }}
                    </h1>
                    <UButton class="mt-10" size="lg" variant="outline" @click="handleBackHome">
                        {{ t('error.backHome') }}
                    </UButton>
                </template>

                <template v-else>
                    <p class="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                        {{ props.error.statusCode }}
                    </p>
                    <h1 class="mt-6 text-4xl font-bold text-highlighted sm:text-5xl">
                        {{ t('error.genericTitle') }}
                    </h1>
                    <p v-if="props.error.statusMessage" class="mt-4 text-muted">
                        {{ props.error.statusMessage }}
                    </p>
                    <UButton class="mt-10" size="lg" variant="outline" @click="handleBackHome">
                        {{ t('error.backHome') }}
                    </UButton>
                </template>
            </main>
        </div>
    </UApp>
</template>
