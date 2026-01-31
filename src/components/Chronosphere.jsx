import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Sparkles, Trail, Html } from '@react-three/drei'
import * as THREE from 'three'

// --- VISUALS: The Gyroscopic Rings ---
function GyroRing({ radius, axis, speed, isStabilized, color }) {
    const ref = useRef()

    useFrame((state, delta) => {
        if (ref.current) {
            // Chaos vs Order
            // If stabilized, slow down and align to 0. If chaos, spin wildly.
            const targetSpeed = isStabilized ? 0.2 : speed

            ref.current.rotation.x += axis[0] * targetSpeed * delta
            ref.current.rotation.y += axis[1] * targetSpeed * delta
            ref.current.rotation.z += axis[2] * targetSpeed * delta

            // If stabilized, we could lerp rotation to a specific angle, but slowing down is a good enough "stabilize" feel.
        }
    })

    return (
        <group ref={ref}>
            <Trail width={2} length={4} color={color} attenuation={(t) => t * t}>
                <mesh>
                    <torusGeometry args={[radius, 0.08, 16, 100]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={isStabilized ? 2 : 0.5}
                        metalness={1}
                        roughness={0.1}
                    />
                </mesh>
            </Trail>
            {/* Tech Details on Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.02, 16, 32]} />
                <meshBasicMaterial color="white" transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

function Supernova({ isExploding }) {
    // Explosion particles
    const particles = useMemo(() => {
        return new Array(150).fill().map(() => ({
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(Math.random() * 5 + 2),
            color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.6, 1, 0.6), // Gold/Blue scale
            scale: Math.random() * 0.5
        }))
    }, [])

    const group = useRef()

    useFrame((_, delta) => {
        if (isExploding && group.current) {
            group.current.children.forEach((child, i) => {
                const p = particles[i]
                if (p) {
                    child.position.addScaledVector(p.velocity, delta * 3)
                    // Drag
                    p.velocity.multiplyScalar(0.95)
                    child.scale.setScalar(p.scale * (1.0 - (child.position.length() / 20))) // Fade out by distance
                }
            })
        }
    })

    if (!isExploding) return null

    return (
        <group ref={group}>
            {particles.map((p, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color={p.color} toneMapped={false} />
                </mesh>
            ))}
            {/* Shockwave */}
            <mesh>
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshBasicMaterial color="#ffaa00" transparent opacity={0.5} side={THREE.BackSide} />
            </mesh>
        </group>
    )
}

export function Chronosphere() {
    const [charge, setCharge] = useState(0)
    const [isStabilized, setIsStabilized] = useState(false)
    const [hasExploded, setHasExploded] = useState(false)
    const [showGift, setShowGift] = useState(false)

    const coreRef = useRef()
    const containerRef = useRef()

    // Interaction Handlers
    const handlePointerDown = () => setIsStabilized(true)
    const handlePointerUp = () => setIsStabilized(false)
    // Also support hover for "finding frequency" feel? Let's stick to Click/Hold for "Stabilize"

    useFrame((state, delta) => {
        if (hasExploded) {
            // Post-explosion logic
            if (containerRef.current) {
                containerRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 2) // Shrink artifact
            }
            return
        }

        // 1. Charge Logic
        if (isStabilized) {
            setCharge(prev => Math.min(prev + delta * 0.5, 1.2)) // Charge up to > 1 to trigger
        } else {
            setCharge(prev => Math.max(prev - delta * 0.5, 0)) // Decay
        }

        // 2. Trigger Explosion
        if (charge >= 1 && !hasExploded) {
            setHasExploded(true)
            setTimeout(() => setShowGift(true), 500) // Delay gift reveal slightly after explosion
        }

        // 3. Shake/Vibration based on charge
        if (containerRef.current) {
            const shake = charge * 0.05
            containerRef.current.position.set(
                (Math.random() - 0.5) * shake,
                (Math.random() - 0.5) * shake,
                (Math.random() - 0.5) * shake
            )
        }

        // 4. Core Pulsing (Singularity)
        if (coreRef.current) {
            // Scale and Color shift
            const s = 1 + charge * 0.5
            coreRef.current.scale.setScalar(s)

            // Spin core
            coreRef.current.rotation.y += delta * (1 + charge * 5)
        }
    })

    return (
        <group>
            {/* --- THE ARTIFACT --- */}
            <group
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                {!hasExploded && (
                    <group>
                        {/* Ring 1 (Outer) */}
                        <GyroRing radius={2} axis={[1, 0.5, 0]} speed={2} isStabilized={isStabilized} color="#ffaa00" />
                        {/* Ring 2 (Middle) */}
                        <GyroRing radius={1.6} axis={[0, 1, 0.5]} speed={-3} isStabilized={isStabilized} color="#00ffff" />
                        {/* Ring 3 (Inner) */}
                        <GyroRing radius={1.2} axis={[0.5, 0, 1]} speed={4} isStabilized={isStabilized} color="#ff00ff" />

                        {/* Singularity Core */}
                        <mesh ref={coreRef}>
                            <sphereGeometry args={[0.8, 32, 32]} />
                            <meshStandardMaterial
                                color="black"
                                roughness={0}
                                metalness={1}
                                emissive={isStabilized ? "#ffaa00" : "#000000"} // Glows when stabilizing
                                emissiveIntensity={charge * 5}
                            />
                        </mesh>

                        {/* Core Light */}
                        <pointLight intensity={2 + charge * 10} distance={5} color={isStabilized ? "#ffaa00" : "#ffffff"} />
                    </group>
                )}
            </group>

            {/* --- EXPLOSION --- */}
            <Supernova isExploding={hasExploded} />

            {/* --- THE REVEAL (Final Gift) --- */}
            {showGift && (
                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2} position={[0, 0, 0]}>
                    <group scale={0}>
                        {/* We animate scale up in a real implementation, for now let's just snap it or use a simple useFrame if needed. 
                             Actually, let's just render it fully size but fade in? 
                             Simple scale lerp via a sub-component or inline logic would be best.
                         */}
                        <RevealedGift />
                    </group>
                </Float>
            )}
            {showGift && <RevealedGiftWrapper />}

            {/* --- UI HINT --- */}
            {!hasExploded && !isStabilized && (
                <Html position={[0, -3, 0]} center>
                    <div className="text-amber-400 font-mono text-xs tracking-[0.3em] uppercase opacity-70 animate-pulse">
                        Hold to Stabilize
                    </div>
                </Html>
            )}

            {/* Progress Bar for Stabilization */}
            {isStabilized && !hasExploded && (
                <Html position={[0, 3, 0]} center>
                    <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden border border-amber-500/50">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-white transition-all duration-75 ease-linear"
                            style={{ width: `${Math.min(charge * 100, 100)}%` }}
                        />
                    </div>
                </Html>
            )}
        </group>
    )
}

function RevealedGiftWrapper() {
    const ref = useRef()
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2)
        }
    })
    return (
        <group ref={ref} scale={[0, 0, 0]}>
            <RevealedGift />
        </group>
    )
}

function RevealedGift() {
    return (
        <group>
            {/* The Text forged from stars - Now Gold & Glowing */}
            <Text
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
                fontSize={0.8}
                letterSpacing={0.1}
                textAlign="center"
                anchorY="bottom"
                position={[0, 0.5, 0]}
            >
                HAPPY BIRTHDAY
                <meshStandardMaterial
                    color="#ffD700" // Gold
                    emissive="#ffaa00"
                    emissiveIntensity={0.8}
                    metalness={1}
                    roughness={0.2}
                />
            </Text>
            <Text
                fontSize={0.5}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff"
                textAlign="center"
                anchorY="top"
                position={[0, -0.3, 0]}
            >
                Nandini
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.1}
                />
            </Text>

            {/* Elegant Particle Dust instead of chunky shapes */}
            <Sparkles count={200} scale={6} size={2} speed={0.4} opacity={0.6} color="#ffD700" />

            {/* Central Light Burst */}
            <pointLight intensity={3} color="#ffaa00" distance={15} decay={2} />
        </group>
    )
}
