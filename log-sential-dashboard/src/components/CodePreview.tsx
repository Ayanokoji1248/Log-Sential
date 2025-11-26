import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

const CodePreview: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const command = "npm install @axel12/log-sential-agent";

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 font-mono">Terminal</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
            </div>

            <div className="p-6 font-mono text-sm">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-500">➜</span>
                        <span className="text-blue-400">~</span>
                        <span className="text-gray-300">{command}</span>
                        <span className="w-2 h-4 bg-gray-500 animate-pulse" />
                    </div>

                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                        aria-label="Copy command"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <div className="mt-2 text-gray-500 text-xs">
                    + @axel12/log-sential-agent@1.0.0<br />
                    added 1 package in 0.5s
                </div>
            </div>
        </div>
    );
};

export default CodePreview;