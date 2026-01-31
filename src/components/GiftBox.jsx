/* eslint-disable react-hooks/purity */
import React, { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function Confetti({ isExploding }) {
    const count = 200
    const particles = useMemo(() => {
        return new Array(count).fill().map(() => ({
            position: new THREE.Vector3((Math.random() - 0.5) * 1, 0, (Math.random() - 0.5) * 1),
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.3, Math.random() * 0.4 + 0.1, (Math.random() - 0.5) * 0.3),
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
            scale: Math.random() * 0.5 + 0.5,
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
        }))
    }, [])

    const groupRef = useRef()

    useFrame((_, delta) => {
        if (isExploding && groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const p = particles[i]
                child.position.add(p.velocity)
                child.rotation.x += p.rotation[0] * delta * 2
                child.rotation.y += p.rotation[1] * delta * 2

                // Gravity and drag
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

export function GiftBoxScene() {
    const [isOpen, setIsOpen] = useState(false)
    const lidRef = useRef()

    useFrame(() => {
        if (isOpen && lidRef.current) {
            // Animate Lid opening
            lidRef.current.position.lerp(new THREE.Vector3(0, 3, -1), 0.1)
            lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -Math.PI / 4, 0.1)
        }
    })

    return (
        <group>
            <group onClick={() => setIsOpen(true)} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
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
            {isOpen && (
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[0, 1.5, 0]}>
                    {/* Procedural Cake */}
                    <group scale={0.8}>
                        {/* Layers */}
                        <mesh position={[0, -0.2, 0]} castShadow>
                            <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
                            <meshStandardMaterial color="#ff99cc" />
                        </mesh>
                        <mesh position={[0, 0.2, 0]} castShadow>
                            <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
                            <meshStandardMaterial color="#ff77bb" />
                        </mesh>
                        {/* Icing */}
                        <mesh position={[0, 0.41, 0]}>
                            <cylinderGeometry args={[0.62, 0.62, 0.05, 32]} />
                            <meshStandardMaterial color="#ffffff" roughness={0.5} />
                        </mesh>
                        {/* Candle */}
                        <mesh position={[0, 0.7, 0]}>
                            <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
                            <meshStandardMaterial color="#eeeeff" emissive="#ff0000" emissiveIntensity={0.2} />
                        </mesh>
                        {/* Flame */}
                        <mesh position={[0, 1.1, 0]}>
                            <sphereGeometry args={[0.08, 16, 16]} />
                            <meshStandardMaterial color="#ffaa00" emissive="#ff5500" emissiveIntensity={4} toneMapped={false} />
                            <pointLight distance={3} intensity={5} color="#ffaa00" decay={2} />
                        </mesh>
                    </group>

                    <Text
                        position={[0, 1.5, 0]}
                        fontSize={0.5}
                        color="#ffffff"
                        outlineWidth={0.02}
                        outlineColor="#ff0088"
                        textAlign="center"
                    >
                        Make a Wish, Nanniii!
                    </Text>
                    <Sparkles count={100} scale={5} size={6} speed={0.4} opacity={1} color="#ffaa00" />
                </Float>
            )}

            <Confetti isExploding={isOpen} />
        </group>
    )
}
