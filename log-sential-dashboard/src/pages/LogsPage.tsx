import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, Copy, Check, ShieldAlert, Activity, Terminal, Filter
} from 'lucide-react';
import SimpleChart from '../components/SimpleChart';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

const getStatusColor = (status: number): string => {
    if (status >= 500) return 'text-red-500';
    if (status >= 400) return 'text-red-400';
    if (status >= 300) return 'text-yellow-500';
    if (status >= 200) return 'text-green-500';
    return 'text-gray-400';
};

interface LogEvent {
    id: number;
    project_id: string;
    user_id?: string;
    ip: string;
    method: string;
    url: string;
    status: number;
    duration: number;
    user_agent: string;
    alert: string;
    severity: string;
    timestamp: string;
}

interface Alert {
    id: number;
    project_id: string;
    log_id: number;
    rule_id: string;
    message: string;
    severity: string;
    created_at: string;
}

interface Project {
    id: string;
    project_name: string;
    api_key: string;
}

export default function ProjectDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    /** 🔥 STATES (REAL DATA READY) */
    const [project, setProject] = useState<Project | null>(null);
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [chartData, setChartData] = useState<number[]>(new Array(20).fill(10));
    const [filteredLogs, setFilteredLogs] = useState<LogEvent[]>([]);
    const [activeTab, setActiveTab] = useState<'monitor' | 'alerts'>('monitor');
    const [showFilters, setShowFilters] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('ALL');
    const [copied, setCopied] = useState(false);
    const [isLive, setIsLive] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    /** 1️⃣ FETCH PROJECT DETAILS */
    useEffect(() => {
        (async () => {
            const { data } = await supabase.from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (data) setProject(data);
        })();
    }, [projectId]);

    /** 2️⃣ FETCH REAL LOGS (Supabase) */
    async function fetchLogs() {
        const { data } = await supabase
            .from('logs')
            .select('*')
            .eq('project_id', projectId)
            .order('timestamp', { ascending: false });

        if (data) {
            setLogs(data);
            setFilteredLogs(data);
        }
    }

    async function fetchAlerts() {
        const { data } = await supabase
            .from('alerts')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (data) {
            setAlerts(data);
        }
    }

    useEffect(() => {
        if (!projectId) return;
        
        fetchLogs();
        fetchAlerts();

        const logsChannel = supabase
            .channel(`log-stream-${projectId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "logs", filter: `project_id=eq.${projectId}` },
                (payload) => {
                    if (isLive) {
                        const newLog = payload.new as LogEvent;
                        setLogs((prev) => [newLog, ...prev]);
                        setFilteredLogs((prev) => [newLog, ...prev]);
                        setChartData((prev) => [...prev.slice(1), newLog.duration]);
                    }
                }
            )
            .subscribe((status) => {
                console.log('Logs channel status:', status);
            });

        const alertsChannel = supabase
            .channel(`alerts-stream-${projectId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "alerts", filter: `project_id=eq.${projectId}` },
                (payload) => {
                    if (isLive) {
                        const newAlert = payload.new as Alert;
                        setAlerts((prev) => [newAlert, ...prev]);
                    }
                }
            )
            .subscribe((status) => {
                console.log('Alerts channel status:', status);
            });

        return () => {
            supabase.removeChannel(logsChannel);
            supabase.removeChannel(alertsChannel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    /** 3️⃣ FILTERS (REAL FILTERING) */
    useEffect(() => {
        const text = filterText.toLowerCase();
        const filtered = logs.filter((log) =>
            ((log.alert && log.alert.toLowerCase().includes(text)) ||
                log.method.toLowerCase().includes(text) ||
                log.ip.includes(text) ||
                log.url.toLowerCase().includes(text)) &&
            (filterSeverity === 'ALL' || (log.severity && log.severity === filterSeverity))
        );
        
        setFilteredLogs(filtered);
    }, [filterText, filterSeverity, logs]);


    /** 4️⃣ COPY API KEY */
    const handleCopy = () => {
        navigator.clipboard.writeText(project?.api_key || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!project) return <p className="text-white p-6">Loading...</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col h-auto lg:h-[calc(100vh-64px)] overflow-hidden">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{project.project_name}</h1>
                        <div className="flex items-center gap-2 text-sm font-mono text-gray-500 mt-1">
                            <span>{project.id}</span>
                            <span className="w-[1px] h-4 bg-gray-600" />
                            <span onClick={handleCopy} className="cursor-pointer group flex items-center gap-1">
                                {project.api_key.slice(0, 12)}...
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-4 py-2 rounded-lg text-sm ${isLive ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                >
                    {isLive ? '⏸ Pause Live' : '▶ Resume Live'}
                </button>
            </div>

            {/* ================= TABS ================= */}
            <div className="flex gap-6 border-b border-white/10 mb-6 overflow-x-auto text-sm">
                <button
                    onClick={() => setActiveTab('monitor')}
                    className={`pb-3 border-b-2 ${activeTab === 'monitor' ? 'text-white border-primary' : 'text-gray-400 border-transparent'
                        }`}
                >
                    Live Monitor
                </button>
                <button
                    onClick={() => setActiveTab('alerts')}
                    className={`pb-3 border-b-2 ${activeTab === 'alerts' ? 'text-white border-primary' : 'text-gray-400 border-transparent'
                        }`}
                >
                    Alerts {alerts.length > 0 && (
                        <span className="ml-2 px-1 py-0.5 bg-rose-500/10 text-rose-500 text-xs rounded-full">
                            {alerts.length}
                        </span>
                    )}
                </button>
            </div>

            {/* ================= CONTENT ================= */}
            {
                activeTab === "monitor" ? (
                    <MonitorTab
                        logs={filteredLogs}
                        chartData={chartData}
                        alerts={alerts}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        filterText={filterText}
                        setFilterText={setFilterText}
                        filterSeverity={filterSeverity}
                        setFilterSeverity={setFilterSeverity}
                        scrollRef={scrollRef}
                    />
                ) : (
                    <AlertTab alerts={alerts} />
                )}

        </div>
    );
}

/* ============================================
   🔥 SPLIT COMPONENTS – MAKES IT 100% CLEAN
============================================ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MonitorTab({ logs, chartData, alerts, showFilters, setShowFilters, filterText, setFilterText, filterSeverity, setFilterSeverity, scrollRef }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full lg:overflow-hidden">

            {/* LEFT SIDE */}
            <div className="flex flex-col gap-6 min-h-0 shrink-0">

                {/* CHART */}
                <div className="bg-surface border border-white/10 rounded-xl p-5 h-64">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" /> Traffic Volume
                        </h3>
                        <span className="text-xs text-gray-500">Last 60s</span>
                    </div>
                    <SimpleChart data={chartData} />
                </div>

                {/* RECENT ALERTS */}
                <div className="bg-surface border border-white/10 rounded-xl p-5 flex flex-col overflow-hidden h-full">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-gray-300 text-sm flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-500" /> Recent Alerts
                        </h3>
                    </div>
                    <div className="overflow-y-auto space-y-3 px-3">
                        {alerts.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-6">No threats detected.</p>
                        ) : alerts.slice(0, 6).map((alert: Alert) => (
                            <div key={alert.id} className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-rose-400 truncate">{alert.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">Rule: {alert.rule_id}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${alert.severity.toLowerCase() === 'high' || alert.severity.toLowerCase() === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        {alert.severity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE – LOG CONSOLE */}
            <div className="col-span-2 bg-[#111113] border border-white/10 rounded-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="border-b border-white/10 bg-[#141416] flex justify-between px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Terminal size={14} className="text-gray-500" /> stream_output.log
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)}>
                        <Filter className={`w-4 h-4 ${showFilters ? 'text-primary' : 'text-gray-400'}`} />
                    </button>
                </div>

                {/* FILTERS */}
                {showFilters && (
                    <div className="p-3 bg-surface flex gap-2 border-b border-white/10">
                        <input
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Search logs..."
                            className="bg-black/40 px-3 py-1 rounded w-full text-white text-sm"
                        />
                        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="bg-black/40 px-2 py-1 rounded text-white text-sm">
                            <option value="ALL">All Severity</option>
                            <option value="INFO">INFO</option>
                            <option value="WARNING">WARNING</option>
                            <option value="CRITICAL">CRITICAL</option>
                        </select>
                    </div>
                )}

                {/* LOG STREAM */}
                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto text-xs font-mono space-y-1">
                    {logs.map((log: LogEvent) => (
                        <div key={log.id} className="p-2 hover:bg-white/5 rounded">
                            <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>{' '}
                            <span className={getStatusColor(log.status)}>
                                {log.status}
                            </span>{' '}
                            {log.method} {log.url}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AlertTab({ alerts }: { alerts: Alert[] }) {
    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case "high":
            case "critical":
                return "bg-red-500/20 text-red-400 border-red-600/40";
            case "medium":
            case "warning":
                return "bg-yellow-500/20 text-yellow-300 border-yellow-600/40";
            case "low":
            case "info":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-600/40";
            default:
                return "bg-zinc-500/20 text-zinc-300 border-zinc-600/40";
        }
    };

    return (
        <div className="bg-[#111113] border border-white/10 rounded-xl p-6 overflow-y-auto h-full">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-500" /> Alert History
            </h2>

            {!alerts.length ? (
                <p className="text-gray-500 text-sm">No alerts detected.</p>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`p-4 rounded-lg border transition ${getSeverityColor(alert.severity)}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-black/30 px-2 py-1 rounded">Rule: {alert.rule_id}</span>
                                    <span className="text-xs font-semibold uppercase">{alert.severity}</span>
                                </div>
                                <span className="text-xs opacity-70">{new Date(alert.created_at).toLocaleString()}</span>
                            </div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-xs opacity-75 mt-2">Log ID: {alert.log_id}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
