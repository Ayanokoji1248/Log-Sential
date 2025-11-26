import React, { useState, useEffect, useRef } from 'react';
import {
    Shield,
    ShieldAlert,
    Terminal,
    Activity,
    Lock,
    Globe,
} from 'lucide-react';
import { type LogEvent } from "../lib/types"


const MOCK_TRAFFIC = [
    { type: 'INFO', source: 'EXPRESS', message: 'GET /api/users 200 45ms' },
    { type: 'INFO', source: 'EXPRESS', message: 'GET /api/products 200 12ms' },
    { type: 'INFO', source: 'MONGO', message: 'Query: db.users.findOne({ _id: ... })' },
    { type: 'INFO', source: 'REACT', message: 'Route change: /dashboard -> /settings' },
    { type: 'INFO', source: 'AUTH', message: 'Token verified for user_123' },
];

const MOCK_THREATS = [
    { type: 'CRITICAL', source: 'MONGO', message: 'Suspicious query: { $where: "this.password.match(/.*/)" }' },
    { type: 'WARN', source: 'EXPRESS', message: 'Rate limit: IP 192.168.1.45 blocked (1000 req/s)' },
    { type: 'CRITICAL', source: 'EXPRESS', message: 'SQL Injection: "UNION SELECT * FROM users"' },
    { type: 'WARN', source: 'REACT', message: 'XSS Payload detected in input: <script>alert(1)</script>' },
    { type: 'CRITICAL', source: 'AUTH', message: 'Brute force detected: 50 failed attempts/min' },
];

const LiveDashboard: React.FC = () => {
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [threatCount, setThreatCount] = useState(0);
    const [requestCount, setRequestCount] = useState(1240);
    const [systemStatus, setSystemStatus] = useState<'SECURE' | 'THREAT_DETECTED'>('SECURE');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize with some logs
    useEffect(() => {
        setLogs([
            { id: 'init-1', timestamp: new Date().toLocaleTimeString(), type: 'INFO', source: 'SYSTEM', message: 'LogSential Agent v1.0.0 started' },
            { id: 'init-2', timestamp: new Date().toLocaleTimeString(), type: 'INFO', source: 'SYSTEM', message: 'Hooked: Express Middleware' },
            { id: 'init-3', timestamp: new Date().toLocaleTimeString(), type: 'INFO', source: 'SYSTEM', message: 'Hooked: Mongoose Drivers' },
        ]);
    }, []);

    // Simulate traffic loop
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const isThreat = Math.random() > 0.85; // 15% chance of threat

            let logEntry: LogEvent;

            if (isThreat) {
                const threat = MOCK_THREATS[Math.floor(Math.random() * MOCK_THREATS.length)];
                logEntry = {
                    id: Math.random().toString(36).substring(7),
                    timestamp: now.toLocaleTimeString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type: threat.type as any,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    source: threat.source as any,
                    message: threat.message
                };
                setThreatCount(c => c + 1);
                setSystemStatus('THREAT_DETECTED');
                // Reset status after 2 seconds
                setTimeout(() => setSystemStatus('SECURE'), 2000);
            } else {
                const traffic = MOCK_TRAFFIC[Math.floor(Math.random() * MOCK_TRAFFIC.length)];
                logEntry = {
                    id: Math.random().toString(36).substring(7),
                    timestamp: now.toLocaleTimeString(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type: traffic.type as any,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    source: traffic.source as any,
                    message: traffic.message
                };
                setRequestCount(c => c + 1);
            }

            setLogs(prev => [logEntry, ...prev].slice(0, 100)); // Keep last 100 logs
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto glass-panel rounded-xl overflow-hidden shadow-2xl border border-white/10 mt-12 flex flex-col md:flex-row min-h-[500px]">

            {/* Left Panel: Status & Metrics */}
            <div className="w-full md:w-80 bg-[#0c0c0e] border-r border-white/5 p-6 flex flex-col gap-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">System Status</h3>
                    <div className={`
            p-4 rounded-lg border flex items-center gap-4 transition-all duration-500
            ${systemStatus === 'SECURE'
                            ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'bg-red-500/10 border-red-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)] animate-pulse'
                        }
          `}>
                        {systemStatus === 'SECURE' ? (
                            <Shield className="w-8 h-8 text-emerald-500" />
                        ) : (
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                        )}
                        <div>
                            <div className={`text-lg font-bold ${systemStatus === 'SECURE' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {systemStatus === 'SECURE' ? 'SECURE' : 'THREAT DETECTED'}
                            </div>
                            <div className="text-xs text-gray-400">
                                {systemStatus === 'SECURE' ? 'All systems operational' : 'Automated block applied'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <Globe className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Requests Analyzed</span>
                        </div>
                        <div className="text-2xl font-mono text-white">{requestCount.toLocaleString()}</div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Threats Blocked</span>
                        </div>
                        <div className="text-2xl font-mono text-white">{threatCount}</div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">Active Connectors</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-500/20">Express</span>
                            <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-500/20">Mongo</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Console & AI */}
            <div className="flex-1 bg-[#111113] flex flex-col">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#141416]">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="font-mono">live_events.log</span>
                    </div>
                </div>


                {/* Log Stream */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto p-4 space-y-1 font-mono text-xs" ref={scrollRef}>
                        {logs.map((log) => (
                            <div
                                key={log.id}
                                className="group flex gap-3 hover:bg-white/5 p-1 rounded transition-colors"
                            >
                                <span className="text-gray-600 shrink-0 w-20">{log.timestamp}</span>
                                <span className={`shrink-0 w-16 font-bold ${log.type === 'CRITICAL' ? 'text-red-500' :
                                    log.type === 'WARN' ? 'text-yellow-500' :
                                        'text-emerald-500'
                                    }`}>
                                    {log.type}
                                </span>
                                <span className="text-gray-500 shrink-0 w-16 uppercase text-[10px] pt-0.5 tracking-wider">
                                    [{log.source}]
                                </span>
                                <span className={`break-all ${log.type === 'CRITICAL' ? 'text-red-200' : 'text-gray-300'
                                    }`}>
                                    {log.message}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveDashboard;