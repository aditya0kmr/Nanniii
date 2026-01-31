import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Cylinder, Torus, Html, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export function Capsule() {
    const group = useRef()
    const topShell = useRef()
    const bottomShell = useRef()
    const coreRef = useRef()
    const beamRef = useRef()

    // Interaction States
    const [isOpen, setIsOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Typewriter State
    const fullMessage = `
    // INCOMING TRANSMISSION //
    // RE: BIRTHDAY PROTOCOL //

    Dearest Nanniii,

    As you complete another orbital rotation,
    data analysis indicates maximum joy levels.

    Each star in this sector represents a
    shared memory file. Access them often.

    Your mission objectives for this cycle:
    1. Explore unknown sectors.
    2. Maintain high wonder levels.
    3. Accept maximizing love inputs.

    Status: HAPPINESS_OPTIMAL
    
    // END TRANSMISSION //
    - Aadi
    `
    const [displayedText, setDisplayedText] = useState("")

    // Animation Refs
    const openProgress = useRef(0)
    const beamProgress = useRef(0)

    // Typewriter Effect
    useEffect(() => {
        let timeout
        if (isOpen) {
            let currentIndex = 0
            setDisplayedText("") // Reset

            // Fast typing loop
            const typeChar = () => {
                if (currentIndex < fullMessage.length) {
                    setDisplayedText(fullMessage.substring(0, currentIndex + 1) + "█") // Add cursor
                    currentIndex++
                    // Randomized typing speed for realism (20-50ms)
                    timeout = setTimeout(typeChar, Math.random() * 30 + 20)
                } else {
                    setDisplayedText(fullMessage) // Finish without cursor
                }
            }
            // Delay start slightly to allow beam to shoot out
            timeout = setTimeout(typeChar, 500)
        } else {
            setDisplayedText("")
        }
        return () => clearTimeout(timeout)
    }, [isOpen])

    useFrame((state, delta) => {
        // 1. Rotation Logic
        if (group.current) {
            if (!isOpen) {
                // Idle Spin (Random Angle)
                group.current.rotation.y += delta * (isHovered ? 2 : 0.5)
                group.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
            } else {
                // LOCK TO FRONT (Presentation Mode)
                // Smoothly rotate to y=0 (or slight angle) so beam always shoots Right

                // Normalize rotation to -PI..PI
                const currentY = group.current.rotation.y % (Math.PI * 2)
                const targetY = 0 // Face forward/right

                // Simple easing
                const diff = targetY - currentY
                // Handle wrap-around for shortest path
                let shortestDiff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI

                group.current.rotation.y += shortestDiff * delta * 4

                // Smoothly straighten Z wobble
                group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 4)
            }
        }

        // 2. Opening Animation (Smooth Lerp)
        const targetOpen = isOpen ? 1 : 0
        openProgress.current = THREE.MathUtils.lerp(openProgress.current, targetOpen, delta * 3)
        // Beam follows opening but slightly delayed/snappier
        const targetBeam = isOpen ? 1 : 0
        beamProgress.current = THREE.MathUtils.lerp(beamProgress.current, targetBeam, delta * 5)

        if (topShell.current && bottomShell.current) {
            // Slide shells apart
            topShell.current.position.y = 1 + openProgress.current * 1.5
            bottomShell.current.position.y = -1 - openProgress.current * 1.5
        }

        // 3. Core Pulse & Spin
        if (coreRef.current) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.1
            coreRef.current.scale.setScalar(0.8 + openProgress.current * 0.5 * pulse)
            // Core spins independently when open
            coreRef.current.rotation.y -= delta * 2
        }

        // 4. Beam Expansion Animation
        if (beamRef.current) {
            // Scale Y because cylinder is Y-aligned, expanding outward
            beamRef.current.scale.y = beamProgress.current
            beamRef.current.visible = beamProgress.current > 0.01
        }
    })

    return (
        <group ref={group}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setIsHovered(true) }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setIsHovered(false) }}
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
        >
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>

                {/* --- CAPSULE SHELL --- */}

                {/* Top Half */}
                <group ref={topShell} position={[0, 1, 0]}>
                    <Cylinder args={[1, 1, 2.5, 32, 1, true]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
                    </Cylinder>
                    {/* Glowing Ring Top */}
                    <Torus args={[1.05, 0.05, 16, 32]} position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
                    </Torus>
                    {/* Cap */}
                    <mesh position={[0, 1.25, 0]}>
                        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
                    </mesh>
                </group>

                {/* Bottom Half */}
                <group ref={bottomShell} position={[0, -1, 0]}>
                    <Cylinder args={[1, 1, 2.5, 32, 1, true]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.2} side={THREE.DoubleSide} />
                    </Cylinder>
                    {/* Glowing Ring Bottom */}
                    <Torus args={[1.05, 0.05, 16, 32]} position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} toneMapped={false} />
                    </Torus>
                    {/* Cap */}
                    <mesh position={[0, -1.25, 0]} rotation={[Math.PI, 0, 0]}>
                        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
                    </mesh>
                </group>

                {/* --- INNER CORE (The Prize) --- */}
                <group ref={coreRef}>
                    <mesh>
                        <icosahedronGeometry args={[0.8, 1]} />
                        <meshStandardMaterial
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={1}
                            wireframe
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                    <mesh scale={0.6}>
                        <dodecahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                    </mesh>
                    <Sparkles count={50} scale={2} size={2} speed={1} color="#afff00" />
                </group>

                {/* --- HOLOGRAPHIC PROJECTION --- */}
                <group position={[2.8, 0, 0]}>
                    {/* 1. The Light Beam (Cone) - Animated Scale */}
                    <mesh ref={beamRef} position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        {/* args: [topRadius, bottomRadius, height, segments, openEnded] */}
                        {/* Slightly wider beam for text */}
                        <cylinderGeometry args={[0.1, 4.2, 6, 32, 1, true]} />
                        <meshBasicMaterial
                            color="#00ffff"
                            transparent
                            opacity={0.08}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* 2. The Holographic Text - Typewrited */}
                    {isOpen && (
                        <Text
                            fontSize={0.2}
                            maxWidth={3.8}
                            lineHeight={1.5}
                            letterSpacing={0.05}
                            textAlign="left"
                            anchorX="left"
                            anchorY="middle"
                            position={[-0.8, 0, 0]} // Aligned cleanly inside beam
                        >
                            {displayedText}
                            <meshStandardMaterial
                                color="#ffffff"
                                emissive="#00ffff"
                                emissiveIntensity={1.5}
                                toneMapped={false}
                                side={THREE.DoubleSide}
                            />
                        </Text>
                    )}

                    {/* 3. Floating Particles in Beam - Only visible when open */}
                    {isOpen && (
                        <Sparkles count={60} scale={[5, 4, 2]} size={4} speed={0.8} opacity={0.6} color="#00ffff" position={[2, 0, 0]} />
                    )}
                </group>

                {/* --- CLICK INDICATOR --- */}
                {!isOpen && (
                    <Html position={[0, -2.5, 0]} center>
                        <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse pointer-events-none bg-black/50 px-2 py-1 border border-cyan-500/30 whitespace-nowrap drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
                            CLICK TO ACCESS
                        </div>
                    </Html>
                )}

            </Float>
        </group>
    )
}
