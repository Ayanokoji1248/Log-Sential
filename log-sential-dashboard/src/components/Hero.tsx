import React from 'react';
import { ArrowRight } from 'lucide-react';
import CodePreview from './CodePreview';
import LiveDashboard from './LiveDashboard';

const Hero: React.FC = () => {
    return (
        <section className="pt-15 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex flex-col items-center">
            {/* Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50 blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    v1.0 Public Beta is Live
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    Instant <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-emerald-300">SIEM</span> for <br className="hidden md:block" />
                    your MERN Stack.
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    The open-source security agent that auto-instruments your Express, Mongo, and React apps. Detect brute force, XSS, and anomalies with one npm install.
                </p>

                <div className="flex flex-col items-center justify-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="w-full max-w-lg">
                        <CodePreview />
                    </div>
                    <button className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="w-full max-w-7xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                <div className="text-center mb-4 text-sm text-gray-500 font-mono">
                    <span className="text-primary">●</span> Live Interactive Demo (Simulated Data)
                </div>
                <LiveDashboard />
            </div>
        </section>
    );
};

export default Hero;