<script lang="ts" setup>
// M1 verification page. Temporary dev route — delete before release.
useSeoMeta({title: 'Design Tokens / Theme', robots: 'noindex'})

const modalOpen = ref(false)
const inputValue = ref('')

const semanticColors = [
  {key: 'primary', token: '--ui-primary'},
  {key: 'secondary', token: '--ui-secondary'},
  {key: 'success', token: '--ui-success'},
  {key: 'info', token: '--ui-info'},
  {key: 'warning', token: '--ui-warning'},
  {key: 'error', token: '--ui-error'},
  {key: 'neutral', token: '--ui-color-neutral-500'},
]

const brandScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
</script>

<template>
  <div class="container-page space-y-12 py-12">
    <header class="space-y-3 border-b border-default pb-6">
      <p class="text-xs uppercase tracking-[0.2em] text-muted">Dev only</p>
      <h1 class="text-3xl font-bold text-highlighted">
        Design Tokens / Theme
      </h1>
      <p class="text-muted">
        M1 verification page — Button, Input, Modal, Typography, border, colors,
        code, Card. Delete before release.
      </p>
    </header>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Colors
      </h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div
            v-for="c in semanticColors"
            :key="c.key"
            class="rounded-sm border border-default p-3"
        >
          <div
              :style="{ backgroundColor: `var(${c.token})` }"
              class="mb-2 h-10 rounded-sm"
          />
          <p class="text-sm text-toned">
            {{ c.key }}
          </p>
        </div>
      </div>
      <div>
        <p class="mb-2 text-sm text-muted">
          brand scale
        </p>
        <div class="flex flex-wrap gap-1">
          <div
              v-for="s in brandScale"
              :key="s"
              :style="{ backgroundColor: `var(--color-brand-${s})` }"
              class="flex h-10 w-16 items-end justify-center rounded-xs"
          >
            <span
                :class="s < 400 ? 'text-black' : 'text-white'"
                class="text-[10px]"
            >{{ s }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Typography
      </h2>
      <div class="space-y-2">
        <h1 class="text-4xl font-bold">
          Heading 1 — 标题
        </h1>
        <h2 class="text-3xl font-bold">
          Heading 2 — 标题
        </h2>
        <h3 class="text-2xl font-bold">
          Heading 3
        </h3>
        <p class="text-base">
          正文段落：HarmonyOS Sans 中文测试 ABCDEFG abcdefg 0123456789. The
          quick brown fox jumps over the lazy dog.
        </p>
        <p class="text-sm text-muted">
          Muted small text / 次要文本。
        </p>
        <p>
          链接示例 <a href="#">这是一个链接</a>，以及 <a href="#">English link</a>。
        </p>
        <p class="italic">
          Synthetic italic 斜体测试。
        </p>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Button
      </h2>
      <div class="flex flex-wrap items-center gap-3">
        <UButton>Primary</UButton>
        <UButton
            color="neutral"
            variant="outline"
        >
          Outline
        </UButton>
        <UButton
            color="neutral"
            variant="soft"
        >
          Soft
        </UButton>
        <UButton
            color="neutral"
            variant="ghost"
        >
          Ghost
        </UButton>
        <UButton variant="link">
          Link
        </UButton>
        <UButton disabled>
          Disabled
        </UButton>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Input
      </h2>
      <div class="grid gap-3 sm:max-w-md">
        <UInput
            v-model="inputValue"
            placeholder="Type something…"
        />
        <UInput
            disabled
            placeholder="Disabled"
        />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Card
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UCard>
          <template #header>
            <p class="font-bold text-highlighted">
              Card title
            </p>
          </template>
          <p class="text-sm text-muted">
            A quiet card: 1px border, no shadow, small radius.
          </p>
        </UCard>
        <UCard variant="soft">
          <p class="font-bold text-highlighted">
            Soft card
          </p>
          <p class="mt-1 text-sm text-muted">
            Uses the elevated surface.
          </p>
        </UCard>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Border
      </h2>
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-sm border border-default p-4 text-sm">
          border-default
        </div>
        <div class="rounded-sm border border-muted p-4 text-sm">
          border-muted
        </div>
        <div class="rounded-sm border border-accented p-4 text-sm">
          border-accented
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Code
      </h2>
      <p>
        Inline <code class="rounded-xs bg-elevated px-1.5 py-0.5 text-sm">const answer = 42</code>
        code.
      </p>
      <pre
          class="overflow-x-auto rounded-sm border border-default bg-elevated p-4 text-sm"
      ><code>export function greet(name: string) {
  return `Hello, ${name}!`
}</code></pre>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-bold text-highlighted">
        Modal
      </h2>
      <UButton @click="modalOpen = true">
        Open modal
      </UButton>
      <UModal
          v-model:open="modalOpen"
          description="A quiet modal with a light shadow."
          title="Modal title"
      >
        <template #body>
          <p class="text-sm text-muted">
            Modal content. 1px border, 6px radius, subtle elevation.
          </p>
        </template>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton
                color="neutral"
                variant="outline"
                @click="modalOpen = false"
            >
              Cancel
            </UButton>
            <UButton @click="modalOpen = false">
              Confirm
            </UButton>
          </div>
        </template>
      </UModal>
    </section>
  </div>
</template>
