import React, { useState, useMemo, useRef } from 'react'
import { Html, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { compliments } from '../data/compliments'

function InteractiveStar({ position, message, color = "#ffeeaa" }) {
    const [hovered, setHover] = useState(false)
    const meshRef = useRef()

    // Randomize initial phase for twinkling
    // eslint-disable-next-line
    const [phase] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        if (meshRef.current) {
            // Twinkle effect
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + phase) * 0.2
            meshRef.current.scale.setScalar(hovered ? scale * 2 : scale)

            // Gentle rotation
            meshRef.current.rotation.z += 0.01
        }
    })

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh
                    ref={meshRef}
                    onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
                    onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
                >
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial
                        color={hovered ? "#ff0088" : color}
                        emissive={hovered ? "#ff0088" : color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                    />
                </mesh>

                {hovered && (
                    <group position={[0, 0.4, 0]}>
                        <Html center zIndexRange={[100, 0]}>
                            <div className="pointer-events-none px-3 py-2 bg-black/80 text-white rounded-lg border border-pink-500/50 shadow-[0_0_15px_rgba(255,0,136,0.5)] backdrop-blur-md w-48 text-center transition-all duration-300 transform scale-100 opacity-100">
                                <p className="text-sm font-medium leading-tight">{message}</p>
                            </div>
                        </Html>
                    </group>
                )}
            </Float>
        </group>
    )
}

export function ComplimentStars() {
    // Generate random positions for the stars in a cloud
    const [stars] = useState(() => {
        return compliments.map((msg, i) => {
            const x = (Math.random() - 0.5) * 15
            const y = (Math.random() - 0.5) * 10
            const z = (Math.random() - 0.5) * 10
            return { id: i, pos: [x, y, z], msg }
        })
    })

    return (
        <group>
            {stars.map((star) => (
                <InteractiveStar key={star.id} position={star.pos} message={star.msg} />
            ))}
        </group>
    )
}
