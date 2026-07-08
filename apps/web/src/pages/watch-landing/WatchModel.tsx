import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const C = {
  gold: '#d4af37',
  steel: '#b8b8b8',
  steelBright: '#d4d4d4',
  dial: '#f0ede5',
  strap: '#1a0d08',
  red: '#cc2222',
}

const R = 1.2
const H = 0.35
const BZ_H = 0.065

const Z = {
  BACK: -(H / 2),
  FRONT: H / 2,
  BEZEL: H / 2 + BZ_H / 2,
  DIAL: H / 2 + 0.012,
  MARKER: H / 2 + 0.022,
  HAND: H / 2 + 0.042,
  CRYSTAL: H / 2 + BZ_H + 0.018,
}

function GoldMat({ emissiveIntensity = 0.14 }: { emissiveIntensity?: number }) {
  return (
    <meshPhysicalMaterial
      color={C.gold}
      metalness={1}
      roughness={0.04}
      envMapIntensity={2.5}
      emissive={C.gold}
      emissiveIntensity={emissiveIntensity}
    />
  )
}

function SteelMat({ roughness = 0.16 }: { roughness?: number }) {
  return (
    <meshPhysicalMaterial
      color={C.steel}
      metalness={1}
      roughness={roughness}
      envMapIntensity={2}
    />
  )
}

function HourMarkers() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const mr = R * 0.8
        const x = Math.sin(angle) * mr
        const y = Math.cos(angle) * mr
        const isMain = i % 3 === 0
        return (
          <mesh key={i} position={[x, y, Z.MARKER + (isMain ? 0.022 : 0.013)]}>
            <boxGeometry args={isMain ? [0.095, 0.095, 0.044] : [0.054, 0.054, 0.026]} />
            <meshPhysicalMaterial
              color={C.gold}
              metalness={1}
              roughness={0.04}
              emissive={C.gold}
              emissiveIntensity={0.28}
              envMapIntensity={2.5}
            />
          </mesh>
        )
      })}
    </>
  )
}

function MinuteTrack() {
  return (
    <>
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const angle = (i / 60) * Math.PI * 2
        const mr = R * 0.9
        const x = Math.sin(angle) * mr
        const y = Math.cos(angle) * mr
        return (
          <mesh key={i} position={[x, y, Z.MARKER + 0.009]}>
            <boxGeometry args={[0.022, 0.022, 0.018]} />
            <meshPhysicalMaterial color={C.steel} metalness={1} roughness={0.3} />
          </mesh>
        )
      })}
    </>
  )
}

function WatchHands() {
  const hourRef = useRef<THREE.Group>(null)
  const minuteRef = useRef<THREE.Group>(null)
  const secondRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const now = new Date()
    const h = now.getHours() % 12
    const m = now.getMinutes()
    const s = now.getSeconds() + now.getMilliseconds() / 1000

    if (hourRef.current)
      hourRef.current.rotation.z = -((h + m / 60) / 12) * Math.PI * 2
    if (minuteRef.current)
      minuteRef.current.rotation.z = -(m / 60) * Math.PI * 2
    if (secondRef.current)
      secondRef.current.rotation.z = -(s / 60) * Math.PI * 2
  })

  return (
    <group position={[0, 0, Z.HAND]}>
      {/* Hour hand */}
      <group ref={hourRef}>
        <mesh position={[0, 0.23, 0]}>
          <boxGeometry args={[0.075, 0.42, 0.022]} />
          <GoldMat />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[0.052, 0.12, 0.022]} />
          <GoldMat />
        </mesh>
      </group>

      {/* Minute hand */}
      <group ref={minuteRef}>
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[0.048, 0.64, 0.019]} />
          <meshPhysicalMaterial
            color={C.steelBright}
            metalness={1}
            roughness={0.09}
            envMapIntensity={2}
          />
        </mesh>
      </group>

      {/* Second hand */}
      <group ref={secondRef}>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.016, 0.74, 0.014]} />
          <meshPhysicalMaterial
            color={C.red}
            metalness={1}
            roughness={0.05}
            emissive={C.red}
            emissiveIntensity={0.45}
          />
        </mesh>
        <mesh position={[0, -0.19, 0]}>
          <boxGeometry args={[0.016, 0.24, 0.014]} />
          <meshPhysicalMaterial
            color={C.red}
            metalness={1}
            roughness={0.05}
            emissive={C.red}
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>

      {/* Center hub disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.035, 16]} />
        <GoldMat emissiveIntensity={0.22} />
      </mesh>
      {/* Center pip */}
      <mesh position={[0, 0, 0.025]}>
        <circleGeometry args={[0.026, 12]} />
        <GoldMat emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function Crown() {
  return (
    <group position={[R + 0.2, 0, 0]}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.32, 14]} />
        <SteelMat roughness={0.24} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} rotation={[i * (Math.PI / 4), 0, 0]} position={[0.015, 0, 0]}>
          <boxGeometry args={[0.34, 0.22, 0.017]} />
          <meshPhysicalMaterial color="#888" metalness={1} roughness={0.42} />
        </mesh>
      ))}
      <mesh position={[0.185, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.082, 0.1, 0.038, 14]} />
        <GoldMat />
      </mesh>
    </group>
  )
}

