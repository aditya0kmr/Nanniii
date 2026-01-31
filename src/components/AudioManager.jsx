import React, { useEffect, useRef, useState } from 'react'

// --- PRODCEDURAL AUDIO ENGINE ---
// Uses Web Audio API to generate infinite space ambient drones
// No external MP3s required.

class SoundEngine {
    constructor() {
        this.ctx = null
        this.masterGain = null
        this.oscillators = []
        this.isStarted = false
    }

    init() {
        if (this.isStarted) return
        const AudioContext = window.AudioContext || window.webkitAudioContext
        this.ctx = new AudioContext()
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.value = 0.3 // Default volume
        this.masterGain.connect(this.ctx.destination)

        // Create the Sci-Fi Drone
        this.createDrone(60, 'sine', 0.5)   // Deep Bass
        this.createDrone(65, 'sine', 0.3)   // Detuned Bass
        this.createDrone(110, 'triangle', 0.1) // Texture

        // Start LFO for movement
        this.createLFO()

        this.isStarted = true
    }

    createDrone(freq, type, vol) {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = type
        osc.frequency.value = freq

        gain.gain.value = vol

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start()
        this.oscillators.push({ osc, gain, baseFreq: freq })
    }

    createLFO() {
        // Slowly modulate volume to make it "breathe"
        const lfo = this.ctx.createOscillator()
        lfo.frequency.value = 0.1 // Very slow

        const lfoGain = this.ctx.createGain()
        lfoGain.gain.value = 0.1

        lfo.connect(this.masterGain.gain)
        lfo.start()
    }

    playClick() {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, this.ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1)

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1)

        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start()
        osc.stop(this.ctx.currentTime + 0.1)
    }

    playHover() {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.frequency.setValueAtTime(200, this.ctx.currentTime)
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

        osc.connect(gain)
        gain.connect(this.masterGain)
        osc.start()
        osc.stop(this.ctx.currentTime + 0.05)
    }
}

const engine = new SoundEngine()

/**
 * Procedural Audio Manager using Web Audio API.
 * Generates ambient drones and sound effects (clicks, hovers).
 * Manages global mute state and audio context resumption.
 * 
 * @component
 * @returns {JSX.Element} The Audio UI controls (Mute/Init button).
 */
export function AudioManager() {
    const [started, setStarted] = useState(false)
    const [muted, setMuted] = useState(false)

    const handleStart = () => {
        engine.init()
        if (engine.ctx && engine.ctx.state === 'suspended') {
            engine.ctx.resume()
        }
        setStarted(true)
    }

    useEffect(() => {
        // Handle Mute State
        if (engine.masterGain) {
            // Ramp to avoid clicks
            const now = engine.ctx.currentTime
            if (muted) {
                engine.masterGain.gain.cancelScheduledValues(now)
                engine.masterGain.gain.setValueAtTime(engine.masterGain.gain.value, now)
                engine.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
            } else {
                engine.masterGain.gain.cancelScheduledValues(now)
                engine.masterGain.gain.setValueAtTime(engine.masterGain.gain.value, now)
                engine.masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.5)
            }
        }
    }, [muted])

    const toggleMute = () => {
        setMuted(!muted)
    }

    // Global Event Listeners for SFX
    useEffect(() => {
        const handleClick = () => {
            if (!muted) engine.playClick()
        }

        const checkHover = () => {
            // Optional: Implement if needed
        }

        window.addEventListener('click', handleClick)
        window.addEventListener('mouseover', checkHover)

        return () => {
            window.removeEventListener('click', handleClick)
            window.removeEventListener('mouseover', checkHover)
        }
    }, [muted]) // Re-bind if mute state changes affects logic, or use mutable ref

    if (!started) {
        return (
            <div className="fixed bottom-10 right-10 z-[60]">
                <button
                    onClick={handleStart}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-white/20 hover:scale-105 transition-all animate-pulse"
                    aria-label="Start Audio Experience"
                >
                    🔊 INITIALIZE AUDIO
                </button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-10 right-10 z-[60]">
            <button
                onClick={toggleMute}
                className={`transition-all duration-300 backdrop-blur-md border px-4 py-2 rounded-full flex items-center gap-2 ${muted ? 'bg-red-900/40 border-red-500/30 text-red-200' : 'bg-cyan-900/40 border-cyan-500/30 text-cyan-200 shadow-[0_0_10px_rgba(0,255,255,0.2)]'}`}
                aria-label={muted ? "Unmute Audio" : "Mute Audio"}
            >
                <span>{muted ? "🔇" : "🔊"}</span>
                <span className="text-xs font-bold tracking-widest">{muted ? "MUTED" : "AUDIO ON"}</span>
            </button>
        </div>
    )
}
