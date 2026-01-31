import React from 'react'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white p-8 pointer-events-auto">
                    <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-xl max-w-lg text-center backdrop-blur-md">
                        <h2 className="text-3xl font-bold mb-4 text-red-500">Reality Distortion Detected</h2>
                        <p className="text-gray-300 mb-6">
                            The fabric of this dimension has encountered a glitch.
                            Don't worry, even stars flicker sometimes.
                        </p>
                        <div className="bg-black/50 p-4 rounded text-left text-xs font-mono text-red-300 mb-6 overflow-auto max-h-32">
                            {this.state.error && this.state.error.toString()}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                        >
                            Restart Universe
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
