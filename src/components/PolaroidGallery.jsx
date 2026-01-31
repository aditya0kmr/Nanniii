import React, { useRef, useState, useMemo } from 'react'
import { Text, Float, RoundedBox, Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// --- CURATED PHOTOS (Using colors as placeholders to avoid image loading issues) ---
const PHOTOS = [
    { color: "#ff6b6b", caption: "Love", year: "2024" },
    { color: "#4ecdc4", caption: "Adventure", year: "2023" },
    { color: "#45b7d1", caption: "Dreams", year: "2022" },
    { color: "#96ceb4", caption: "Peace", year: "2021" },
    { color: "#ffeaa7", caption: "Joy", year: "2020" },
    { color: "#dfe6e9", caption: "Serenity", year: "2019" },
    { color: "#a29bfe", caption: "Magic", year: "2018" },
    { color: "#fd79a8", caption: "Memories", year: "2017" },
]

// Single Polaroid Card Component
function PolaroidCard({ initialPosition, photo, index, isSelected, onSelect }) {
    const groupRef = useRef()
    const [hovered, setHovered] = useState(false)

    // Smooth animation towards target position
    useFrame((state, delta) => {
        if (!groupRef.current) return

        // Target position
        const targetX = isSelected ? 0 : initialPosition[0]
        const targetY = isSelected ? 0 : initialPosition[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.15
        const targetZ = isSelected ? 3 : initialPosition[2]
        const targetScale = isSelected ? 1.8 : hovered ? 1.15 : 1

        // Smooth lerp
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3)
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 3)
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 3)

        const currentScale = groupRef.current.scale.x
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 5)
        groupRef.current.scale.setScalar(newScale)

        // Gentle rotation when not selected
        if (!isSelected) {
            groupRef.current.rotation.y += delta * 0.02
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.03
        } else {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 3)
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 3)
        }
    })

    return (
        <group
            ref={groupRef}
            position={initialPosition}
            onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : index) }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true) }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false) }}
        >
            {/* Shadow underneath */}
            <mesh position={[0.1, -0.1, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.4, 3]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.3} />
            </mesh>

            {/* Polaroid Frame (White Border) */}
            <RoundedBox args={[2.2, 2.8, 0.08]} radius={0.03} smoothness={4}>
                <meshStandardMaterial
                    color="#fafafa"
                    roughness={0.9}
                    metalness={0}
                />
            </RoundedBox>

            {/* Photo Area (Colored) */}
            <mesh position={[0, 0.2, 0.05]}>
                <planeGeometry args={[1.9, 1.9]} />
                <meshStandardMaterial
                    color={photo.color}
                    roughness={0.4}
                    metalness={0.1}
                    emissive={photo.color}
                    emissiveIntensity={hovered || isSelected ? 0.3 : 0.1}
                />
            </mesh>

            {/* Caption Text */}
            <Text
                position={[0, -1.05, 0.05]}
                fontSize={0.2}
                color="#333333"
                anchorX="center"
                anchorY="middle"
            >
                {photo.caption}
            </Text>

            {/* Year Badge */}
            <Text
                position={[0.75, -1.25, 0.05]}
                fontSize={0.12}
                color="#888888"
                anchorX="right"
                anchorY="middle"
            >
                {photo.year}
            </Text>

            {/* Hover/Select Glow */}
            {(hovered || isSelected) && (
                <pointLight position={[0, 0, 1]} intensity={0.8} color="#ffffff" distance={4} />
            )}
        </group>
    )
}

// Main Gallery Logic
export function PolaroidGalleryLogic() {
    const [selectedIndex, setSelectedIndex] = useState(null)

    // Generate positions in a circle
    const polaroidPositions = useMemo(() => {
        return PHOTOS.map((photo, i) => {
            const angle = (i / PHOTOS.length) * Math.PI * 2
            const radius = 5
            return {
                photo,
                position: [
                    Math.cos(angle) * radius,
                    (i % 2 === 0 ? 0.5 : -0.5),
                    Math.sin(angle) * radius
                ]
            }
        })
    }, [])

    return (
        <group>
            {/* Polaroid Cards */}
            {polaroidPositions.map((data, i) => (
                <PolaroidCard
                    key={i}
                    initialPosition={data.position}
                    photo={data.photo}
                    index={i}
                    isSelected={selectedIndex === i}
                    onSelect={setSelectedIndex}
                />
            ))}

            {/* Ambient Sparkles */}
            <Sparkles count={150} scale={20} size={3} speed={0.2} opacity={0.5} color="#ffffff" />
            <Sparkles count={80} scale={15} size={4} speed={0.15} opacity={0.4} color="#ffccdd" />
        </group>
    )
}
