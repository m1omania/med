<template>
  <div
    :ref="(el) => { mapRoot = el as HTMLElement }"
    class="w-full rounded-none overflow-hidden bg-calming-50"
    :class="fill ? 'h-full min-h-[16rem]' : (compact ? 'h-32 rounded-lg border border-calming-200' : 'h-48 rounded-lg border border-calming-200')"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    lat: number
    lng: number
    name?: string
    compact?: boolean
    fill?: boolean
  }>(),
  { compact: false, fill: false },
)

const mapRoot = ref<HTMLElement | null>(null)

async function initMap() {
  if (!import.meta.client || !mapRoot.value) return
  const L = (await import('leaflet')).default
  const lat = props.lat
  const lng = props.lng
  const map = L.map(mapRoot.value).setView([lat, lng], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)
  L.marker([lat, lng]).addTo(map).bindPopup(props.name || 'Клиника')
  setTimeout(() => map.invalidateSize(), 100)
}

onMounted(() => {
  nextTick(() => initMap())
})
</script>
