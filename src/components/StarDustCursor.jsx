import React, { useEffect, useRef, useState } from 'react'

export function StarDustCursor() {
    const cursorRef = useRef(null)
    const [hovering, setHovering] = useState(false)
    const particles = useRef([])

    // We use a ref for position to avoid re-renders on every mouse move
    const mouse = useRef({ x: -100, y: -100 })

    useEffect(() => {
        const onMouseMove = (e) => {
            // DIRECT DOM UPDATE -> Zero React Lag
            const x = e.clientX
            const y = e.clientY
            mouse.current = { x, y }

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
            }

            // Spawn particle (throttled by logic not checking render cycle)
            if (Math.random() > 0.5) {
                particles.current.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    size: Math.random() * 4 + 1
                })
            }
        }

        const onMouseDown = () => {
            // Burst effect
            for (let i = 0; i < 10; i++) {
                particles.current.push({
                    x: mouse.current.x,
                    y: mouse.current.y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1,
                    size: Math.random() * 6 + 2
                })
            }
        }

        const checkHover = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('[role="button"]') || e.target.tagName === 'A') {
                setHovering(true)
            } else {
                setHovering(false)
            }
        }

        // Add passive listeners for better performance
        window.addEventListener('mousemove', onMouseMove, { passive: true })
        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseover', checkHover)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseover', checkHover)
        }
    }, [])

    // Particle Animation Loop
    const canvasRef = useRef(null)
    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        let af

        const loop = () => {
            if (!canvasRef.current) return

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

            // Update & Draw Particles
            for (let i = particles.current.length - 1; i >= 0; i--) {
                const p = particles.current[i]
                p.x += p.vx
                p.y += p.vy
                p.life -= 0.02

                if (p.life <= 0) {
                    particles.current.splice(i, 1)
                    continue
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${p.life})`
                if (Math.random() > 0.9) ctx.fillStyle = `rgba(100, 200, 255, ${p.life})`

                ctx.fill()
            }

            af = requestAnimationFrame(loop)
        }

        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth
                canvasRef.current.height = window.innerHeight
            }
        }
        window.addEventListener('resize', resize)
        resize()
        loop()

        return () => {
            cancelAnimationFrame(af)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <>
            <style>{`
                body, a, button, input { cursor: none !important; }
            `}</style>

            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[9998]"
            />

            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] mix-blend-difference will-change-transform"
                style={{
                    left: 0,
                    top: 0,
                    // Initial position off-screen
                    transform: 'translate3d(-100px, -100px, 0)'
                }}
            >
                {/* Visual Cursor */}
                <div className={`
                    absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-all duration-200
                    ${hovering ? 'w-8 h-8 bg-white/20' : 'w-4 h-4 bg-white'}
                `} />

                <div className="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-cyan-500 rounded-full" />
            </div>
        </>
    )
}
