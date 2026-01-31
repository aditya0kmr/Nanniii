import React from 'react'
import { Html } from '@react-three/drei'

// 1. FOR USE INSIDE CANVAS (e.g. Layout.jsx)
// Removed useProgress to avoid "Cannot update a component while rendering" errors
export function CanvasLoader() {
    return (
        <Html center>
            <div style={{ color: 'white', textAlign: 'center', fontFamily: 'monospace' }}>
                <div className="w-16 h-16 border-4 border-t-pink-500 border-white/20 rounded-full animate-spin mb-4 mx-auto"></div>
                <div className="text-xl tracking-widest">Loading...</div>
                <div className="text-xs text-white/50 uppercase mt-2">Initializing Dimension</div>
            </div>
        </Html>
    )
}

// 2. FOR USE OUTSIDE CANVAS (e.g. App.jsx Router)
export function ScreenLoader() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-black text-white font-mono z-50 absolute top-0 left-0">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-cyan-500 border-white/20 rounded-full animate-spin mb-4 mx-auto"></div>
                <div className="text-xl tracking-widest animate-pulse">INITIALIZING...</div>
            </div>
        </div>
    )
}
