import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Float, Sparkles } from '@react-three/drei'
import { useLocation } from 'wouter'
import { Layout } from './Layout'
import { CanvasLoader as Loader } from './Loader'
import * as THREE from 'three'
import { COLORS } from '../theme/colors'
import { PLANET_POSITIONS, ROUTES, CAMERA_POSITIONS } from '../utils/constants'

// Premium minimal icon components
function WireframeGlobe({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.15
    })

    return (
        <group ref={meshRef}>
            {/* Glass sphere core */}
            <mesh>
                <sphereGeometry args={[0.9, 32, 32]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.1}
                    roughness={0.05}
                    transparent
                    opacity={0.15}
                    transmission={0.9}
                    thickness={0.5}
                />
            </mesh>
            {/* Wireframe overlay */}
            <mesh>
                <sphereGeometry args={[0.95, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={hovered ? 0.8 : 0.4}
                />
            </mesh>
        </group>
    )
}

function OrigamiHeart({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.25
        }
    })

    return (
        <group ref={meshRef}>
            {/* Main heart shape - angular/geometric */}
            <mesh position={[0, 0.2, 0]}>
                <octahedronGeometry args={[0.6, 0]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.1}
                    transparent
                    opacity={0.6}
                    transmission={0.4}
                    thickness={0.3}
                />
            </mesh>
            {/* Inner glow */}
            <mesh position={[0, 0.2, 0]} scale={0.7}>
                <octahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive={color}
                    emissiveIntensity={hovered ? 1 : 0.3}
                    transparent
                    opacity={0.4}
                />
            </mesh>
            {/* Bottom point */}
            <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}>
                <coneGeometry args={[0.3, 0.6, 4]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.1}
                    transparent
                    opacity={0.6}
                    transmission={0.4}
                />
            </mesh>
        </group>
    )
}

function PremiumCrown({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2
        }
    })

    return (
        <group ref={meshRef}>
            {/* Crown base ring */}
            <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.7, 0.75, 0.15, 32]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.05}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.4 : 0.1}
                />
            </mesh>
            {/* Crown points (5) */}
            {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 2 * Math.PI) / 5
                const x = Math.cos(angle) * 0.6
                const z = Math.sin(angle) * 0.6
                return (
                    <mesh key={i} position={[x, 0.3, z]} rotation={[0, angle, 0]}>
                        <coneGeometry args={[0.15, 0.8, 4]} />
                        <meshStandardMaterial
                            color={color}
                            metalness={1}
                            roughness={0.05}
                            emissive={color}
                            emissiveIntensity={hovered ? 0.5 : 0.15}
                        />
                    </mesh>
                )
            })}
            {/* Jewels on crown points */}
            {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * 2 * Math.PI) / 5
                const x = Math.cos(angle) * 0.6
                const z = Math.sin(angle) * 0.6
                return (
                    <mesh key={`jewel-${i}`} position={[x, 0.65, z]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            metalness={0.9}
                            roughness={0.1}
                            emissive="#ffffff"
                            emissiveIntensity={hovered ? 1.2 : 0.5}
                        />
                    </mesh>
                )
            })}
            {/* Center top jewel */}
            <mesh position={[0, 0.75, 0]}>
                <octahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                    color="#ffffff"
                    metalness={1}
                    roughness={0.05}
                    emissive="#ffff00"
                    emissiveIntensity={hovered ? 1.5 : 0.6}
                />
            </mesh>
        </group>
    )
}

function CameraLens({ hovered, color }) {
    const meshRef = useRef()
    const apertureRef = useRef()

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.15
        }
        if (apertureRef.current) {
            apertureRef.current.rotation.z += delta * 0.3
        }
    })

    return (
        <group ref={meshRef}>
            {/* Lens barrel - outer */}
            <mesh>
                <cylinderGeometry args={[0.85, 0.9, 0.6, 32]} />
                <meshStandardMaterial
                    color="#333"
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>
            {/* Lens front glass */}
            <mesh position={[0, 0.31, 0]}>
                <cylinderGeometry args={[0.75, 0.75, 0.02, 32]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.1}
                    roughness={0.05}
                    transparent
                    opacity={0.4}
                    transmission={0.6}
                    thickness={0.1}
                />
            </mesh>
            {/* Aperture blades */}
            <group ref={apertureRef} position={[0, 0.32, 0]}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const angle = (i * 2 * Math.PI) / 8
                    const x = Math.cos(angle) * 0.3
                    const z = Math.sin(angle) * 0.3
                    return (
                        <mesh key={i} position={[x, 0, z]} rotation={[0, angle + Math.PI / 2, 0]}>
                            <boxGeometry args={[0.35, 0.01, 0.08]} />
                            <meshStandardMaterial
                                color="#666"
                                metalness={0.8}
                                roughness={0.3}
                            />
                        </mesh>
                    )
                })}
            </group>
            {/* Lens markings ring */}
            <mesh position={[0, -0.25, 0]}>
                <torusGeometry args={[0.88, 0.05, 8, 32]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.1}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.4 : 0.1}
                />
            </mesh>
        </group>
    )
}

