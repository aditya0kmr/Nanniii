/* eslint-disable react/no-unknown-property */
import React, { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'

// ═══════════════════════════════════════════════════════════════════════════
// CONFETTI EXPLOSION
// ═══════════════════════════════════════════════════════════════════════════
function Confetti({ isExploding }) {
    const count = 200
    const [particles] = useState(() => {
        return new Array(count).fill().map(() => ({
            position: new THREE.Vector3((Math.random() - 0.5) * 1, 0, (Math.random() - 0.5) * 1),
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.3, Math.random() * 0.4 + 0.1, (Math.random() - 0.5) * 0.3),
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
            scale: Math.random() * 0.5 + 0.5,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
        }))
    })

    const groupRef = useRef()

    useFrame((_, delta) => {
        if (isExploding && groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const p = particles[i]
                child.position.add(p.velocity)
                child.rotation.x += p.rotation[0] * delta * 2
                child.rotation.y += p.rotation[1] * delta * 2
                p.velocity.y -= 0.005
                p.velocity.multiplyScalar(0.99)
            })
        }
    })

    if (!isExploding) return null

    return (
        <group ref={groupRef} position={[0, 1, 0]}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.position} scale={p.scale}>
                    <planeGeometry args={[0.05, 0.05]} />
                    <meshBasicMaterial color={p.color} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
            ))}
        </group>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// SURPRISE 1: CRYSTAL HEART
