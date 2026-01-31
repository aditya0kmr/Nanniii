import React, { useMemo, useState, useRef } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { trips as defaultTrips } from '../data/trips'
import { cities } from '../data/cities'

// Textures
const EARTH_DAY_URL = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
const EARTH_NIGHT_URL = "https://unpkg.com/three-globe/example/img/earth-night.jpg"
const EARTH_BUMP_URL = "https://unpkg.com/three-globe/example/img/earth-topology.png"
const EARTH_SPEC_URL = "https://unpkg.com/three-globe/example/img/earth-water.png"
const CLOUD_TEXTURE_URL = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"

function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const z = (radius * Math.sin(phi) * Math.sin(theta))
    const y = (radius * Math.cos(phi))
    return new THREE.Vector3(x, y, z)
}

function CloudLayer({ radius }) {
    const cloudRef = useRef()
    useFrame(({ clock }) => {
        if (cloudRef.current) {
            cloudRef.current.rotation.y = clock.getElapsedTime() * 0.015
        }
    })

    // Use texture simply
    const [cloudMap] = useTexture([CLOUD_TEXTURE_URL])

    return (
        <mesh ref={cloudRef}>
            <sphereGeometry args={[radius * 1.01, 64, 64]} />
            <meshStandardMaterial
                map={cloudMap}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </mesh>
    )
}

// Deprecated component removed

// Separate component to handle individual positioning if using single HTML parent? 
// No, Drei Html is usually one per object. 
// Let's re-structure: Map over cities, return <mesh><Html>...</Html></mesh>

function LabelsGroup({ radius, onSelect }) {
    const groupRef = useRef()
    const { camera } = useThree()

    // Calculate visibility based on camera distance
    const [labelsVisible, setLabelsVisible] = useState(true)

    useFrame(() => {
        if (!groupRef.current) return
        const dist = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
        // Show labels when zoomed to medium/close range
        const shouldShow = dist < 8
        setLabelsVisible(shouldShow)
    })

    return (
        <group ref={groupRef}>
            {cities.map((city, i) => {
                const pos = latLngToVector3(city.lat, city.lng, radius)
                return (
                    <group key={i} position={pos}>
                        {/* Small dot for city location */}
                        <mesh>
                            <sphereGeometry args={[0.02, 8, 8]} />
                            <meshBasicMaterial color="cyan" transparent opacity={0.8} />
                        </mesh>
                        {labelsVisible && (
                            <Html center zIndexRange={[50, 0]} distanceFactor={10}>
                                <div
                                    className="cursor-pointer select-none"
                                    onClick={(e) => { e.stopPropagation(); onSelect({ ...city, lat: city.lat, lng: city.lng, name: city.name, status: 'new' }); }}
                                    style={{
                                        color: 'white',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textShadow: '0 0 4px black, 0 0 8px black',
                                        whiteSpace: 'nowrap',
                                        padding: '2px 6px',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        borderRadius: '4px',
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    {city.name}
                                </div>
                            </Html>
                        )}
                    </group>
                )
            })}
        </group>
    )
}


function Marker({ position, color, label, isNew }) {
    const [hovered, setHover] = useState(false)
    return (
        <group position={position}>
            <group
                position={[0, 0.05, 0]}
                onPointerOver={() => { setHover(true); document.body.style.cursor = 'pointer' }}
                onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
                scale={hovered ? 1.5 : 1}
            >
                <mesh position={[0, 0.15, 0]}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
                </mesh>
                <mesh position={[0, 0.075, 0]}>
                    <coneGeometry args={[0.03, 0.15, 16]} />
                    <meshStandardMaterial color={color} />
                </mesh>
                <mesh position={[0, -0.05, 0]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
                    <meshStandardMaterial color="white" opacity={0.5} transparent />
                </mesh>
            </group>

            {(hovered || isNew) && (
                <group position={[0, 0.4, 0]}>
                    <Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                        <div className="px-3 py-1 bg-black/80 backdrop-blur border border-white/30 rounded-full shadow-lg text-white text-[10px] font-bold whitespace-nowrap -translate-y-2">
                            {label}
                        </div>
                    </Html>
                </group>
            )}
        </group>
    )
}

function PathLine({ start, end, color, dashed }) {
    const points = useMemo(() => {
        const startVec = start.clone()
        const endVec = end.clone()
        const distance = startVec.distanceTo(endVec)
        const mid = startVec.clone().add(endVec).multiplyScalar(0.5).normalize().multiplyScalar(startVec.length() + distance * 0.5)
        const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
        return curve.getPoints(60)
    }, [start, end])

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            {dashed ? (
                <lineDashedMaterial color={color} dashSize={0.1} gapSize={0.05} scale={1} opacity={0.5} transparent linewidth={1} />
            ) : (
                <lineBasicMaterial color={color} opacity={0.6} transparent linewidth={1} />
            )}
        </line>
    )
}

export function World({ trips = defaultTrips, onLocationSelect, viewMode = 'day' }) {
    const radius = 2.5

    // Load Textures (Day + Night)
    const [dayMap, nightMap, bumpMap, specMap] = useTexture([EARTH_DAY_URL, EARTH_NIGHT_URL, EARTH_BUMP_URL, EARTH_SPEC_URL])

    const handleSphereClick = (e) => {
        if (e.delta > 2) return
        e.stopPropagation()
        const point = e.point
        const phi = Math.acos(point.y / radius)
        let theta = Math.atan2(point.z, -point.x)
        if (theta < 0) theta += Math.PI * 2
        const lat = 90 - (phi * 180 / Math.PI)
        const lng = (theta * 180 / Math.PI) - 180
        if (onLocationSelect) {
            onLocationSelect({ lat, lng })
        }
    }

    return (
        <group>
            {/* Realistic Earth Sphere */}
            <mesh onClick={handleSphereClick}>
                <sphereGeometry args={[radius, 128, 128]} />
                <meshPhongMaterial
                    map={viewMode === 'day' ? dayMap : nightMap}
                    bumpMap={bumpMap}
                    bumpScale={0.15}
                    specularMap={specMap}
                    specular={new THREE.Color('grey')}
                    shininess={10}
                    emissive={viewMode === 'night' ? new THREE.Color(0x444444) : new THREE.Color(0x000000)}
                    emissiveMap={viewMode === 'night' ? nightMap : null}
                    emissiveIntensity={viewMode === 'night' ? 0.5 : 0}
                />
            </mesh>

            <React.Suspense fallback={null}>
                <CloudLayer radius={radius} />
            </React.Suspense>

            <mesh scale={1.025}>
                <sphereGeometry args={[radius, 64, 64]} />
                <meshStandardMaterial
                    color="#88ccff"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Global Labels System */}
            <LabelsGroup radius={radius} onSelect={onLocationSelect} />

            {/* User Trips */}
            {trips.map((trip, i) => {
                const pos = latLngToVector3(trip.lat, trip.lng, radius)
                const isVisited = trip.status === 'visited'
                const color = trip.color || (isVisited ? '#00ff88' : '#ffaa00')

                return (
                    <React.Fragment key={trip.id || i}>
                        <Marker
                            position={pos}
                            color={color}
                            label={trip.label}
                            isNew={trip.status === 'planned' && i === trips.length - 1}
                        />
                        {i > 0 && trips[i - 1].status === trip.status && (
                            <PathLine
                                start={latLngToVector3(trips[i - 1].lat, trips[i - 1].lng, radius)}
                                end={pos}
                                color={color}
                                dashed={!isVisited}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </group>
    )
}
