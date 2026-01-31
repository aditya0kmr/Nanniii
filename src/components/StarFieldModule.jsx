import React, { Suspense, useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars, Environment, Float, Sparkles, Line } from '@react-three/drei'
import { Layout } from './Layout'
import { MemoryOrb } from './MemoryOrb'
import * as THREE from 'three'

// Data for compliments
const COMPLIMENTS = [
    "You are made of star stuff.",
    "Your kindness ripples forever.",
    "A beautiful memory.",
    "Nebula song.",
    "Bigger heart.",
    "Color in darkness.",
    "Thank you."
]

// Heart Shape Coordinates (approximate)
const CONSTELLATION_POINTS = [
    { pos: [0, -2, 0], text: "You are the center of my universe." }, // Bottom Tip
    { pos: [-2, 1, 0], text: "Your kindness is infinite." }, // Left Low
    { pos: [2, 1, 0], text: "You shine brighter than Sirius." }, // Right Low
    { pos: [-3, 3, 0], text: "Your laugh is my favorite song." }, // Left High
    { pos: [3, 3, 0], text: "You inspire everyone around you." }, // Right High
    { pos: [-1, 4, 0], text: "A truly beautiful soul." }, // Left Center Top
    { pos: [1, 4, 0], text: "Happy Birthday, Nandini." } // Right Center Top
]

function ConstellationLines() {
    // Draw lines connecting the heart to make it look like a constellation map
    const points = CONSTELLATION_POINTS.map(p => new THREE.Vector3(...p.pos))
    const lineGeometry = useMemo(() => {
        // Simple loop or explicit connections? Let's connect closer neighbors.
        // Or just a loop for simplicity.
        return points
    }, [points])

    return (
        <group>
            {/* Outline */}
            <Line points={points} color="#44aaff" opacity={0.3} transparent lineWidth={1} />
            {/* Central connections to tip */}
            <Line points={[points[0], points[1]]} color="#44aaff" opacity={0.2} transparent lineWidth={1} />
            <Line points={[points[0], points[2]]} color="#44aaff" opacity={0.2} transparent lineWidth={1} />
        </group>
    )
}

// Background Nebula Effect (using Sparkles instead of Cloud for stability)
function BackgroundNebula() {
    return (
        <group>
            <Sparkles count={200} scale={30} size={6} speed={0.1} opacity={0.3} color="#4400ff" position={[-10, 5, -20]} />
            <Sparkles count={200} scale={30} size={6} speed={0.1} opacity={0.3} color="#00ffff" position={[10, -5, -20]} />
            <Sparkles count={150} scale={25} size={5} speed={0.05} opacity={0.2} color="#ff00aa" position={[0, 10, -15]} />
        </group>
    )
}

export function StarFieldModule() {
    return (
        <Layout
            cameraPosition={[0, 0, 14]}
            title={
                <div>
                    <h2 className="text-4xl text-white font-light tracking-[0.2em] opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        Memory Nebula
                    </h2>
                    <p className="text-sm text-cyan-200/80 mt-2 uppercase tracking-[0.1em]">
                        Connect the stars (Pop the orbs)
                    </p>
                </div>
            }
        >
            <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={50} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.5}
                autoRotate
                autoRotateSpeed={0.2}
            />

            {/* Deep Space Atmosphere */}
            <color attach="background" args={['#000005']} />
            <ambientLight intensity={0.5} color="#001133" />
            <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={0.5} />
            <BackgroundNebula />

            {/* Floating Glitter */}
            <Sparkles count={300} scale={15} size={3} speed={0.2} opacity={0.5} color="#ffffff" />

            {/* THE CONSTELLATION */}
            <group>
                <ConstellationLines />
                {CONSTELLATION_POINTS.map((pt, i) => (
                    <MemoryOrb
                        key={i}
                        position={pt.pos}
                        text={pt.text}
                    />
                ))}
            </group>

            {/* Environmental Fog */}
            <fog attach="fog" args={['#000005', 10, 30]} />
        </Layout>
    )
}