// ═══════════════════════════════════════════════════════════════════════════
function CrystalHeart() {
    const heartRef = useRef()

    useFrame((state) => {
        if (heartRef.current) {
            heartRef.current.rotation.y += 0.01
            heartRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05)
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5} position={[0, 1.5, 0]}>
            <group ref={heartRef}>
                {/* Heart shape using spheres */}
                <mesh position={[-0.25, 0.2, 0]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#ff1493"
                        emissive="#ff0066"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                        roughness={0.1}
                        metalness={0.3}
                        clearcoat={1}
                    />
                </mesh>
                <mesh position={[0.25, 0.2, 0]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#ff1493"
                        emissive="#ff0066"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                        roughness={0.1}
                        metalness={0.3}
                        clearcoat={1}
                    />
                </mesh>
                <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <boxGeometry args={[0.55, 0.55, 0.4]} />
                    <meshPhysicalMaterial
                        color="#ff1493"
                        emissive="#ff0066"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                        roughness={0.1}
                        metalness={0.3}
                        clearcoat={1}
                    />
                </mesh>
                <pointLight position={[0, 0, 1]} intensity={2} color="#ff1493" distance={5} />
            </group>
            <Text
                position={[0, 1.2, 0]}
                fontSize={0.25}
                color="#ffffff"
                outlineWidth={0.02}
                outlineColor="#ff0088"
                textAlign="center"
                anchorX="center"
            >
                My heart belongs to you,{'\n'}forever. 💕
            </Text>
            <Sparkles count={80} scale={4} size={5} speed={0.5} opacity={1} color="#ff69b4" />
        </Float>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// SURPRISE 2: PROMISE RING
// ═══════════════════════════════════════════════════════════════════════════
function PromiseRing() {
    const ringRef = useRef()
    const boxRef = useRef()

    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.y += 0.02
        }
        if (boxRef.current) {
            boxRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 1.5, 0]}>
            {/* Velvet Box */}
            <group ref={boxRef}>
                <mesh position={[0, -0.3, 0]}>
                    <boxGeometry args={[1, 0.4, 0.8]} />
                    <meshPhysicalMaterial color="#1a0a2e" roughness={0.9} />
                </mesh>
                {/* Velvet interior */}
                <mesh position={[0, -0.05, 0]}>
                    <boxGeometry args={[0.9, 0.3, 0.7]} />
                    <meshPhysicalMaterial color="#2d1b4e" roughness={1} />
                </mesh>
            </group>

            {/* Ring */}
            <group ref={ringRef} position={[0, 0.3, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.25, 0.05, 32, 64]} />
                    <meshPhysicalMaterial
                        color="#ffd700"
                        emissive="#ffaa00"
                        emissiveIntensity={0.3}
                        metalness={1}
                        roughness={0.1}
                        clearcoat={1}
                    />
                </mesh>
                {/* Diamond */}
                <mesh position={[0, 0.15, 0]}>
                    <octahedronGeometry args={[0.12, 0]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        emissive="#00ffff"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.9}
                        metalness={0.2}
                        roughness={0}
                        clearcoat={1}
                    />
                </mesh>
                <pointLight position={[0, 0.3, 0]} intensity={3} color="#ffffff" distance={3} />
            </group>

            <Text
                position={[0, 1.2, 0]}
                fontSize={0.22}
                color="#ffffff"
                outlineWidth={0.02}
                outlineColor="#ffd700"
                textAlign="center"
                anchorX="center"
            >
                One day, this will be real. 💍
            </Text>
            <Sparkles count={60} scale={3} size={4} speed={0.4} opacity={1} color="#ffd700" />
        </Float>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// SURPRISE 3: ETERNAL ROSE
// ═══════════════════════════════════════════════════════════════════════════
function EternalRose() {
    const roseRef = useRef()

    useFrame((state) => {
        if (roseRef.current) {
            roseRef.current.rotation.y += 0.01
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5} position={[0, 1.2, 0]}>
            <group ref={roseRef}>
                {/* Stem */}
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 1, 16]} />
                    <meshStandardMaterial color="#228b22" />
                </mesh>

                {/* Rose petals - layered spheres */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle * Math.PI / 180) * 0.15,
                            0.1,
                            Math.sin(angle * Math.PI / 180) * 0.15
                        ]}
                        rotation={[0.3, angle * Math.PI / 180, 0]}
                    >
                        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI]} />
                        <meshPhysicalMaterial
                            color="#dc143c"
                            emissive="#ff0000"
                            emissiveIntensity={0.3}
                            side={THREE.DoubleSide}
                            roughness={0.3}
                        />
                    </mesh>
                ))}

                {/* Center */}
                <mesh position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshPhysicalMaterial
                        color="#8b0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.5}
                    />
                </mesh>

                <pointLight position={[0, 0.5, 0]} intensity={2} color="#ff4444" distance={4} />
            </group>

            <Text
                position={[0, 1.3, 0]}
                fontSize={0.22}
                color="#ffffff"
                outlineWidth={0.02}
                outlineColor="#dc143c"
                textAlign="center"
                anchorX="center"
            >
                My love for you{'\n'}never fades. 🌹
            </Text>
            <Sparkles count={70} scale={4} size={4} speed={0.3} opacity={0.8} color="#ff6b6b" />
        </Float>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// SURPRISE 4: INFINITY SYMBOL
// ═══════════════════════════════════════════════════════════════════════════
function InfinitySymbol() {
    const infinityRef = useRef()

    useFrame((state) => {
        if (infinityRef.current) {
            infinityRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 1.5, 0]}>
            <group ref={infinityRef}>
                {/* Infinity using two torus */}
                <mesh position={[-0.4, 0, 0]} rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.35, 0.08, 32, 64]} />
                    <meshPhysicalMaterial
                        color="#9400d3"
                        emissive="#8a2be2"
                        emissiveIntensity={0.8}
                        metalness={0.8}
                        roughness={0.2}
                        clearcoat={1}
                    />
                </mesh>
                <mesh position={[0.4, 0, 0]} rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.35, 0.08, 32, 64]} />
                    <meshPhysicalMaterial
                        color="#00ced1"
                        emissive="#00ffff"
                        emissiveIntensity={0.8}
                        metalness={0.8}
                        roughness={0.2}
                        clearcoat={1}
                    />
                </mesh>
                <pointLight position={[0, 0, 1]} intensity={3} color="#9400d3" distance={5} />
            </group>

            <Text
                position={[0, -0.8, 0]}
                fontSize={0.18}
                color="#ffffff"
                outlineWidth={0.015}
                outlineColor="#9400d3"
                textAlign="center"
                anchorX="center"
            >
                Aadi ∞ Nanniii
            </Text>
            <Text
                position={[0, 1.1, 0]}
                fontSize={0.25}
                color="#ffffff"
                outlineWidth={0.02}
                outlineColor="#00ced1"
                textAlign="center"
                anchorX="center"
            >
                Forever and Always 💜
            </Text>
            <Sparkles count={100} scale={5} size={5} speed={0.5} opacity={1} color="#da70d6" />
        </Float>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// SURPRISE 5: LOVE PROMISE BOOK
