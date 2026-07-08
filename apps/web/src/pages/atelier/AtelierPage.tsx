import { Suspense, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshReflectorMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CAPSULES, Capsule, Look, getActiveCapsule, setActiveCapsule } from '../../lib/atelier';
import { StudioHeader } from '../../components/layout/StudioHeader';

function DressForm() {
    const group = useRef<THREE.Group>(null);

    const bustGeometry = useMemo(() => {
        const pts: THREE.Vector2[] = [
            new THREE.Vector2(0.001, 3.02),
            new THREE.Vector2(0.055, 3.02),
            new THREE.Vector2(0.09, 2.84),
            new THREE.Vector2(0.3, 2.71),
            new THREE.Vector2(0.455, 2.57),
            new THREE.Vector2(0.485, 2.34),
            new THREE.Vector2(0.42, 2.04),
            new THREE.Vector2(0.335, 1.78),
            new THREE.Vector2(0.415, 1.5),
            new THREE.Vector2(0.455, 1.28),
            new THREE.Vector2(0.375, 1.13),
            new THREE.Vector2(0.001, 1.11),
        ];
        return new THREE.LatheGeometry(pts, 56);
    }, []);

    useFrame((state) => {
        if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.12;
    });

    return (
        <group ref={group}>
            <mesh geometry={bustGeometry} castShadow>
                <meshStandardMaterial color="#3A332A" roughness={0.5} metalness={0.25} />
            </mesh>
            <mesh geometry={bustGeometry} scale={1.012}>
                <meshBasicMaterial color="#C3A46E" wireframe transparent opacity={0.028} />
            </mesh>
            {/* stand */}
            <mesh position={[0, 0.62, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 1.05, 16]} />
                <meshStandardMaterial color="#C3A46E" roughness={0.35} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.42, 0.5, 0.05, 40]} />
                <meshStandardMaterial color="#1A1712" roughness={0.4} metalness={0.6} />
            </mesh>
        </group>
    );
}

function LookPanel({ look, index, total, hovered, selected, onHover, onSelect }: {
    look: Look;
    index: number;
    total: number;
    hovered: boolean;
    selected: boolean;
    onHover: (id: string | null) => void;
    onSelect: (id: string) => void;
}) {
    const group = useRef<THREE.Group>(null);

    const { position, rotationY } = useMemo(() => {
        const spread = Math.PI * 0.82;
        const angle = -spread / 2 + (index / (total - 1)) * spread;
        const radius = 3.4;
        return {
            position: new THREE.Vector3(Math.sin(angle) * radius, 1.45, Math.cos(angle) * radius),
            rotationY: angle + Math.PI,
        };
    }, [index, total]);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        const lift = hovered || selected ? 0.18 : 0;
        const targetY = position.y + Math.sin(t * 0.7 + index * 1.3) * 0.05 + lift;
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.08);
        const targetScale = hovered || selected ? 1.08 : 1;
        group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.1));
    });

    return (
        <group
            ref={group}
            position={position}
            rotation={[0, rotationY, 0]}
            onPointerOver={(e) => { e.stopPropagation(); onHover(look.id); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { e.stopPropagation(); onSelect(look.id); }}
        >
            {/* champagne hairline frame */}
            <mesh position={[0, 0, -0.012]}>
                <planeGeometry args={[1.16, 1.66]} />
                <meshBasicMaterial color={selected ? '#C3A46E' : '#3A342B'} />
            </mesh>
            <mesh position={[0, 0, -0.006]}>
                <planeGeometry args={[1.14, 1.64]} />
                <meshBasicMaterial color="#0C0B09" />
            </mesh>
            {/* fabric swatch */}
            <mesh>
                <planeGeometry args={[1.08, 1.58]} />
                <meshStandardMaterial color={look.colorHex} roughness={0.85} metalness={0.02} side={THREE.DoubleSide} />
            </mesh>
            {/* accent selvedge */}
            <mesh position={[0, -0.72, 0.005]}>
                <planeGeometry args={[1.08, 0.07]} />
                <meshStandardMaterial color={look.accentHex} roughness={0.7} />
            </mesh>
        </group>
    );
}

