import React, { Suspense } from 'react'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Layout } from './Layout'
import { Chronosphere } from './Chronosphere'
import { CanvasLoader as Loader } from './Loader'

export function GiftModule() {
    return (
        <Layout
            cameraPosition={[5, 2, 5]}
            overlay={
                <div className="absolute top-20 w-full text-center pointer-events-none z-10">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-bounce drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                        One Last Surprise...
                    </h2>
                    <p className="text-white/70 mt-4 text-sm uppercase tracking-widest font-light">Click the box to open</p>
                </div>
            }
        >
            <PerspectiveCamera makeDefault position={[5, 2, 5]} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={-0.5} />

            {/* Override Layout background */}
            <color attach="background" args={['#050510']} /> {/* Darker Void */}

            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#ffaa00" />
            <pointLight position={[-5, -5, -5]} intensity={1} color="#0000ff" />

            {/* Background Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Chronosphere />
        </Layout>
    )
}


