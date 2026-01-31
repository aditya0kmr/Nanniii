import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Trail } from '@react-three/drei'
import * as THREE from 'three'

export function Lantern({ position = [0, 0, 0], text = "", delay = 0, speed = 1, onIgnite }) {
    const group = useRef()
    const mesh = useRef()
    const light = useRef()
    const flame = useRef()

    // State
    const [ignited, setIgnited] = useState(false)
    const [released, setReleased] = useState(false)
    const [hovered, setHover] = useState(false)

    // Random slight variation in movement
    const randomOffset = useMemo(() => Math.random() * Math.PI * 2, [])

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime + randomOffset

        // Idle animation (bobbing on water)
        if (!released) {
            group.current.position.y = position[1] + Math.sin(time * 2) * 0.1
            group.current.rotation.z = Math.sin(time) * 0.05
            group.current.rotation.x = Math.cos(time * 0.8) * 0.05
        }

        // Ignited animation (flame flicker)
        if (ignited) {
            // Flicker light intensity
            if (light.current) {
                light.current.intensity = 2 + Math.sin(time * 15) * 0.5 + Math.cos(time * 43) * 0.3
            }
            // Grow flame
            if (flame.current && flame.current.scale.x < 1) {
                flame.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2)
            }
        }

        // Released animation (floating up)
        if (released) {
            group.current.position.y += delta * 0.5 * speed
            group.current.position.x += Math.sin(time * 0.5) * delta * 0.2
            group.current.position.z += Math.cos(time * 0.3) * delta * 0.1

            // Gentle rotation while floating
            group.current.rotation.y += delta * 0.1
        }
    })

    const handleIgnite = (e) => {
        if (ignited) return
        e.stopPropagation()
        setIgnited(true)
        if (onIgnite) onIgnite()

        // Release after a short delay
        setTimeout(() => {
            setReleased(true)
        }, 2000)
    }

    return (
        <group ref={group} position={position}>
            <Float
                speed={released ? 2 : 1}
                rotationIntensity={released ? 0.5 : 0.2}
                floatIntensity={released ? 0.5 : 0.2}
                floatingRange={released ? [0, 2] : [-0.1, 0.1]}
            >
                <group
                    onClick={handleIgnite}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true) }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                >
                    {/* Lantern Body (Paper) */}
                    <mesh ref={mesh} position={[0, 0.6, 0]}>
                        <cylinderGeometry args={[0.4, 0.3, 0.8, 16, 1, true]} />
                        <meshPhysicalMaterial
                            color="#fff8e7" // Warm paper color
                            emissive="#ffaa00"
                            emissiveIntensity={ignited ? 0.5 : 0}
                            roughness={0.6}
                            metalness={0}
                            transparent
                            opacity={0.9}
                            side={THREE.DoubleSide}
                            transmission={0.2}
                            thickness={0.01}
                        />
                    </mesh>

                    {/* Top Rim */}
                    <mesh position={[0, 1.01, 0]}>
                        <torusGeometry args={[0.4, 0.02, 8, 16]} />
                        <meshStandardMaterial color="#3a2e22" />
                    </mesh>

                    {/* Bottom Rim & Base */}
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
                        <meshStandardMaterial color="#3a2e22" />
                    </mesh>

                    {/* Inner Flame (Hidden initially) */}
                    <group ref={flame} scale={[0, 0, 0]} position={[0, 0.3, 0]}>
                        <mesh>
                            <sphereGeometry args={[0.1, 8, 8]} />
                            <meshBasicMaterial color="#ff5500" />
                        </mesh>
                        <pointLight
                            ref={light}
                            distance={5}
                            decay={2}
                            color="#ff7700"
                            intensity={0}
                        />
                    </group>

                    {/* Text on Lantern - Reveals when ignited */}
                    <group position={[0, 0.6, 0.41]}>
                        <Text
                            fontSize={0.06}
                            maxWidth={0.6}
                            lineHeight={1.2}
                            textAlign="center"
                            anchorX="center"
                            anchorY="middle"
                            color="#3e2723"
                            fillOpacity={ignited ? 0.8 : 0} // Fade in on ignite
                        >
                            {text}
                        </Text>
                    </group>
                </group>

                {/* Glow Sprite for atmosphere (when ignited) */}
                {ignited && (
                    <mesh position={[0, 0.6, 0]}>
                        <sphereGeometry args={[1.2, 16, 16]} />
                        <meshBasicMaterial
                            color="#ffaa00"
                            transparent
                            opacity={0.1}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </mesh>
                )}
            </Float>
        </group>
    )
}
