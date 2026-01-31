import React from 'react'
import * as THREE from 'three'

export function WaterSurface() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial
                color="#001e0f"
                roughness={0.1}
                metalness={0.8}
            />
        </mesh>
    )
}
