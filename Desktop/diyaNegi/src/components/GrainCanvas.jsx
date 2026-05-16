// src/components/GrainCanvas.jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st + uTime * 0.12, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float noise = random(vUv * 8.0);
    gl_FragColor = vec4(vec3(noise), 0.5);
  }
`

export default function GrainCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let renderer, animId

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const geometry = new THREE.PlaneGeometry(2, 2)
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
      })

      scene.add(new THREE.Mesh(geometry, material))

      const startTime = performance.now()
      const animate = () => {
        animId = requestAnimationFrame(animate)
        material.uniforms.uTime.value = (performance.now() - startTime) / 1000
        renderer.render(scene, camera)
      }
      animate()

      const ro = new ResizeObserver(() => {
        renderer.setSize(el.clientWidth, el.clientHeight)
      })
      ro.observe(el)

      return () => {
        cancelAnimationFrame(animId)
        ro.disconnect()
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.parentNode?.removeChild(renderer.domElement)
      }
    } catch {
      // WebGL unavailable — grain is cosmetic, fail silently
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  )
}
