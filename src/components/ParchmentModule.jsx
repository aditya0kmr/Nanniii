import React, { Suspense } from 'react'
import { Sparkles, PerspectiveCamera, Environment, OrbitControls, Stars } from '@react-three/drei'
import { Layout } from './Layout'
import { Capsule } from './Capsule'
import { CanvasLoader as Loader } from './Loader'

export function ParchmentModule() {
    return (
        <Layout
            cameraPosition={[0, 0, 6]} // Default camera for Parchment
            overlay={
                <div className="absolute bottom-10 w-full text-center pointer-events-none z-10">
                    <h2 className="text-2xl font-mono text-pink-400 tracking-[0.2em] uppercase opacity-90 drop-shadow-[0_0_15px_rgba(255,0,255,0.6)] animate-pulse border border-pink-500/50 px-4 py-2 bg-black/50 backdrop-blur-md">
                        // SECURE_DATA_LINK ESTABLISHED
                    </h2>
                </div>
            }
        >
            <PerspectiveCamera makeDefault position={[0, 0, 9]} />
            <OrbitControls enableZoom={false} enablePan={false} />

            {/* Background Stars (Pillars of Creation Vibe) */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#ff00cc" />
            <pointLight position={[-5, -5, 5]} intensity={1} color="#00ffff" />
            <Environment preset="city" />

            <Suspense fallback={<Loader />}>
                <group position={[-3.5, 0, 0]}>
                    <Capsule />
                </group>
            </Suspense>

            {/* Floating Particles/Dust */}
            <Sparkles
                count={300}
                scale={10}
                size={3}
                speed={0.4}
                opacity={0.7}
                color="#ffddaa"
            />
        </Layout>
    )
}