function Stage({ capsule, hoveredId, selectedId, onHover, onSelect }: {
    capsule: Capsule;
    hoveredId: string | null;
    selectedId: string | null;
    onHover: (id: string | null) => void;
    onSelect: (id: string) => void;
}) {
    return (
        <>
            <fog attach="fog" args={['#0C0B09', 7, 16]} />
            <ambientLight intensity={0.35} />
            <spotLight position={[3, 7, 4]} angle={0.5} penumbra={0.9} intensity={90} color="#F2E2C4" castShadow />
            <pointLight position={[-4, 2.5, -3]} intensity={14} color="#C3A46E" />
            <pointLight position={[0, 1.5, 5]} intensity={8} color="#EDE7DA" />

            <DressForm />

            {capsule.looks.map((look, i) => (
                <LookPanel
                    key={look.id}
                    look={look}
                    index={i}
                    total={capsule.looks.length}
                    hovered={hoveredId === look.id}
                    selected={selectedId === look.id}
                    onHover={onHover}
                    onSelect={onSelect}
                />
            ))}

            {/* runway floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <circleGeometry args={[9, 72]} />
                <MeshReflectorMaterial
                    blur={[280, 60]}
                    resolution={512}
                    mixBlur={0.9}
                    mixStrength={12}
                    roughness={0.9}
                    depthScale={1.1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.3}
                    color="#0E0D0B"
                    metalness={0.4}
                    mirror={0.5}
                />
            </mesh>

            <OrbitControls
                enablePan={false}
                minDistance={6}
                maxDistance={11}
                minPolarAngle={Math.PI / 3.2}
                maxPolarAngle={Math.PI / 2.05}
                autoRotate
                autoRotateSpeed={0.35}
                target={[0, 1.6, 0]}
            />

            <EffectComposer>
                <Bloom intensity={0.3} luminanceThreshold={0.78} luminanceSmoothing={0.3} mipmapBlur />
                <Vignette eskil={false} offset={0.25} darkness={0.75} />
            </EffectComposer>
        </>
    );
}

export default function AtelierPage() {
    const navigate = useNavigate();
    const [capsule, setCapsule] = useState<Capsule>(() => getActiveCapsule());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const activeLook = capsule.looks.find((l) => l.id === (hoveredId ?? selectedId)) ?? null;

    const switchCapsule = (c: Capsule) => {
        setCapsule(c);
        setActiveCapsule(c);
        setSelectedId(null);
        setHoveredId(null);
    };

    return (
        <div className="relative h-screen w-full bg-ink text-ivory overflow-hidden">
            <StudioHeader subtitle="Prova Odası — 3D Atölye" />

            <Canvas
                shadows
                dpr={[1, 1.75]}
                camera={{ position: [0, 2.4, 8.6], fov: 38 }}
                gl={{ antialias: true }}
                onCreated={({ gl }) => gl.setClearColor('#0C0B09')}
            >
                <Suspense fallback={null}>
                    <Stage
                        key={capsule.id}
                        capsule={capsule}
                        hoveredId={hoveredId}
                        selectedId={selectedId}
                        onHover={setHoveredId}
                        onSelect={(id) => setSelectedId((prev) => (prev === id ? null : id))}
                    />
                </Suspense>
            </Canvas>

            {/* capsule switcher */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex gap-1 border border-seam bg-ink/70 backdrop-blur-sm">
                {CAPSULES.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => switchCapsule(c)}
                        className={`px-4 md:px-6 py-2 text-[10px] tracking-luxe uppercase transition-colors ${
                            capsule.id === c.id ? 'bg-champagne text-ink' : 'text-taupe hover:text-ivory'
                        }`}
                    >
                        {c.title}
                    </button>
                ))}
            </div>

            {/* capsule card */}
            <div className="absolute bottom-6 left-5 md:left-10 z-30 max-w-sm bg-ink/75 backdrop-blur-sm border border-seam p-6">
                <p className="font-mono text-[10px] tracking-luxe text-champagne mb-2">{capsule.season} — {capsule.house}</p>
                <h2 className="font-display font-light text-3xl mb-3">{capsule.title}</h2>
                <p className="text-xs text-taupe leading-relaxed mb-4">{capsule.story}</p>
                <div className="flex items-center gap-2">
                    {capsule.palette.map((hex) => (
                        <span key={hex} className="w-6 h-6 border border-seam" style={{ background: hex }} title={hex} />
                    ))}
                </div>
            </div>

            {/* look detail */}
            <div className={`absolute bottom-6 right-5 md:right-10 z-30 w-64 border border-seam bg-ink/75 backdrop-blur-sm p-5 transition-opacity duration-300 ${activeLook ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {activeLook && (
                    <>
                        <p className="font-mono text-[10px] tracking-luxe text-champagne mb-1">LOOK {capsule.looks.findIndex((l) => l.id === activeLook.id) + 1} / {capsule.looks.length}</p>
                        <h3 className="font-display text-2xl mb-1">{activeLook.name}</h3>
                        <p className="text-xs text-ivory/80">{activeLook.category}</p>
                        <p className="font-mono text-[10px] text-taupe mt-2">{activeLook.fabric}</p>
                    </>
                )}
            </div>

            {/* defile CTA */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:block">
                <button
                    onClick={() => { setActiveCapsule(capsule); navigate('/defile'); }}
                    className="px-8 py-3 border border-champagne/60 text-champagne text-[10px] tracking-luxe uppercase hover:bg-champagne hover:text-ink transition-colors bg-ink/60 backdrop-blur-sm"
                >
                    Bu Kapsülü Defilede İzle →
                </button>
            </div>
        </div>
    );
}
