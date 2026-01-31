import React, { useState } from 'react'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { Layout } from './Layout'
import { World } from './World'
import { trips as initialTrips } from '../data/trips'
import * as THREE from 'three'

/**
 * Interactive 3D Globe Module for trip planning.
 * Allows users to search for locations, view trips on a globe, and persist plans to localStorage.
 * Uses Nominatim API for geocoding.
 * 
 * @component
 * @returns {JSX.Element} The rendered GlobeModule.
 */
export function GlobeModule() {
    const [allTrips, setAllTrips] = useState(initialTrips)
    const [selectedLoc, setSelectedLoc] = useState(null) // { lat, lng }
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    const handleLocationSelect = (coords) => {
        setSelectedLoc(coords)
    }

    // Helper removed as unused

    const abortControllerRef = React.useRef(null)

    const performSearch = async () => {
        if (!searchQuery.trim()) return

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Create new controller
        abortControllerRef.current = new AbortController()

        setIsSearching(true)
        setErrorMsg(null)

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
                { signal: abortControllerRef.current.signal }
            )
            const data = await response.json()

            if (data && data.length > 0) {
                const result = data[0]
                const lat = parseFloat(result.lat)
                const lng = parseFloat(result.lon)

                // Select this location
                setSelectedLoc({ lat, lng, name: result.name || searchQuery })
                setSearchQuery('')
            } else {
                setErrorMsg("Location not found. Try a major city.")
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                setErrorMsg("Search failed. Check internet.")
            }
        } finally {
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
                setIsSearching(false)
            }
        }
    }

    const confirmNewLocation = (details) => {
        const newTrip = {
            id: Date.now(),
            city: details.name,
            lat: selectedLoc.lat,
            lng: selectedLoc.lng,
            color: '#ff0055',
            label: details.name,
            status: 'planned',
            notes: details.notes
        }

        const updatedTrips = [...allTrips, newTrip]
        setAllTrips(updatedTrips)
        localStorage.setItem('trips', JSON.stringify(updatedTrips))
        setSelectedLoc(null)
    }

    const [viewMode, setViewMode] = useState('day') // 'day', 'night'

    return (
        <Layout
            cameraPosition={[0, 0, 8]}
            title={null}
            overlay={
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
                    {/* Top Bar: Search & View Controls */}
                    {/* Top Bar: Search & View Controls */}
                    <div className="w-full flex justify-center pt-8 items-center gap-4">
                        <div className="bg-black/80 backdrop-blur-md p-2 rounded-full border border-white/20 flex gap-2 shadow-2xl w-96 pointer-events-auto">
                            <input
                                type="text"
                                placeholder="Search World (e.g. Paris, Tokyo)..."
                                className="bg-transparent text-white px-4 py-2 outline-none w-full placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    // Debounce could be here, but simpler to just let user type and hit enter
                                    // or use a useEffect for auto-search.
                                    // For now, let's keep it manual 'GO' or Enter to strictly control API calls.
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                            />
                            <button
                                onClick={performSearch}
                                disabled={isSearching}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold transition-colors disabled:opacity-50"
                            >
                                {isSearching ? '...' : 'GO'}
                            </button>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="bg-black/80 backdrop-blur-md p-2 rounded-full border border-white/20 flex gap-2 pointer-events-auto">
                            <button
                                onClick={() => setViewMode(viewMode === 'day' ? 'night' : 'day')}
                                className={`px-4 py-2 rounded-full font-bold text-xs transition-colors ${viewMode === 'day' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {viewMode === 'day' ? '☀️ DAY' : '🌙 NIGHT'}
                            </button>
                        </div>
                    </div>

                    {/* Error Toast */}
                    {errorMsg && (
                        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded shadow-lg">
                            {errorMsg}
                        </div>
                    )}

                    {/* Add Location Modal */}
                    {selectedLoc && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-6 rounded-xl shadow-2xl pointer-events-auto text-center w-96 border border-white/10">
                            <h3 className="font-bold text-xl mb-1 text-blue-400">PLAN ADVENTURE</h3>
                            <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">
                                {selectedLoc.lat.toFixed(2)}°N, {selectedLoc.lng.toFixed(2)}°E
                            </p>

                            <input
                                type="text"
                                placeholder="Trip Name (e.g. Summer Vacay)"
                                className="w-full bg-black/50 border border-gray-600 rounded p-3 mb-2 focus:border-blue-500 outline-none text-white"
                                defaultValue={selectedLoc.name || ''}
                                id="tripNameInput"
                            />

                            <textarea
                                placeholder="Notes / Bucket List Items..."
                                className="w-full bg-black/50 border border-gray-600 rounded p-3 mb-4 focus:border-blue-500 outline-none text-white text-sm h-20 resize-none"
                                id="tripNotesInput"
                            ></textarea>

                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setSelectedLoc(null)}
                                    className="px-6 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => confirmNewLocation({
                                        name: document.getElementById('tripNameInput').value,
                                        notes: document.getElementById('tripNotesInput').value
                                    })}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:brightness-110 shadow-lg"
                                >
                                    Confirm Plan
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mission Control Side Panel */}
                    <div className="absolute right-6 top-24 bottom-24 w-80 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex flex-col gap-4 pointer-events-auto overflow-y-auto shadow-2xl">
                        <div className="text-center border-b border-white/10 pb-4 mb-2">
                            <h3 className="text-xl text-white font-black tracking-widest">MISSION LOG</h3>
                            <p className="text-[10px] text-gray-400 mt-1">TRACKING {allTrips.length} LOCATIONS</p>
                        </div>

                        {/* Recent History */}
                        <div>
                            <h4 className="text-xs text-green-400 uppercase tracking-widest mb-3 font-bold border-b border-green-900/30 pb-1">Conquered</h4>
                            <ul className="space-y-2">
                                {allTrips.filter(t => t.status === 'visited').map(t => (
                                    <li key={t.id} className="text-sm text-gray-300 flex justify-between items-center bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                                        <span>{t.city}</span>
                                        <span className="text-green-500 opacity-50 group-hover:opacity-100">✓</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Future Targets */}
                        <div>
                            <h4 className="text-xs text-orange-400 uppercase tracking-widest mb-3 font-bold border-b border-orange-900/30 pb-1">Bucket List</h4>
                            <ul className="space-y-2">
                                {allTrips.filter(t => t.status !== 'visited').map(t => (
                                    <li key={t.id} className="group relative text-sm text-white font-bold bg-gradient-to-r from-orange-900/20 to-transparent p-3 rounded-lg border border-orange-500/20 hover:border-orange-500/50 transition-all cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <span>{t.city}</span>
                                            <span className="text-orange-400 text-xs px-2 py-0.5 bg-orange-900/40 rounded-full">{t.status === 'new' ? 'NEW' : 'PLAN'}</span>
                                        </div>
                                        {t.notes && (
                                            <p className="text-[10px] text-gray-400 mt-1 font-normal truncate group-hover:whitespace-normal">
                                                📝 {t.notes}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            }
        >
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <OrbitControls
                enableZoom={true}
                minDistance={2.6} // Deep Zoom: Close to surface (Radius 2.5)
                maxDistance={20}
                zoomSpeed={0.5} // Precise zoom
                enablePan={false}
                autoRotate={!selectedLoc}
                autoRotateSpeed={0.5}
            />

            <ambientLight intensity={viewMode === 'day' ? 1.5 : 0.2} />
            <directionalLight position={[5, 3, 5]} intensity={viewMode === 'day' ? 3 : 0.5} />

            <World trips={allTrips} onLocationSelect={handleLocationSelect} viewMode={viewMode} />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </Layout>
    )
}


