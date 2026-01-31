import React from 'react'
import { Stars, PerspectiveCamera, OrbitControls, Sparkles } from '@react-three/drei'
import { Layout } from './Layout'
import { PolaroidGalleryLogic } from './PolaroidGallery'

export function HelixGalleryModule() {
    return (
        <Layout
            cameraPosition={[0, 0, 12]}
            title={
                <div>
                    <h2 className="text-xl font-light text-pink-300 tracking-[0.2em] uppercase opacity-80 drop-shadow-[0_0_8px_rgba(255,100,150,0.5)]">
                        Floating Memories
                    </h2>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">Click a photo to focus</p>
                </div>
            }
        >
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-5, -5, 5]} intensity={0.4} color="#ffd4e5" />

            {/* The Polaroid Gallery */}
            <PolaroidGalleryLogic />

            {/* Background Stars */}
            <Stars radius={80} depth={50} count={1500} factor={4} saturation={0.3} fade speed={0.3} />

            {/* Camera Controls */}
            <OrbitControls
                enableZoom={true}
                minDistance={6}
                maxDistance={20}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.4}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 3}
            />
        </Layout>
    )
}

export default HelixGalleryModule
