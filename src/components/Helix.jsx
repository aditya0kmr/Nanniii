import React, { useRef, useState, useMemo } from 'react'
import { Image, Text, useScroll, Float, RoundedBox, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// --- MOCK DATA: The DNA of Memories ---
// --- MOCK DATA: The DNA of Memories ---
// Curated list of high-quality Unsplash images ensuring they validate
const CURATED_IMAGES = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80", // Space (Verified)
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80", // Earth (Verified)
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80", // Abstract (Verified)
    "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?w=500&q=80", // Tech/Particles (Verified)
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80", // Mountains (Verified)
]

const MEMORIES = Array.from({ length: 20 }, (_, i) => ({
    year: 1998 + i,
    title: `Memory Fragment ${i + 1}`,
    desc: "A moment frozen in time.",
    url: CURATED_IMAGES[i % CURATED_IMAGES.length]
}))

function GlassFrame({ position, rotation, url, year, title, isHovered, setHover }) {
    const groupRef = useRef()
    const materialRef = useRef()

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Smooth Pop-up Scale
            const targetScale = isHovered ? 1.25 : 1
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8)

            // Subtle "Come Closer" translation on Z
            // We can't easily lerp position because Float is controlling parent. 
            // But we can lerp local Z of the inner group.
            const targetZ = isHovered ? 0.5 : 0
            groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 8)
        }

        if (materialRef.current) {
            // Smooth Glow Intensity
            const targetIntensity = isHovered ? 2 : 0
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, targetIntensity, delta * 5)

            // Pulse opacity slightly
            // materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, isHovered ? 1 : 0.8, delta * 5)
        }
    })

    return (
        <group position={position} rotation={rotation}>
            <Float speed={isHovered ? 0.5 : 2} rotationIntensity={0.1} floatIntensity={0.2}>
                <group
                    ref={groupRef}
                    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHover(true) }}
                    onPointerOut={(e) => { document.body.style.cursor = 'auto'; setHover(false) }}
                >
                    {/* CRYSTAL BLOCK */}
                    <RoundedBox args={[2, 1.4, 0.2]} radius={0.05} smoothness={4}>
                        <meshPhysicalMaterial
                            ref={materialRef}
                            transmission={1} // Glass-like
                            roughness={isHovered ? 0.05 : 0.15} // Clearer when hovered
                            thickness={1.5}
                            ior={1.5}
                            color={isHovered ? "#ffffff" : "#ccccff"}
                            emissive="#00ffff" // Fixed color, varying intensity
                            emissiveIntensity={0} // Controlled by useFrame
                            toneMapped={false}
                            transparent
                            opacity={0.9}
                        />
                    </RoundedBox>

                    {/* CONTENT (Image inside glass) */}
                    <Image
                        url={url}
                        scale={[1.8, 1.2]}
                        position={[0, 0, 0]} // Inside the block
                        transparent
                        opacity={isHovered ? 1 : 0.85}
                        color={isHovered ? "white" : "#ddd"}
                    />

                    {/* LABELS - Only visible on hover/close proximity? Or always? Always is better for scrolling. */}
                    <Text
                        position={[-0.9, 0.8, 0.12]}
                        fontSize={0.15}
                        color={isHovered ? "#00ffff" : "white"}
                        anchorX="left"
                    >
                        {year}
                    </Text>
                    <Text
                        position={[-0.9, -0.8, 0.12]}
                        fontSize={0.1}
                        color="white"
                        anchorX="left"
                        maxWidth={1.8}
                    >
                        {title}
                    </Text>
                </group>
            </Float>
        </group>
    )
}

function Connector({ start, end }) {
    // A glowing line connecting the two strands (Hydrogen Bond)
    const curve = useMemo(() => {
        return new THREE.LineCurve3(new THREE.Vector3(...start), new THREE.Vector3(...end))
    }, [start, end])

    return (
        <mesh position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]}>
            {/* Simple cylinder for the bond */}
            <cylinderGeometry args={[0.02, 0.02, 3, 8]} /> {/* Fixed length approx, rotation needed? */}
            {/* Actually line is easier if just drawing geometry points, but cylinder looks solid. */}
        </mesh>
    )
}

// Simplified Bond using Tube
function DnaBond({ p1, p2 }) {
    const ref = useRef()

    // Calculate orientation
    const v1 = new THREE.Vector3(...p1)
    const v2 = new THREE.Vector3(...p2)
    const height = v1.distanceTo(v2)
    const mid = v1.clone().add(v2).multiplyScalar(0.5)

    return (
        <group position={mid}>
            <mesh quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize())}>
                <cylinderGeometry args={[0.02, 0.02, height, 8]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

export function HelixLogic() {
    const scroll = useScroll()
    const group = useRef()

    // --- GEOMETRY GENERATION ---
    const { items, bonds } = useMemo(() => {
        const _items = []
        const _bonds = []
        const count = 30
        const radius = 3.5
        const ySpacing = 2

        for (let i = 0; i < count; i++) {
            const t = i * 0.6 // Twist factor

            // STRAND A
            const y = -i * ySpacing
            const xA = radius * Math.cos(t)
            const zA = radius * Math.sin(t)

            // STRAND B (Offset by PI)
            const xB = radius * Math.cos(t + Math.PI)
            const zB = radius * Math.sin(t + Math.PI)

            // Add Items
            _items.push({ pos: [xA, y, zA], rot: [0, -t - Math.PI / 2, 0], data: MEMORIES[i % MEMORIES.length], id: `A${i}` })
            _items.push({ pos: [xB, y, zB], rot: [0, -(t + Math.PI) - Math.PI / 2, 0], data: MEMORIES[(i + 5) % MEMORIES.length], id: `B${i}` })

            // Add Bond
            if (i % 2 === 0) { // Bond every other step for aesthetics
                _bonds.push({ p1: [xA, y, zA], p2: [xB, y, zB], id: `bond${i}` })
            }
        }
        return { items: _items, bonds: _bonds }
    }, [])

    useFrame((state, delta) => {
        if (group.current) {
            // Scroll Logic: Move Up + Rotate
            const targetY = scroll.offset * (30 * 2) // Total height

            // Smooth Damp
            group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY + 5, delta * 3)
            group.current.rotation.y = -scroll.offset * Math.PI * 4 // Spin while scrolling
        }
    })

    const [hoveredId, setHoveredId] = useState(null)

    return (
        <group ref={group}>
            {/* The Items */}
            {items.map((item, i) => (
                <GlassFrame
                    key={item.id}
                    position={item.pos}
                    rotation={item.rot}
                    url={item.data.url}
                    year={item.data.year}
                    title={item.data.title}
                    isHovered={hoveredId === item.id}
                    setHover={(v) => setHoveredId(v ? item.id : null)}
                />
            ))}

            {/* The Bonds */}
            {bonds.map((bond) => (
                <DnaBond key={bond.id} p1={bond.p1} p2={bond.p2} />
            ))}

            {/* Ambient Particles */}
            <Sparkles count={500} scale={12} size={4} speed={0.4} opacity={0.5} />
        </group>
    )
}
