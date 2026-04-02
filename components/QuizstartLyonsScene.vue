<template>
  <div ref="mountRef" class="quizstart-lyons-mount" />
</template>

<script setup lang="ts">
/**
 * Два френель-DNA по кривым + частицы + орбита камеры (tween).
 * Порт с codepen.io/davidlyons/pen/GRRWrey — без lil-gui.
 * Полноэкранный fixed-слой + размер буфера по window (как в CodePen).
 */
const mountRef = ref<HTMLElement | null>(null)
let disposeFn: (() => void) | null = null
let cancelled = false

onMounted(() => {
  if (!import.meta.client || !mountRef.value) return
  cancelled = false

  void (async () => {
    const THREE = await import('three')
    const { Tween, Easing, update: tweenUpdate, removeAll: tweenRemoveAll } = await import(
      'three/examples/jsm/libs/tween.module.js'
    )

    if (cancelled || !mountRef.value) return
    const mount = mountRef.value

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d1528)

    const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 1000)
    camera.position.set(0, 0, 25)

    renderer.setClearColor(0x000000, 1)
    mount.appendChild(renderer.domElement)

    const target = new THREE.Vector3()

    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(0xb4f1ff) },
        color2: { value: new THREE.Color(0x475fbd) },
        alpha: { value: 0.75 },
        fresnelBias: { value: 0.1 },
        fresnelScale: { value: 1.0 },
        fresnelPower: { value: 1.3 },
      },
      vertexShader: /* glsl */ `
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
        varying float vReflectionFactor;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
          vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
          vec3 I = worldPosition.xyz - cameraPosition;
          vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float alpha;
        varying float vReflectionFactor;
        void main() {
          gl_FragColor = vec4(mix(color2, color1, vec3(clamp( vReflectionFactor, 0.0, 1.0 ))), alpha);
        }
      `,
      transparent: true,
    })

    const fresnelMat2 = fresnelMat.clone()
    fresnelMat2.uniforms.color1.value.setHex(0xf9dbff)
    fresnelMat2.uniforms.color2.value.setHex(0xc520cb)

    class SinCurve1 extends THREE.Curve {
      scale: number
      constructor(scale = 1) {
        super()
        this.scale = scale
      }
      override getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const ty = t * 10
        const tx = Math.sin(2.5 * Math.PI * t)
        const tz = Math.cos(2.5 * Math.PI * t)
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
      }
    }

    class SinCurve2 extends THREE.Curve {
      scale: number
      constructor(scale = 1) {
        super()
        this.scale = scale
      }
      override getPoint(t: number, optionalTarget = new THREE.Vector3()) {
        const ty = t * 10
        const tx = Math.sin(2 * Math.PI * t)
        const tz = Math.cos(2 * Math.PI * t)
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
      }
    }

    const curve1 = new SinCurve1(4.5)
    const curve2 = new SinCurve2(6)

    const cylLength = 1.65
    const cylGeo = new THREE.CylinderGeometry(0.1, 0.1, cylLength / 2, 16, 1, true)
    const sphereGeo = new THREE.SphereGeometry(0.3, 32, 32)

    class DNA extends THREE.Group {
      constructor(curve: THREE.Curve, total: number) {
        super()
        const cylinder = new THREE.Mesh(cylGeo, fresnelMat)
        cylinder.position.y = cylLength / 4
        const cylinder2 = new THREE.Mesh(cylGeo, fresnelMat2)
        cylinder2.position.y = -cylLength / 4
        const sphere = new THREE.Mesh(sphereGeo, fresnelMat)
        sphere.position.y = cylLength / 2 + 0.25
        const sphere2 = new THREE.Mesh(sphereGeo, fresnelMat2)
        sphere2.position.y = -cylLength / 2 - 0.25

        const barGroup = new THREE.Group()
        barGroup.add(cylinder)
        barGroup.add(cylinder2)
        barGroup.add(sphere)
        barGroup.add(sphere2)

        const n = total || 80
        for (let i = 1; i <= n; i++) {
          const bGroup = new THREE.Group()
          const bar = barGroup.clone(true)
          bar.rotation.z = Math.PI * (i / 10)
          bar.userData.startZ = bar.rotation.z
          bGroup.add(bar)
          curve.getPoint(i / n, bGroup.position)
          const nextPoint = curve.getPoint((i + 1) / n)
          bGroup.lookAt(nextPoint)
          this.add(bGroup)
        }
      }

      update(playhead: number) {
        this.children.forEach((obj) => {
          if (obj instanceof THREE.Group) {
            const bar = obj.children[0]
            if (bar && bar.userData.startZ != null) {
              bar.rotation.z = bar.userData.startZ - Math.PI * playhead
            }
          }
        })
      }
    }

    const dna1 = new DNA(curve1, 95)
    scene.add(dna1)
    dna1.position.set(1, -21, 13)

    const dna2 = new DNA(curve2, 100)
    scene.add(dna2)
    dna2.position.set(10, -30, -4)

    const particleColor = new THREE.Color(0x76aebc)
    const particleUniforms = {
      color: { value: particleColor.clone() },
      texture: { value: null },
      time: { value: 0 as number },
      size: { value: 50.0 },
    }

    const ParticleShader = {
      uniforms: particleUniforms,
      vertexShader: /* glsl */ `
        uniform float time;
        uniform float size;
        attribute float alphaOffset;
        varying float vAlpha;
        void main() {
          vAlpha = 0.5 * ( 1.0 + sin( alphaOffset + time ) );
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          float cameraDist = length( mvPosition.xyz );
          gl_PointSize = size / max(cameraDist, 0.001);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
          gl_FragColor = vec4( color, alpha );
        }
      `,
    }

    class Particles extends THREE.Group {
      points: THREE.Points
      constructor(opts?: { size?: number; pointCount?: number; range?: THREE.Vector3 }) {
        super()
        const size = opts?.size ?? 0.4
        const pointCount = opts?.pointCount ?? 40
        const range = opts?.range ?? new THREE.Vector3(2, 2, 2)

        particleUniforms.size.value = size

        const pointsMat = new THREE.ShaderMaterial({
          uniforms: particleUniforms,
          vertexShader: ParticleShader.vertexShader,
          fragmentShader: ParticleShader.fragmentShader,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        })

        const pointsGeo = new THREE.BufferGeometry()
        const positions = new Float32Array(pointCount * 3)
        const alphas = new Float32Array(pointCount)
        for (let i = 0; i < pointCount; i++) {
          positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(range.x)
          positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(range.y)
          positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(range.z)
          alphas[i] = i
        }
        pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        pointsGeo.setAttribute('alphaOffset', new THREE.BufferAttribute(alphas, 1))

        this.points = new THREE.Points(pointsGeo, pointsMat)
        this.points.renderOrder = 1
        this.add(this.points)
      }
    }

    function getParticleSize() {
      const size = 400 * (window.innerHeight / 900)
      return Math.max(size, 150)
    }

    const particles = new Particles({
      range: new THREE.Vector3(50, 50, 50),
      pointCount: 200,
      size: getParticleSize(),
    })
    scene.add(particles)

    const timeline = { playhead: 0 }
    const tween = new Tween(timeline)
      .to({ playhead: 1 }, 1000 * 30)
      .easing(Easing.Linear.None)
      .repeat(Infinity)
      .start()

    const clock = new THREE.Clock()

    function readSize() {
      return {
        w: Math.max(1, window.innerWidth),
        h: Math.max(1, window.innerHeight),
      }
    }

    function onResize() {
      particleUniforms.size.value = getParticleSize()
      const { w, h } = readSize()
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    onResize()
    window.addEventListener('resize', onResize)

    renderer.setAnimationLoop(() => {
      if (cancelled) return
      const elapsed = clock.getElapsedTime()
      particleUniforms.time.value = elapsed * 2

      tweenUpdate()
      const playhead = timeline.playhead

      dna1.update(playhead * 8)
      dna2.update(playhead * 8)

      camera.position.x = -Math.sin(2 * Math.PI * playhead) * 25
      camera.position.z = Math.cos(2 * Math.PI * playhead) * 25
      camera.position.y = Math.sin(2 * 2 * Math.PI * playhead) * 5

      target.x = -Math.sin(2 * Math.PI * playhead) * 10
      target.z = Math.cos(2 * Math.PI * playhead) * 10
      camera.lookAt(target)

      renderer.render(scene, camera)
    })

    disposeFn = () => {
      cancelled = true
      renderer.setAnimationLoop(null)
      tween.stop()
      tweenRemoveAll()
      window.removeEventListener('resize', onResize)
      cylGeo.dispose()
      sphereGeo.dispose()
      fresnelMat.dispose()
      fresnelMat2.dispose()
      particles.points.geometry.dispose()
      ;(particles.points.material as THREE.Material).dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  })()
})

onUnmounted(() => {
  disposeFn?.()
  disposeFn = null
})
</script>

<style scoped>
.quizstart-lyons-mount {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.quizstart-lyons-mount :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  vertical-align: top;
}
</style>
