<template>
  <div class="quizstart-dna-root" aria-hidden="true">
    <div ref="mountRef" class="quizstart-dna-loader" />
  </div>
</template>

<script setup lang="ts">
/**
 * DNA double-helix spiral (logic from codepen.io/madcat/pen/gveQjK).
 * Первый экран страницы (не fixed) — уезжает при скролле. pointer-events: none.
 */

const mountRef = ref<HTMLElement | null>(null)

function easeInOutExpo(t: number, b: number, c: number, d: number): number {
  if (t === 0) return b
  if (t >= d) return b + c
  let tm = t / (d / 2)
  if (tm < 1) return (c / 2) * 2 ** (10 * (tm - 1)) + b
  tm -= 1
  return (c / 2) * (-(2 ** (-10 * tm)) + 2) + b
}

class Osc {
  private val: number
  private readonly valBase: number
  private readonly rate: number
  private dir: boolean
  private readonly flip: boolean

  constructor(val: number, rate: number, dir = true, flip = false) {
    this.valBase = val
    this.rate = rate
    this.val = val
    this.dir = dir
    this.flip = flip
  }

  reset() {
    this.val = this.valBase
    this.dir = true
  }

  update(dt: number) {
    if (this.dir) {
      if (this.val < 1) {
        this.val += this.rate * dt
      } else {
        if (this.flip) {
          this.val -= 1
        } else {
          this.val = 1 - (this.val - 1)
          this.dir = false
        }
      }
    } else if (this.val > 0) {
      this.val -= this.rate * dt
    } else {
      if (this.flip) {
        this.val = 1 + this.val
      } else {
        this.val = -this.val
        this.dir = true
      }
    }
  }

  eased(): number {
    return easeInOutExpo(this.val, 0, 1, 1)
  }
}

let raf = 0
let disposeFn: (() => void) | null = null
let cancelled = false

onMounted(() => {
  if (!import.meta.client || !mountRef.value) return
  cancelled = false

  void (async () => {
    const THREE = await import('three')
    if (cancelled || !mountRef.value) return
    const mount = mountRef.value
    mount.style.background = 'transparent'

    const rootForSize = (mount.parentElement ?? mount) as HTMLElement

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10000)
    camera.position.set(-12, 10, 22)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    function readContainerSize() {
      const w = rootForSize.clientWidth || window.innerWidth
      const h = rootForSize.clientHeight || window.innerHeight
      return { w: Math.max(1, w), h: Math.max(1, h) }
    }

    const sphereGeometry = new THREE.SphereGeometry(1, 16, 16)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      depthTest: false,
    })

    const count = 30
    const height = 10
    const radius = 4

    type ParticleRec = {
      mesh: InstanceType<typeof THREE.Mesh>
      order: number
      alternate: boolean
      osc: Osc
    }

    const particles: ParticleRec[] = []
    const particleGroup = new THREE.Group()
    particleGroup.scale.setScalar(0.0001)
    scene.add(particleGroup)

    for (let i = 0; i < count; i++) {
      const order = i / (count - 1)
      for (const alternate of [false, true]) {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.92,
          depthTest: false,
        })
        const mesh = new THREE.Mesh(sphereGeometry, mat)
        mesh.scale.setScalar(0.1)
        particleGroup.add(mesh)
        particles.push({
          mesh,
          order,
          alternate,
          osc: new Osc(order, 0.015, true, false),
        })
      }
    }

    const lines: THREE.Line[] = []
    for (let i = 0; i < count; i++) {
      const g = new THREE.BufferGeometry()
      const pos = new Float32Array(6)
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const line = new THREE.Line(g, lineMaterial)
      particleGroup.add(line)
      lines.push(line)
    }

    /** Общее замедление относительно исходного CodePen (~0.5 ≈ вдвое медленнее). */
    const motionScale = 0.48
    const helixPhase = 0.0015 * motionScale

    let entering = true
    let enterProgress = 0
    const enterRate = 0.015 * motionScale
    let elapsedMs = 0
    const clock = new THREE.Clock()

    function map(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
      return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
    }

    function onResize() {
      const { w, h } = readContainerSize()
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    const resizeObserver = new ResizeObserver(() => onResize())
    resizeObserver.observe(rootForSize)
    onResize()
    window.addEventListener('resize', onResize)

    function tick() {
      raf = requestAnimationFrame(tick)
      const deltaSec = clock.getDelta()
      const deltaNormal = (deltaSec * 1000) / (1000 / 60)
      elapsedMs += deltaSec * 1000

      if (entering && enterProgress < 1) {
        enterProgress += enterRate * deltaNormal
        if (enterProgress > 1) {
          enterProgress = 1
          entering = false
        }
        const s = easeInOutExpo(enterProgress, 0, 1, 1)
        particleGroup.scale.setScalar(s)
      }

      const t = elapsedMs * helixPhase
      const a0 = -Math.cos(t) * Math.PI * 1.5
      const a1 = Math.sin(t) * Math.PI * 1.5

      for (const p of particles) {
        p.osc.update(motionScale)
        let angle = map(p.order, 0, 1, a0, a1)
        if (p.alternate) angle += Math.PI
        const x = Math.cos(angle) * radius
        const y = map(p.order, 0, 1, -height, height)
        const z = Math.sin(angle) * radius
        p.mesh.position.set(x, y, z)
        let sc = 0.1 + p.osc.eased() * 0.2
        if (p.alternate) sc = 0.1 + (1 - p.osc.eased()) * 0.2
        p.mesh.scale.setScalar(sc)
      }

      for (let j = 0; j < count; j++) {
        const p1 = particles[j * 2]
        const p2 = particles[j * 2 + 1]
        const line = lines[j]
        const pos = line.geometry.attributes.position.array as Float32Array
        pos[0] = p1.mesh.position.x
        pos[1] = p1.mesh.position.y
        pos[2] = p1.mesh.position.z
        pos[3] = p2.mesh.position.x
        pos[4] = p2.mesh.position.y
        pos[5] = p2.mesh.position.z
        line.geometry.attributes.position.needsUpdate = true
      }

      particleGroup.rotation.z = Math.sin(elapsedMs * helixPhase) * Math.PI * 0.25
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }

    tick()

    disposeFn = () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      window.removeEventListener('resize', onResize)
      sphereGeometry.dispose()
      lineMaterial.dispose()
      for (const p of particles) {
        p.mesh.material.dispose()
      }
      for (const line of lines) {
        line.geometry.dispose()
      }
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  })()
})

onUnmounted(() => {
  cancelled = true
  disposeFn?.()
  disposeFn = null
})
</script>

<style scoped>
.quizstart-dna-root {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  pointer-events: none;
}

.quizstart-dna-loader {
  position: absolute;
  inset: 0;
  transition: opacity 600ms;
}

.quizstart-dna-loader :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  vertical-align: top;
}
</style>
