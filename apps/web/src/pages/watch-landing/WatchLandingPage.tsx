import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import WatchScene from './WatchScene'

export default function WatchLandingPage() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080808',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(4px); }
        }
      `}</style>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 7.5] }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.toneMapping = 5 // ACESFilmicToneMapping
          gl.toneMappingExposure = 0.88
        }}
      >
        <color attach="background" args={['#080808']} />
        <fog attach="fog" args={['#080808', 20, 40]} />
        <Suspense fallback={null}>
          <WatchScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
