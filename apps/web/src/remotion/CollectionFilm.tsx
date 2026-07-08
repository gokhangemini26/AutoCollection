import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { Capsule } from '../lib/atelier';

const INK = '#0C0B09';
const IVORY = '#EDE7DA';
const TAUPE = '#9C927F';
const CHAMPAGNE = '#C3A46E';

const DISPLAY = '"Cormorant Garamond", Georgia, serif';
const SANS = 'Manrope, system-ui, sans-serif';
const MONO = '"IBM Plex Mono", monospace';

export const FILM_FPS = 30;
export const filmDuration = (capsule: Capsule) =>
    75 + 75 + capsule.looks.length * 55 + 70 + 90;

function Intro() {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 25, 55, 75], [0, 1, 1, 0]);
    const spacing = interpolate(frame, [0, 70], [0.9, 0.42], { extrapolateRight: 'clamp' });
    return (
        <AbsoluteFill style={{ background: INK, justifyContent: 'center', alignItems: 'center', opacity }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 92, fontWeight: 300, color: IVORY, letterSpacing: `${spacing}em`, paddingLeft: `${spacing}em` }}>
                MAISON
            </div>
            <div style={{ fontFamily: MONO, fontSize: 15, color: TAUPE, letterSpacing: '0.5em', marginTop: 28, paddingLeft: '0.5em' }}>
                KOLEKSİYON FİLMİ
            </div>
        </AbsoluteFill>
    );
}

function SeasonCard({ capsule }: { capsule: Capsule }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const rise = spring({ frame, fps, config: { damping: 200 } });
    const thread = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const fade = interpolate(frame, [55, 75], [1, 0], { extrapolateLeft: 'clamp' });
    return (
        <AbsoluteFill style={{ background: INK, justifyContent: 'center', alignItems: 'center', opacity: fade }}>
            <div style={{ fontFamily: MONO, fontSize: 16, color: CHAMPAGNE, letterSpacing: '0.5em', marginBottom: 30, opacity: rise }}>
                {capsule.season}
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 130, fontWeight: 300, fontStyle: 'italic', color: IVORY, transform: `translateY(${(1 - rise) * 60}px)`, opacity: rise }}>
                {capsule.title}
            </div>
            <div style={{ width: 1, height: 110 * thread, background: CHAMPAGNE, marginTop: 34 }} />
        </AbsoluteFill>
    );
}

function LookScene({ capsule, index }: { capsule: Capsule; index: number }) {
    const look = capsule.looks[index];
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();
    const left = index % 2 === 0;
    const wipe = spring({ frame, fps, config: { damping: 100, stiffness: 60 } });
    const textIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });
    const fade = interpolate(frame, [45, 55], [1, 0], { extrapolateLeft: 'clamp' });

    const panelW = width * 0.44;

    return (
        <AbsoluteFill style={{ background: INK, opacity: fade, flexDirection: left ? 'row' : 'row-reverse' }}>
            <div style={{ width: panelW, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0, background: look.colorHex,
                    transform: `translateX(${(left ? -1 : 1) * (1 - wipe) * panelW}px)`,
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 26, background: look.accentHex,
                    transform: `translateX(${(left ? 1 : -1) * (1 - wipe) * panelW}px)`,
                }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 70px', opacity: textIn, transform: `translateY(${(1 - textIn) * 40}px)` }}>
                <div style={{ fontFamily: MONO, fontSize: 14, color: CHAMPAGNE, letterSpacing: '0.45em', marginBottom: 20 }}>
                    LOOK {String(index + 1).padStart(2, '0')} / {String(capsule.looks.length).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 84, fontWeight: 300, color: IVORY, lineHeight: 1.02 }}>
                    {look.name}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 24, color: IVORY, opacity: 0.85, marginTop: 18 }}>
                    {look.category}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 15, color: TAUPE, marginTop: 10, letterSpacing: '0.12em' }}>
                    {look.fabric}
                </div>
            </div>
        </AbsoluteFill>
    );
}

function PaletteScene({ capsule }: { capsule: Capsule }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const fade = interpolate(frame, [58, 70], [1, 0], { extrapolateLeft: 'clamp' });
    return (
        <AbsoluteFill style={{ background: INK, opacity: fade }}>
            <div style={{ position: 'absolute', top: 70, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 15, color: CHAMPAGNE, letterSpacing: '0.5em' }}>
                SEZON PALETİ
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end' }}>
                {capsule.palette.map((hex, i) => {
                    const h = spring({ frame: frame - i * 6, fps, config: { damping: 60, stiffness: 50 } });
                    return (
                        <div key={hex} style={{ flex: 1, height: `${h * 72}%`, background: hex, position: 'relative' }}>
                            <div style={{ position: 'absolute', top: -34, width: '100%', textAlign: 'center', fontFamily: MONO, fontSize: 13, color: TAUPE, opacity: h }}>
                                {hex.toUpperCase()}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
}

function Outro({ capsule }: { capsule: Capsule }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const inFade = spring({ frame, fps, config: { damping: 200 } });
    const endFade = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: 'clamp' });
    return (
        <AbsoluteFill style={{ background: INK, justifyContent: 'center', alignItems: 'center', opacity: endFade, padding: '0 140px' }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 300, fontStyle: 'italic', color: IVORY, textAlign: 'center', lineHeight: 1.5, opacity: inFade }}>
                “{capsule.story}”
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 30, color: CHAMPAGNE, letterSpacing: '0.4em', marginTop: 60, paddingLeft: '0.4em', opacity: inFade }}>
                MAISON
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: TAUPE, letterSpacing: '0.4em', marginTop: 14, opacity: inFade }}>
                {capsule.season} — {capsule.title.toUpperCase()}
            </div>
        </AbsoluteFill>
    );
}

export const CollectionFilm: React.FC<{ capsule: Capsule }> = ({ capsule }) => {
    const lookStart = 150;
    return (
        <AbsoluteFill style={{ background: INK }}>
            <Sequence durationInFrames={75}>
                <Intro />
            </Sequence>
            <Sequence from={75} durationInFrames={75}>
                <SeasonCard capsule={capsule} />
            </Sequence>
            {capsule.looks.map((look, i) => (
                <Sequence key={look.id} from={lookStart + i * 55} durationInFrames={55}>
                    <LookScene capsule={capsule} index={i} />
                </Sequence>
            ))}
            <Sequence from={lookStart + capsule.looks.length * 55} durationInFrames={70}>
                <PaletteScene capsule={capsule} />
            </Sequence>
            <Sequence from={lookStart + capsule.looks.length * 55 + 70} durationInFrames={90}>
                <Outro capsule={capsule} />
            </Sequence>
        </AbsoluteFill>
    );
};

export default CollectionFilm;
