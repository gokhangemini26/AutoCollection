import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VERT = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
varying vec3 vWorldPos;
varying vec2 vUv;

float wave(vec2 p, float t) {
    float w = 0.0;
    w += 0.42 * sin(p.x * 0.9 + t * 0.55) * cos(p.y * 0.7 + t * 0.35);
    w += 0.22 * sin(p.x * 1.9 - t * 0.42 + p.y * 1.1);
    w += 0.12 * sin(p.x * 3.4 + t * 0.8) * sin(p.y * 2.6 - t * 0.5);
    w += 0.05 * sin(p.x * 7.0 - t * 1.1 + p.y * 5.0);
    return w;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    float t = uTime;
    pos.z += wave(pos.xy, t);
    float dPointer = distance(uv, uPointer);
    pos.z += 0.35 * exp(-dPointer * 5.0) * sin(t * 1.4);
    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uSheen;
uniform float uTime;
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {
    vec3 dx = dFdx(vWorldPos);
    vec3 dy = dFdy(vWorldPos);
    vec3 n = normalize(cross(dx, dy));
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - abs(dot(n, viewDir)), 2.2);
    vec3 lightDir = normalize(vec3(0.4, 0.9, 0.35));
    float diff = clamp(dot(n, lightDir), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(-lightDir, n), viewDir), 0.0, 1.0), 24.0);

    vec3 col = uDeep;
    col = mix(col, uMid, diff * 0.55);
    col = mix(col, uSheen, spec * 0.65 + fres * 0.35);

    // weave grain
    float grain = fract(sin(dot(vUv * 800.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.025;

    // vignette toward edges so the cloth dissolves into ink
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x)
               * smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    col = mix(uDeep * 0.7, col, edge);

    gl_FragColor = vec4(col, 1.0);
}
`;

function SilkCloth() {
    const mat = useRef<THREE.ShaderMaterial>(null);
    const pointer = useRef(new THREE.Vector2(0.5, 0.5));
    const { size } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uDeep: { value: new THREE.Color('#0C0B09') },
        uMid: { value: new THREE.Color('#3A342B') },
        uSheen: { value: new THREE.Color('#C3A46E') },
    }), []);

    useFrame((state) => {
        if (!mat.current) return;
        mat.current.uniforms.uTime.value = state.clock.elapsedTime;
        pointer.current.lerp(
            new THREE.Vector2(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5),
            0.04,
        );
        mat.current.uniforms.uPointer.value.copy(pointer.current);
    });

    const scale = Math.max(1, size.width / 900);

    return (
        <mesh rotation={[-Math.PI / 2.6, 0, -0.25]} position={[0, -0.6, 0]} scale={scale}>
            <planeGeometry args={[14, 9, 180, 120]} />
            <shaderMaterial ref={mat} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
        </mesh>
    );
}

export function SilkCanvas({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas
                dpr={[1, 1.75]}
                camera={{ position: [0, 1.6, 5.2], fov: 42 }}
                gl={{ antialias: true, alpha: false }}
                onCreated={({ gl }) => gl.setClearColor('#0C0B09')}
            >
                <SilkCloth />
            </Canvas>
        </div>
    );
}

export default SilkCanvas;
