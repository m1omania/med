<template>
  <div :ref="(el) => { mapRoot = el as HTMLElement }" class="w-full h-full" />
</template>

<script setup lang="ts">
const props = defineProps<{
  clinics: { id: number; name: string; lat?: number; lng?: number }[]
  centerLat?: number
  centerLng?: number
  zoom?: number
}>()

const mapRoot = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!import.meta.client || !mapRoot.value) return
  const L = (await import('leaflet')).default
  const clinicsWithCoords = props.clinics.filter((c) => c.lat != null && c.lng != null)

  const defaultLat = props.centerLat ?? 61.78
  const defaultLng = props.centerLng ?? 34.35
  const map = L.map(mapRoot.value!).setView([defaultLat, defaultLng], props.zoom ?? 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  const bounds = L.latLngBounds([] as [number, number][])
  clinicsWithCoords.forEach((c) => {
    const lat = c.lat!
    const lng = c.lng!
    L.marker([lat, lng]).addTo(map).bindPopup(c.name)
    bounds.extend([lat, lng])
  })

  if (clinicsWithCoords.length > 0 && bounds.isValid()) {
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 })
  }
})
</script>