function Strap() {
  const mat = (
    <meshPhysicalMaterial
      color={C.strap}
      roughness={0.84}
      metalness={0}
      envMapIntensity={0.12}
    />
  )

  return (
    <>
      {/* Upper strap */}
      <mesh position={[0, R + 1.0, -0.07]} receiveShadow castShadow>
        <boxGeometry args={[0.84, 1.4, 0.11]} />
        {mat}
      </mesh>
      <mesh position={[0, R + 1.85, -0.07]}>
        <boxGeometry args={[0.66, 0.28, 0.11]} />
        {mat}
      </mesh>

      {/* Lower strap */}
      <mesh position={[0, -(R + 0.88), -0.07]} receiveShadow castShadow>
        <boxGeometry args={[0.84, 1.36, 0.11]} />
        {mat}
      </mesh>

      {/* Buckle ring */}
      <mesh position={[0, -(R + 1.64), -0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.29, 0.025, 8, 28]} />
        <SteelMat roughness={0.18} />
      </mesh>
      {/* Buckle pin */}
      <mesh position={[0, -(R + 1.64), -0.07]}>
        <boxGeometry args={[0.64, 0.022, 0.022]} />
        <GoldMat />
      </mesh>

      {/* Lug bars */}
      {([R + 0.14, -(R + 0.14)] as number[]).map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.044, 0.044, 0.98, 10]} />
          <SteelMat roughness={0.14} />
        </mesh>
      ))}
    </>
  )
}

export default function WatchModel() {
  return (
    <group>
      {/* Main case cylinder (axis along Z after rotation) */}
      <mesh receiveShadow castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R, R, H, 72, 1]} />
        <SteelMat roughness={0.18} />
      </mesh>

      {/* Outer edge torus */}
      <mesh>
        <torusGeometry args={[R, 0.04, 14, 72]} />
        <meshPhysicalMaterial
          color={C.steelBright}
          metalness={1}
          roughness={0.09}
          envMapIntensity={2.2}
        />
      </mesh>

      {/* Bezel ring (gold) */}
      <mesh position={[0, 0, Z.BEZEL]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R + 0.065, R + 0.065, BZ_H, 72]} />
        <GoldMat emissiveIntensity={0.2} />
      </mesh>

      {/* Inner bezel taper */}
      <mesh position={[0, 0, Z.FRONT + 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R + 0.042, R - 0.045, 0.055, 72]} />
        <GoldMat />
      </mesh>

      {/* Dial face */}
      <mesh position={[0, 0, Z.DIAL]}>
        <circleGeometry args={[R - 0.14, 72]} />
        <meshPhysicalMaterial
          color={C.dial}
          roughness={0.86}
          metalness={0}
          envMapIntensity={0.18}
        />
      </mesh>

      {/* Subdial decorative ring */}
      <mesh position={[0, 0, Z.DIAL + 0.008]}>
        <torusGeometry args={[R * 0.52, 0.016, 6, 56]} />
        <GoldMat emissiveIntensity={0.18} />
      </mesh>

      {/* Guilloché concentric rings */}
      {([0.28, 0.42, 0.56, 0.7, 0.83] as number[]).map((scale, i) => (
        <mesh key={i} position={[0, 0, Z.DIAL + 0.003]}>
          <torusGeometry args={[(R - 0.14) * scale, 0.006, 4, 64]} />
          <meshPhysicalMaterial color="#e0dcd6" roughness={0.72} metalness={0} />
        </mesh>
      ))}

      <HourMarkers />
      <MinuteTrack />
      <WatchHands />

      {/* Sapphire crystal */}
      <mesh position={[0, 0, Z.CRYSTAL]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R - 0.06, R - 0.06, 0.034, 72]} />
        <meshPhysicalMaterial
          color="#f0f8ff"
          metalness={0}
          roughness={0}
          transmission={0.97}
          transparent
          opacity={0.09}
          ior={1.52}
          envMapIntensity={0.5}
          thickness={0.034}
        />
      </mesh>

      {/* Case back */}
      <mesh position={[0, 0, Z.BACK - 0.014]}>
        <circleGeometry args={[R - 0.05, 72]} />
        <meshPhysicalMaterial color="#888" metalness={1} roughness={0.32} envMapIntensity={1.2} />
      </mesh>

      <Crown />
      <Strap />
    </group>
  )
}