// ═══════════════════════════════════════════════════════════════════════════
function LoveBook() {
    const bookRef = useRef()
    const [pageOpen, setPageOpen] = useState(false)

    useFrame((state) => {
        if (bookRef.current) {
            bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
        }
        // Auto-open page after 1 second
        if (state.clock.elapsedTime > 1 && !pageOpen) {
            setPageOpen(true)
        }
    })

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} position={[0, 1.5, 0]}>
            <group ref={bookRef}>
                {/* Book cover */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.2, 0.1, 0.9]} />
                    <meshPhysicalMaterial
                        color="#8b4513"
                        roughness={0.8}
                        metalness={0.1}
                    />
                </mesh>

                {/* Pages */}
                <mesh position={[0, 0.08, 0]}>
                    <boxGeometry args={[1.1, 0.05, 0.85]} />
                    <meshStandardMaterial color="#fffef0" />
                </mesh>

                {/* Open page effect */}
                <mesh
                    position={[0, 0.15, 0]}
                    rotation={[pageOpen ? -0.1 : 0, 0, 0]}
                >
                    <planeGeometry args={[1, 0.8]} />
                    <meshStandardMaterial color="#fffef0" side={THREE.DoubleSide} />
                </mesh>

                {/* Golden bookmark */}
                <mesh position={[0.5, 0.1, 0]}>
                    <boxGeometry args={[0.05, 0.25, 0.02]} />
                    <meshPhysicalMaterial color="#ffd700" metalness={1} roughness={0.2} />
                </mesh>

                <pointLight position={[0, 0.5, 0.5]} intensity={2} color="#ffaa00" distance={4} />
            </group>

            <Text
                position={[0, 0.4, 0.1]}
                fontSize={0.1}
                color="#4a3728"
                textAlign="center"
                anchorX="center"
                maxWidth={0.9}
            >
                "I promise to love you{'\n'}through every storm,{'\n'}every silence, every distance.{'\n'}You're my forever."
            </Text>

            <Text
                position={[0, 1.2, 0]}
                fontSize={0.22}
                color="#ffffff"
                outlineWidth={0.02}
                outlineColor="#8b4513"
                textAlign="center"
                anchorX="center"
            >
                Our Love Story 📖
            </Text>
            <Sparkles count={50} scale={3} size={3} speed={0.3} opacity={0.6} color="#ffd700" />
        </Float>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// BOX PARTS
// ═══════════════════════════════════════════════════════════════════════════
function BoxPart({ position, args, color, metallic = false }) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshPhysicalMaterial
                color={color}
                roughness={metallic ? 0.2 : 0.8}
                metalness={metallic ? 0.7 : 0.1}
                clearcoat={metallic ? 1 : 0}
                clearcoatRoughness={0.1}
            />
        </mesh>
    )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GIFT BOX SCENE
// ═══════════════════════════════════════════════════════════════════════════
const SURPRISES = [
    { id: 0, name: "💎 Crystal Heart", component: CrystalHeart },
    { id: 1, name: "💍 Promise Ring", component: PromiseRing },
    { id: 2, name: "🌹 Eternal Rose", component: EternalRose },
    { id: 3, name: "♾️ Infinity", component: InfinitySymbol },
    { id: 4, name: "📖 Love Book", component: LoveBook },
]

