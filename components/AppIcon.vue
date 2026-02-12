<template>
  <component
    :is="iconComponent"
    :size="sizePx"
    :class="props.class"
    class="inline-block shrink-0"
    stroke-width="1.5"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import {
  Sun,
  ClipboardList,
  BarChart3,
  Building2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Star,
  MapPin,
  Bell,
  User,
  Mars,
  Venus,
  Hospital,
  Search,
  X,
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    name: 'logo' | 'clipboard' | 'chart' | 'building' | 'arrow-right' | 'arrow-left' | 'plus' | 'star' | 'map-pin' | 'bell' | 'user-male' | 'user-female' | 'male' | 'female' | 'hospital' | 'search' | 'close'
    class?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const sizePx = computed(() => {
  switch (props.size) {
    case 'sm': return 20
    case 'lg': return 40
    default: return 24
  }
})

const iconMap = {
  logo: Sun,
  clipboard: ClipboardList,
  chart: BarChart3,
  building: Building2,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  plus: Plus,
  star: Star,
  'map-pin': MapPin,
  bell: Bell,
  'user-male': User,
  'user-female': User,
  male: Mars,
  female: Venus,
  hospital: Hospital,
  search: Search,
  close: X,
} as const

const iconComponent = computed(() => iconMap[props.name] ?? ArrowRight)
</script>
