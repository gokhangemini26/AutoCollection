import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  ScrollControls,
  Scroll,
  useScroll,
  Environment,
  ContactShadows,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import WatchModel from './WatchModel'

const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

// Camera keyframes: 4 positions for 5-page scroll
const CAM_KEYS = [
  { pos: new THREE.Vector3(0, 0, 7.5),    look: new THREE.Vector3(0, 0, 0) },   // 0 – front reveal
  { pos: new THREE.Vector3(4.8, 0.4, 3.2), look: new THREE.Vector3(0, 0, 0) },   // 1 – crown profile
  { pos: new THREE.Vector3(0.2, 0, 3.8),   look: new THREE.Vector3(0, 0, 0) },   // 2 – dial macro
  { pos: new THREE.Vector3(-3.8, 1.2, 5.8), look: new THREE.Vector3(0, 0.1, 0) }, // 3 – cinematic wide
]

// Watch rotation keyframes
const ROT_KEYS = [
  { x: 0,              y: 0 },
  { x: 0,              y: -Math.PI / 2.6 },
  { x: 0,              y: 0 },
  { x: Math.PI / 16,   y: Math.PI / 5.5 },
]

function CameraRig() {
  const { camera } = useThree()
  const scroll = useScroll()
  const cPos = useMemo(() => new THREE.Vector3(), [])
  const cLook = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const raw = scroll.offset * (CAM_KEYS.length - 1)
    const i = Math.min(Math.floor(raw), CAM_KEYS.length - 2)
    const t = ease(raw - i)
    const a = CAM_KEYS[i]
    const b = CAM_KEYS[i + 1]

    cPos.lerpVectors(a.pos, b.pos, t)
    cLook.lerpVectors(a.look, b.look, t)

    camera.position.lerp(cPos, 0.045)
    camera.lookAt(cLook)
  })

  return null
}

function WatchRig() {
  const group = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const tgt = useMemo(() => ({ x: 0, y: 0 }), [])

  useFrame(({ clock }) => {
    if (!group.current) return

    const raw = scroll.offset * (ROT_KEYS.length - 1)
    const i = Math.min(Math.floor(raw), ROT_KEYS.length - 2)
    const t = ease(raw - i)
    const a = ROT_KEYS[i]
    const b = ROT_KEYS[i + 1]

    tgt.x = a.x + (b.x - a.x) * t
    tgt.y = a.y + (b.y - a.y) * t

    group.current.rotation.x += (tgt.x - group.current.rotation.x) * 0.055
    group.current.rotation.y += (tgt.y - group.current.rotation.y) * 0.055
    group.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.07
  })

  return (
    <group ref={group}>
      <WatchModel />
    </group>
  )
}

const SERIF = '"Georgia", "Times New Roman", serif'
const SANS = '"Inter", "Helvetica Neue", system-ui, sans-serif'
const GOLD = '#d4af37'
const WHITE = '#f4f2ef'
const DIM = '#585858'

