import React from 'react';
import { Shield, Github, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
    currentView?: 'landing' | 'dashboard';
    onNavigate?: (view: 'landing' | 'dashboard') => void;
    isLoggedIn?: boolean;
    setSignInModal: (show: boolean) => void
}

const Navbar: React.FC<NavbarProps> = ({ currentView = 'landing', onNavigate, isLoggedIn, setSignInModal }) => {
    return (
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onNavigate?.('landing')}
                    >
                        <div className="p-1.5 bg-primary/20 rounded-lg">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Instant<span className="text-primary">SIEM</span>
                        </span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {currentView === 'landing' && (
                                <>
                                    <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                                    <a href="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">How It Works</a>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentView === 'landing' && isLoggedIn ? (
                            <Link to={'/dashboard'}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => setSignInModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/10"
                            >
                                Sign In
                            </button>
                        )}

                        <a
                            href="https://github.com/Ayanokoji1248/Log-Sential"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Github className="h-5 w-5" />
                            <span className="hidden sm:inline text-sm font-medium">Star</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;