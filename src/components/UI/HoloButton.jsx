import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

export function HoloButton({ children, onClick, className = '' }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                relative px-6 py-3 
                bg-black/40 backdrop-blur-md 
                border border-white/20 
                rounded-lg 
                text-white uppercase tracking-widest text-sm font-light 
                overflow-hidden group
                transition-all duration-300
                hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]
                ${className}
            `}
        >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 translate-y-[-100%] group-hover:translate-y-[100%] transition-all duration-1000 ease-in-out pointer-events-none" />

            {/* Glow corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50 opacity-50 group-hover:opacity-100 transition-opacity" />

            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    )
}
