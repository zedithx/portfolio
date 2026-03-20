'use client';
import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
                    <div className="text-center p-8 max-w-md">
                        <div className="text-red-400 text-6xl mb-4">⚠</div>
                        <h2 className="text-white text-xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-white/60 text-sm mb-6">
                            An unexpected error occurred. Please refresh the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
