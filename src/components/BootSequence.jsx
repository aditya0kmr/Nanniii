import React, { useState, useEffect } from 'react'

const BOOT_LOGS = [
    "INITIALIZING REALITY ENGINE...",
    "LOADING MEMORY FRAGMENTS...",
    "CALIBRATING NANDINI'S DIMENSION...",
    "ESTABLISHING NEURAL LINK...",
    "ACCESS GRANTED."
]

export function BootSequence({ onComplete }) {
    const [lines, setLines] = useState([])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (index >= BOOT_LOGS.length) {
            // Finished logs, wait a beat then complete
            const timeout = setTimeout(onComplete, 800)
            return () => clearTimeout(timeout)
        }

        const timeout = setTimeout(() => {
            setLines(prev => [...prev, BOOT_LOGS[index]])
            setIndex(prev => prev + 1)
        }, 600) // Speed of typing

        return () => clearTimeout(timeout)
    }, [index, onComplete])

    return (
        <div className="fixed inset-0 z-[100] bg-black text-cyan-500 font-mono flex flex-col items-center justify-center p-8 select-none">
            <div className="w-full max-w-md">
                {lines.map((line, i) => (
                    <div key={i} className="mb-2 text-sm md:text-base animate-pulse shadow-cyan-500/50 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
                        {`> ${line}`}
                    </div>
                ))}
                <div className="w-2 h-4 bg-cyan-500 animate-blink mt-2" />
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md h-1 bg-gray-900 mt-8 rounded-full overflow-hidden border border-cyan-900">
                <div
                    className="h-full bg-cyan-400 shadow-[0_0_10px_#00ffff]"
                    style={{ width: `${(index / BOOT_LOGS.length) * 100}%`, transition: 'width 0.5s ease-in-out' }}
                />
            </div>
        </div>
    )
}
