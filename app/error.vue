<script lang="ts" setup>
import type {NuxtError} from '#app'

const props = defineProps<{ error: NuxtError }>()

const handleClear = () => clearError({redirect: '/'})
</script>

<template>
  <UApp>
    <main
        class="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 p-8 text-center">
      <p class="text-6xl font-bold">
        {{ props.error.statusCode }}
      </p>
      <p class="text-muted">
        {{ props.error.statusMessage }}
      </p>
      <UButton to="/" @click="handleClear">
        Home
      </UButton>
    </main>
  </UApp>
</template>
