<script lang="ts" setup>
type SpotifyType = 'playlist' | 'album' | 'track' | 'episode' | 'show' | 'artist'

const props = withDefaults(
    defineProps<{
        id: string
        type?: SpotifyType
        title?: string
    }>(),
    {
        type: 'playlist',
        title: '',
    },
)

// Fixed embed parameters (ROADMAP §26.7): authors only provide type + id.
const src = computed(
    () => `https://open.spotify.com/embed/${props.type}/${props.id}?utm_source=generator&theme=0`,
)

const height = computed(() => (props.type === 'track' || props.type === 'episode' ? 152 : 352))
</script>

<template>
    <div class="spotify-embed my-6 overflow-hidden rounded-sm border border-default">
        <iframe
                :height="height"
                :src="src"
                :title="title || 'Spotify'"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                class="block w-full"
                loading="lazy"
                style="border: 0"
                width="100%"
        />
    </div>
</template>