function WatchOverlay() {
  const sec: React.CSSProperties = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
  const lbl: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: '0.62rem',
    letterSpacing: '0.55em',
    color: GOLD,
    textTransform: 'uppercase',
    marginBottom: '1.1rem',
  }
  const title: React.CSSProperties = {
    fontFamily: SERIF,
    fontWeight: 200,
    color: WHITE,
    lineHeight: 1.06,
    margin: 0,
    fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
    letterSpacing: '-0.01em',
  }
  const body: React.CSSProperties = {
    fontFamily: SANS,
    color: DIM,
    fontSize: '0.875rem',
    lineHeight: 1.9,
    marginTop: '1.6rem',
    maxWidth: '32ch',
    letterSpacing: '0.01em',
  }

  return (
    <div style={{ width: '100vw', userSelect: 'none', pointerEvents: 'none' }}>

      {/* § 1 — Brand reveal */}
      <section style={{ ...sec, padding: '0 9vw' }}>
        <div style={lbl}>Maison Chronos</div>
        <h1 style={title}>
          Time is the<br />only true<br />luxury.
        </h1>
        <div
          style={{
            ...lbl,
            color: '#333',
            marginTop: '3.5rem',
            marginBottom: 0,
            animation: 'pulse 2.5s ease-in-out infinite',
          }}
        >
          Scroll to discover ↓
        </div>
      </section>

      {/* § 2 — Crown / Precision */}
      <section style={{ ...sec, padding: '0 9vw', alignItems: 'flex-end' }}>
        <div style={{ ...lbl, textAlign: 'right' }}>02 — Precision</div>
        <h2 style={{ ...title, fontSize: 'clamp(1.7rem, 4vw, 3.6rem)', textAlign: 'right' }}>
          1,200 parts.<br />One heartbeat.
        </h2>
        <p style={{ ...body, textAlign: 'right', marginLeft: 'auto' }}>
          Calibre 3120. A self-winding movement
          assembled by a single master over 480 hours
          in the workshops of Le Sentier.
        </p>
      </section>

      {/* § 3 — Dial / Mastery */}
      <section style={{ ...sec, padding: '0 9vw' }}>
        <div style={lbl}>03 — Mastery</div>
        <h2 style={{ ...title, fontSize: 'clamp(1.7rem, 4vw, 3.6rem)' }}>
          18k rose gold.<br />Sapphire crystal.
        </h2>
        <p style={body}>
          Anti-reflective sapphire reaching 9H hardness.
          The argenté guilloché dial is applied by hand
          under a 10× loupe, one grain at a time.
        </p>
      </section>

      {/* § 4 — CTA */}
      <section
        style={{
          ...sec,
          padding: '0 9vw',
          alignItems: 'center',
          textAlign: 'center',
          pointerEvents: 'auto',
        }}
      >
        <div style={lbl}>The Collection</div>
        <h2 style={{ ...title, fontSize: 'clamp(2.1rem, 4.8vw, 4.4rem)' }}>
          Own a piece<br />of eternity.
        </h2>
        <button
          style={{
            marginTop: '3.5rem',
            padding: '1rem 3.5rem',
            background: 'transparent',
            border: `1px solid ${GOLD}`,
            color: GOLD,
            letterSpacing: '0.38em',
            fontSize: '0.62rem',
            cursor: 'pointer',
            fontFamily: SANS,
            textTransform: 'uppercase',
            transition: 'background 0.35s, color 0.35s',
          }}
          onMouseEnter={e => {
            ;(e.target as HTMLButtonElement).style.background = GOLD
            ;(e.target as HTMLButtonElement).style.color = '#080808'
          }}
          onMouseLeave={e => {
            ;(e.target as HTMLButtonElement).style.background = 'transparent'
            ;(e.target as HTMLButtonElement).style.color = GOLD
          }}
        >
          Discover Now
        </button>
        <div
          style={{
            marginTop: '2.8rem',
            fontFamily: SANS,
            color: '#2a2a2a',
            fontSize: '0.62rem',
            letterSpacing: '0.38em',
          }}
        >
          Maison Chronos — Est. 1847
        </div>
      </section>

      {/* Scroll buffer */}
      <div style={{ height: '100vh' }} />
    </div>
  )
}

export default function WatchScene() {
  return (
    <ScrollControls pages={5} damping={0.32}>
      {/* 3D — outside <Scroll> so content is fixed in world space */}
      <CameraRig />
      <WatchRig />

      {/* Studio lighting — luxury-fashion preset */}
      <directionalLight
        position={[5, 8, 6]}
        intensity={2.6}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-far={22}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-5, 3.5, 5]} intensity={1.05} color="#e6efff" />
      <spotLight
        position={[0, 7, -8]}
        intensity={5.5}
        color="#ffffff"
        angle={Math.PI / 7}
        penumbra={0.88}
      />
      <pointLight position={[1.5, -4, 2.5]} intensity={1.4} color="#d4af37" />
      <pointLight position={[-2, 3, 6]} intensity={0.6} color="#fff0d0" />
      <ambientLight intensity={0.1} />

      <Environment preset="studio" environmentIntensity={0.42} />

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.42}
        scale={14}
        blur={3.2}
        far={4.5}
        resolution={512}
        color="#000000"
      />

      {/* Post-processing — luxury-fashion preset */}
      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.82}
          luminanceThreshold={0.84}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.12} darkness={0.72} />
        <Noise opacity={0.026} />
      </EffectComposer>

      {/* HTML overlay */}
      <Scroll html>
        <WatchOverlay />
      </Scroll>
    </ScrollControls>
  )
}
