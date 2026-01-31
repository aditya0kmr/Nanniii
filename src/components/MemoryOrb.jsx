import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, MeshDistortMaterial, Sphere, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export function MemoryOrb({ position = [0, 0, 0], text = "", onPop }) {
    const group = useRef()
    const outerRef = useRef()
    const innerRef = useRef()

    const [popped, setPopped] = useState(false)
    const [hovered, setHover] = useState(false)
    const [visible, setVisible] = useState(true)

    // Animation state for popping
    const popScale = useRef(1)
    const opacity = useRef(1)

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime

        if (!popped) {
            // Floating bubble wobble
            if (outerRef.current) {
                // outerRef.current.rotation.z = time * 0.1
                // outerRef.current.rotation.y = time * 0.15
            }
            if (innerRef.current) {
                innerRef.current.rotation.x = time * 0.2
                innerRef.current.rotation.y = time * 0.3
            }
        } else {
            // POP ANIMATION
            popScale.current += delta * 5 // Expand fast
            opacity.current -= delta * 3 // Fade out fast

            if (outerRef.current) {
                outerRef.current.scale.setScalar(popScale.current)
                outerRef.current.material.opacity = Math.max(0, opacity.current)
            }

            if (opacity.current <= 0 && visible) {
                setVisible(false) // Hide geometry after pop
            }
        }
    })

    const handleClick = (e) => {
        if (popped) return
        e.stopPropagation()
        setPopped(true)
        if (onPop) onPop()
    }

    return (
        <group ref={group} position={position}>
            {/* Floating Container */}
            <Float
                speed={popped ? 0 : 2}
                rotationIntensity={popped ? 0 : 1}
                floatIntensity={popped ? 0 : 2}
            >
                <group
                    onClick={handleClick}
                    onPointerOver={() => { if (!popped) { document.body.style.cursor = 'pointer'; setHover(true) } }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false) }}
                >
                    {/* The Bubble Shell - Polished */}
                    {visible && (
                        <mesh ref={outerRef}>
                            <sphereGeometry args={[1, 64, 64]} />
                            <MeshDistortMaterial
                                color={hovered ? "#ffffff" : "#cceeff"}
                                emissive="#5500ff"
                                emissiveIntensity={hovered ? 0.8 : 0.2}
                                metalness={0.5}
                                roughness={0}
                                clearcoat={1}
                                clearcoatRoughness={0}
                                transmission={0.95} // Very clear glass
                                thickness={0.1}     // Thin bubble wall
                                iridescence={1}
                                iridescenceIOR={1.5}
                                iridescenceThicknessRange={[0, 500]} // Rainbow effect
                                distort={0.4} // Organic wobble
                                speed={3}
                                transparent
                                opacity={0.6}
                            />
                        </mesh>
                    )}

                    {/* Inner Cosmic Nebula Smoke - Polished */}
                    {visible && (
                        <mesh ref={innerRef} scale={0.5}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <MeshDistortMaterial
                                color="#ff00aa"
                                emissive="#aa00ff"
                                emissiveIntensity={3}
                                speed={4}
                                distort={0.8} // Turbulent smoke
                                radius={1}
                                transparent
                                opacity={0.4}
                                blending={THREE.AdditiveBlending}
                            />
                        </mesh>
                    )}

                    {/* Popped State: MORE Sparkles Explosion */}
                    {popped && (
                        <group>
                            <Sparkles
                                count={80}
                                scale={5}
                                size={5}
                                speed={0.8}
                                opacity={1}
                                color="#00ffff"
                            />
                            <Sparkles
                                count={40}
                                scale={3}
                                size={2}
                                speed={0.4}
                                opacity={0.8}
                                color="#ff00ff"
                            />
                        </group>
                    )}

                    {/* The Compliment Text (Revealed continuously but highlighted after pop) */}
                    {popped && (
                        <group scale={visible ? 0 : 1}>
                            {/* We use 'visible' to control timing roughly, or simpler: just show text when popped */}
                            <Text
                                fontSize={0.2}
                                maxWidth={3}
                                lineHeight={1.2}
                                textAlign="center"
                                anchorX="center"
                                anchorY="middle"
                                color="#ffffff"
                                outlineWidth={0.01}
                                outlineColor="#aa00ff"
                            >
                                {text}
                            </Text>

                            {/* Subtext instruction */}
                            <Text
                                position={[0, -0.5, 0]}
                                fontSize={0.08}
                                color="#ffffff"
                                fillOpacity={0.6}
                            >
                                (A new memory forms...)
                            </Text>
                        </group>
                    )}
                </group>
            </Float>
        </group>
    )
}