export function GiftBoxScene() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentSurpriseIndex, setCurrentSurpriseIndex] = useState(0)
    const [shownSurprises, setShownSurprises] = useState([])
    const lidRef = useRef()

    // Get next random surprise that hasn't been shown
    const getNextSurprise = useCallback(() => {
        const available = SURPRISES.filter(s => !shownSurprises.includes(s.id))
        if (available.length === 0) {
            // Reset if all have been shown
            setShownSurprises([])
            return Math.floor(Math.random() * SURPRISES.length)
        }
        const randomIndex = Math.floor(Math.random() * available.length)
        return available[randomIndex].id
    }, [shownSurprises])

    const handleOpenBox = () => {
        if (!isOpen) {
            const nextId = getNextSurprise()
            setCurrentSurpriseIndex(nextId)
            setShownSurprises(prev => [...prev, nextId])
            setIsOpen(true)
        }
    }

    const handleChangeSurprise = (direction) => {
        const newIndex = (currentSurpriseIndex + direction + SURPRISES.length) % SURPRISES.length
        setCurrentSurpriseIndex(newIndex)
        if (!shownSurprises.includes(newIndex)) {
            setShownSurprises(prev => [...prev, newIndex])
        }
    }

    useFrame(() => {
        if (isOpen && lidRef.current) {
            lidRef.current.position.lerp(new THREE.Vector3(0, 3, -1), 0.1)
            lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -Math.PI / 4, 0.1)
        }
    })

    const CurrentSurpriseComponent = SURPRISES[currentSurpriseIndex].component

    return (
        <group>
            {/* Navigation UI */}
            {isOpen && (
                <Html position={[0, 4, 0]} center>
                    <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                        <button
                            onClick={() => handleChangeSurprise(-1)}
                            className="text-white text-2xl hover:text-pink-400 transition-colors px-2"
                        >
                            ◀
                        </button>
                        <span className="text-white font-mono text-sm tracking-wide min-w-[140px] text-center">
                            {SURPRISES[currentSurpriseIndex].name}
                        </span>
                        <button
                            onClick={() => handleChangeSurprise(1)}
                            className="text-white text-2xl hover:text-pink-400 transition-colors px-2"
                        >
                            ▶
                        </button>
                    </div>
                </Html>
            )}

            <group
                onClick={handleOpenBox}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                {/* Base */}
                <BoxPart position={[0, 0, 0]} args={[2, 2, 2]} color="#6600cc" />

                {/* Ribbon Vertical */}
                <BoxPart position={[0, 0, 0]} args={[2.05, 2, 0.5]} color="#ffdd00" metallic />
                {/* Ribbon Horizontal */}
                <BoxPart position={[0, 0, 0]} args={[0.5, 2, 2.05]} color="#ffdd00" metallic />

                {/* Lid Group */}
                <group ref={lidRef} position={[0, 1.2, 0]}>
                    <BoxPart position={[0, 0, 0]} args={[2.2, 0.4, 2.2]} color="#7700dd" />
                    {/* Lid Ribbon */}
                    <BoxPart position={[0, 0, 0]} args={[2.25, 0.45, 0.5]} color="#ffdd00" metallic />
                    <BoxPart position={[0, 0, 0]} args={[0.5, 0.45, 2.25]} color="#ffdd00" metallic />
                    {/* Bow */}
                    <mesh position={[0, 0.4, 0]}>
                        <torusKnotGeometry args={[0.4, 0.1, 64, 8]} />
                        <meshPhysicalMaterial color="#ffdd00" roughness={0.2} metalness={0.8} clearcoat={1} />
                    </mesh>
                </group>
            </group>

            {/* Surprise Content */}
            {isOpen && <CurrentSurpriseComponent />}

            <Confetti isExploding={isOpen} />
        </group>
    )
}