function ParticleConstellation({ hovered, color }) {
    const groupRef = useRef()
    const particlesRef = useRef([])

    useFrame((state) => {
        if (!groupRef.current) return
        const time = state.clock.elapsedTime

        groupRef.current.rotation.y = time * 0.3
        groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.2

        particlesRef.current.forEach((particle, i) => {
            if (particle) {
                const angle = time + (i * Math.PI * 2) / 12
                const radius = hovered ? 1.2 : 0.9
                particle.position.x = Math.cos(angle) * radius
                particle.position.z = Math.sin(angle) * radius
                particle.position.y = Math.sin(time * 2 + i) * 0.3
            }
        })
    })

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive={color}
                    emissiveIntensity={hovered ? 2 : 1}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>

            {Array.from({ length: 12 }).map((_, i) => (
                <mesh key={i} ref={(el) => (particlesRef.current[i] = el)}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 3 : 1.5}
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            ))}
        </group>
    )
}

function HolographicMemoryCube({ hovered, color }) {
    const cubeRef = useRef()
    const planesRef = useRef([])

    useFrame((state) => {
        const time = state.clock.elapsedTime

        if (cubeRef.current) {
            cubeRef.current.rotation.y = time * 0.2
            cubeRef.current.rotation.x = Math.sin(time * 0.15) * 0.15
        }

        planesRef.current.forEach((plane, i) => {
            if (plane) {
                const offset = (i - 2) * 0.3
                plane.position.z = offset + Math.sin(time + i) * 0.1
                plane.rotation.y = Math.sin(time * 0.5 + i) * 0.3
            }
        })
    })

    return (
        <group ref={cubeRef}>
            <mesh>
                <boxGeometry args={[1.4, 1.4, 1.4]} />
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={hovered ? 0.6 : 0.3}
                />
            </mesh>

            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} ref={(el) => (planesRef.current[i] = el)} position={[0, 0, (i - 2) * 0.3]}>
                    <planeGeometry args={[0.8, 0.8]} />
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.2}
                        roughness={0.1}
                        transparent
                        opacity={hovered ? 0.7 : 0.4}
                        transmission={0.6}
                        thickness={0.2}
                    />
                </mesh>
            ))}

            {[
                [0.7, 0.7, 0.7], [-0.7, 0.7, 0.7],
                [0.7, -0.7, 0.7], [-0.7, -0.7, 0.7],
                [0.7, 0.7, -0.7], [-0.7, 0.7, -0.7],
                [0.7, -0.7, -0.7], [-0.7, -0.7, -0.7]
            ].map((pos, i) => (
                <mesh key={`node-${i}`} position={pos}>
                    <sphereGeometry args={[0.06, 16, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive={color}
                        emissiveIntensity={hovered ? 1.5 : 0.5}
                        metalness={1}
                        roughness={0.1}
                    />
                </mesh>
            ))}
        </group>
    )
}

function EnvelopeIcon({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.2
    })

    return (
        <group ref={meshRef}>
            {/* Envelope body - frosted glass */}
            <mesh>
                <boxGeometry args={[1.4, 0.05, 1]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.2}
                    roughness={0.1}
                    transparent
                    opacity={0.25}
                    transmission={0.7}
                />
            </mesh>
            {/* Envelope flap - metallic */}
            <mesh position={[0, 0.025, 0]} rotation={[Math.PI * 0.2, 0, 0]}>
                <boxGeometry args={[1.4, 0.03, 0.7]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.95}
                    roughness={0.05}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.3 : 0.05}
                />
            </mesh>
            {/* Seal */}
            <mesh position={[0, 0.06, 0.2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    metalness={1}
                    roughness={0.1}
                    emissive="#ffffff"
                    emissiveIntensity={hovered ? 0.5 : 0.1}
                />
            </mesh>
        </group>
    )
}

