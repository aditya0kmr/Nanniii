import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { useLocation } from 'wouter'
import { CanvasLoader } from './Loader'
import { HoloButton } from './UI/HoloButton'

// Cinematic Transition Overlay
function TransitionOverlay() {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const t = setTimeout(() => setVisible(false), 1000)
        return () => clearTimeout(t)
    }, [])

    if (!visible) return null

    return (
        <div
            className={`fixed inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-1000 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
        />
    )
}

export function Layout({ children, cameraPosition = [0, 0, 10], showBackButton = true, title = null, overlay = null }) {
    const [, setLocation] = useLocation()

    return (
        <div className="w-full h-full relative bg-black">
            {/* Cinematic Entrance Fade */}
            <TransitionOverlay />

            {/* UI Overlay */}
            {showBackButton && (
                <div className="absolute top-4 left-4 z-50">
                    <HoloButton onClick={() => setLocation('/')}>
                        ← Return to Hub
                    </HoloButton>
                </div>
            )}

            {title && (
                <div className="absolute top-8 right-8 text-right pointer-events-none z-10 hidden md:block">
                    {title}
                </div>
            )}

            <Canvas dpr={[1, 2]} camera={{ position: cameraPosition, fov: 60 }}>
                <Suspense fallback={<CanvasLoader />}>
                    <color attach="background" args={['#020205']} />
                    <fog attach="fog" args={['#020205', 10, 50]} />

                    {/* Default Lighting - can be supplemented by children */}
                    <ambientLight intensity={0.4} />

                    {children}

                    {/* Shared Post Processing */}
                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.2} radius={0.5} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        <Noise opacity={0.03} />
                    </EffectComposer>
                </Suspense>
            </Canvas>

            {/* Custom Overlay (Title/Instructions for Modules) */}
            {overlay && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {overlay}
                </div>
            )}
        </div>
    )
}