function BadgeIcon({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.25
    })

    return (
        <group ref={meshRef}>
            {/* Medal base - polished metal */}
            <mesh>
                <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.05}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.4 : 0.1}
                />
            </mesh>
            {/* Inner ring */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[0.5, 0.08, 16, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    metalness={1}
                    roughness={0.1}
                    emissive="#ffffff"
                    emissiveIntensity={hovered ? 0.6 : 0.15}
                />
            </mesh>
            {/* Center star detail */}
            <mesh position={[0, 0.06, 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial
                    color="#ffffff"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>
        </group>
    )
}

function LayeredFrames({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.18
    })

    return (
        <group ref={meshRef}>
            {/* Three layered glass panes */}
            {[0, 0.15, 0.3].map((z, i) => (
                <mesh key={i} position={[0, 0, z]}>
                    <boxGeometry args={[1.1, 1.4, 0.02]} />
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.1}
                        roughness={0.05}
                        transparent
                        opacity={0.2 + i * 0.05}
                        transmission={0.85}
                        thickness={0.3}
                    />
                </mesh>
            ))}
            {/* Chrome frame border */}
            <mesh>
                <boxGeometry args={[1.2, 1.5, 0.05]} />
                <meshStandardMaterial
                    color="#ddd"
                    metalness={1}
                    roughness={0.05}
                    transparent
                    opacity={hovered ? 0.6 : 0.3}
                />
            </mesh>
        </group>
    )
}

function MinimalBox({ hovered, color }) {
    const meshRef = useRef()
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2
            meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1
        }
    })

    return (
        <group ref={meshRef}>
            {/* Glass cube */}
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.05}
                    roughness={0.05}
                    transparent
                    opacity={0.2}
                    transmission={0.9}
                    thickness={0.5}
                />
            </mesh>
            {/* Wireframe edge highlight */}
            <mesh>
                <boxGeometry args={[1.02, 1.02, 1.02]} />
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={hovered ? 0.7 : 0.3}
                />
            </mesh>
            {/* Floating core sphere */}
            <mesh>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                    color="#ffffff"
                    metalness={1}
                    roughness={0.05}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.2}
                />
            </mesh>
        </group>
    )
}

function Planet({ position, color, label, route, shape = 'sphere', onHover }) {
    const [hovered, setHover] = useState(false)
    const [, setLocation] = useLocation()

    // Render premium icon based on shape
    const renderIcon = () => {
        switch (shape) {
            case 'wireframe-globe':
                return <WireframeGlobe hovered={hovered} color={color} />
            case 'origami-heart':
                return <OrigamiHeart hovered={hovered} color={color} />
            case 'particle-constellation':
                return <ParticleConstellation hovered={hovered} color={color} />
            case 'holographic-cube':
                return <HolographicMemoryCube hovered={hovered} color={color} />
            case 'premium-crown':
                return <PremiumCrown hovered={hovered} color={color} />
            case 'camera-lens':
                return <CameraLens hovered={hovered} color={color} />
            case 'minimal-box':
                return <MinimalBox hovered={hovered} color={color} />
            default:
                return <mesh><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color={color} /></mesh>
        }
    }

    return (
        <group position={position}>
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
                <group
                    scale={hovered ? 1.15 : 1}
                    onClick={() => setLocation(route)}
                    onPointerOver={() => {
                        document.body.style.cursor = 'pointer';
                        setHover(true);
                        if (onHover) onHover(true);
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        setHover(false);
                        if (onHover) onHover(false);
                    }}
                >
                    {renderIcon()}
                </group>

                {/* Subtle glow ring on hover */}
                {hovered && (
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[1.3, 1.4, 64]} />
                        <meshBasicMaterial color={color} transparent opacity={0.5} />
                    </mesh>
                )}

                <Text
                    position={[0, 1.8, 0]}
                    fontSize={0.35}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.015}
                    outlineColor="#000"
                    fillOpacity={hovered ? 1 : 0.6}
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                    letterSpacing={0.05}
                >
                    {label}
                </Text>
            </Float>
        </group>
    )
}

// --- CENTRAL HOLOGRAM SYSTEM ---
function CentralHologram({ activeModule }) {
    const groupRef = useRef()
    const pulseRef = useRef()

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) {
            // constantly rotate the central projection
            groupRef.current.rotation.y += delta * 0.5
        }
        if (pulseRef.current) {
            // Breathing animation
            const scale = 1.2 + Math.sin(time * 2) * 0.1
            pulseRef.current.scale.set(scale, scale, scale)
            pulseRef.current.rotation.y -= delta * 0.2
        }
    })

    // If no module hovered, show the "Burning Star" (The Birthday Soul)
    if (!activeModule) {
        return (
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[2, 64, 64]} />
                    <meshStandardMaterial
                        color="#ffaa00"
                        emissive="#ff5500"
                        emissiveIntensity={3}
                        toneMapped={false}
                    />
                    <pointLight intensity={2} color="#ffaa00" distance={20} decay={2} />
                </mesh>
                {/* Pulse Aura */}
                <mesh ref={pulseRef} scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[2, 32, 32]} />
                    <meshBasicMaterial
                        color="#ff5500"
                        transparent
                        opacity={0.1}
                        side={THREE.BackSide}
                    />
                </mesh>
            </Float>
        )
    }

    // Otherwise, project the hologram of the target module
    return (
        <group ref={groupRef}>
            {/* Hologram Base Projector Light */}
            <pointLight position={[0, -2, 0]} intensity={2} color="#00ffff" distance={10} />
            <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} color="#00ffff" />

            {/* HOLOGRAMS */}
            {activeModule === '/globe' && (
                <group>
                    <WireframeGlobe color="#00ffff" hovered={true} />
                    <Text position={[0, -1.5, 0]} fontSize={0.2} color="#00ffff">PLANETARY SCAN</Text>
                </group>
            )}
            {activeModule === '/parchment' && (
                <group scale={1.5}>
                    <OrigamiHeart color="#ff00ff" hovered={true} />
                    <Text position={[0, -1.2, 0]} fontSize={0.2} color="#ff00ff">EMOTIONAL CORE</Text>
                </group>
            )}
            {activeModule === '/stars' && (
                <group scale={1.5}>
                    <ParticleConstellation color="#ffff00" hovered={true} />
                    <Text position={[0, -1.5, 0]} fontSize={0.2} color="#ffff00">MEMORY CLOUD</Text>
                </group>
            )}
            {activeModule === '/gallery' && (
                <group scale={1.5}>
                    <HolographicMemoryCube color="#00ff00" hovered={true} />
                    <Text position={[0, -1.5, 0]} fontSize={0.2} color="#00ff00">TIMELINE MATRIX</Text>
                </group>
            )}
            {activeModule === '/gift' && (
                <group scale={1.5}>
                    <MinimalBox color="#ff0000" hovered={true} />
                    <Text position={[0, -1.5, 0]} fontSize={0.2} color="#ff0000">UNKNOWN ARTIFACT</Text>
                </group>
            )}
        </group>
    )
}

/**
 * The Central Navigation Hub of the application.
 * Renders a 3D scene with interactive planets representing different modules.
 * Handles mobile detection and responsive camera positioning.
 * 
 * @component
 * @returns {JSX.Element} The rendered Hub component.
 */
export function Hub() {
    const [hoveredModule, setHoveredModule] = useState(null) // Route path of hovered planet
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 768px)')
        setIsMobile(mql.matches)
        const handler = (e) => setIsMobile(e.matches)
        mql.addEventListener('change', handler)
        return () => mql.removeEventListener('change', handler)
    }, [])

    return (
        <Layout cameraPosition={isMobile ? CAMERA_POSITIONS.HUB_MOBILE : CAMERA_POSITIONS.HUB_DESKTOP} showBackButton={false}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Cosmic Dust */}
            <Sparkles count={500} scale={20} size={4} speed={0.4} opacity={0.5} color="#ffffff" />

            {/* Additional Lighting specific to Hub */}
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -5, -10]} color="#4400ff" intensity={0.5} />

            {/* CENTRAL PROJECTION SYSTEM */}
            <CentralHologram activeModule={hoveredModule} />

            {/* Planets (Modules) - Pass setHoveredModule to them */}
            <group onPointerOut={() => setHoveredModule(null)}>
                <Planet
                    position={PLANET_POSITIONS.GLOBE}
                    color={COLORS.modules.globe}
                    label="Travel Globe"
                    route={ROUTES.GLOBE}
                    shape="wireframe-globe"
                    onHover={(v) => v && setHoveredModule(ROUTES.GLOBE)}
                />
                <Planet
                    position={PLANET_POSITIONS.PARCHMENT}
                    color={COLORS.modules.parchment}
                    label="Love Letter"
                    route={ROUTES.PARCHMENT}
                    shape="origami-heart"
                    onHover={(v) => v && setHoveredModule(ROUTES.PARCHMENT)}
                />
                <Planet
                    position={PLANET_POSITIONS.STARS}
                    color={COLORS.modules.stars}
                    label="Compliments"
                    route={ROUTES.STARS}
                    shape="particle-constellation"
                    onHover={(v) => v && setHoveredModule(ROUTES.STARS)}
                />
                <Planet
                    position={PLANET_POSITIONS.GALLERY}
                    color={COLORS.modules.gallery}
                    label="Gallery"
                    route={ROUTES.GALLERY}
                    shape="holographic-cube"
                    onHover={(v) => v && setHoveredModule(ROUTES.GALLERY)}
                />
                <Planet
                    position={PLANET_POSITIONS.GIFT}
                    color={COLORS.modules.gift}
                    label="Surprise!"
                    route={ROUTES.GIFT}
                    shape="minimal-box"
                    onHover={(v) => v && setHoveredModule(ROUTES.GIFT)}
                />
            </group>

            <OrbitControls
                enableZoom={true}
                minDistance={5}
                maxDistance={30}
                autoRotate={!hoveredModule}
                autoRotateSpeed={0.5}
                enablePan={!isMobile} // Disable pan on mobile to avoid getting lost
            />
        </Layout>
    )
}
