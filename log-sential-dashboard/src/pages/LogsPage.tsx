import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

interface LogEntry {
    id: number;
    ip: string;
    method: string;
    url: string;
    status: number;
    duration: number;
    user_agent: string;
    severity?: string;
    timestamp: string;
}

export default function LogsPage() {

    const { projectId } = useParams();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLogs();


        const channel = supabase
            .channel('logs-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'logs', filter: `project_id=eq.${projectId}` },
                () => fetchLogs()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchLogs() {
        const { data, error } = await supabase
            .from("logs")
            .select("*")
            .eq("project_id", projectId)
            .order("timestamp", { ascending: false });

        if (error) return alert(error.message);
        setLogs(data || []);
    }

    // 📊 Stats
    const totalLogs = logs.length;
    const errorLogs = logs.filter((log) => log.status >= 400).length;
    const avgResponse = logs.reduce((acc, curr) => acc + curr.duration, 0) / totalLogs || 0;

    // 📈 Chart Data
    const chartData = {
        labels: logs.map((l) => new Date(l.timestamp).toLocaleTimeString()).reverse(),
        datasets: [
            {
                label: "Response Time (ms)",
                data: logs.map((l) => l.duration).reverse(),
                borderColor: "rgb(16,185,129)",
                pointRadius: 2,
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex">

            {/* Optional Sidebar 🔥 */}
            <Sidebar projectId={projectId} />

            {/* MAIN CONTENT */}
            <div className="w-full ml-0 md:ml-64 p-8 transition-all">

                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-semibold tracking-wide">
                        Project Logs – <span className="text-emerald-400">{projectId}</span>
                    </h2>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-zinc-300 hover:text-white transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 shadow-md hover:shadow-emerald-500/20 transition">
                        <p className="text-sm text-zinc-400">Total Logs</p>
                        <h3 className="text-3xl font-bold">{totalLogs}</h3>
                    </div>

                    <div className="p-6 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 shadow-md hover:shadow-red-500/20 transition">
                        <p className="text-sm text-zinc-400">Errors</p>
                        <h3 className="text-3xl font-bold text-red-500">{errorLogs}</h3>
                    </div>

                    <div className="p-6 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 shadow-md hover:shadow-blue-500/20 transition">
                        <p className="text-sm text-zinc-400">Avg Response</p>
                        <h3 className="text-3xl font-bold text-blue-400">{Math.round(avgResponse)} ms</h3>
                    </div>
                </div>

                {/* CHART */}
                <div className="p-6 h-108 w-full bg-zinc-800 rounded-xl border border-zinc-700 mb-10 shadow-xl flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-4">📈 Request Performance</h3>
                    {logs.length > 0 ? <Line data={chartData} /> : <p>No data for chart.</p>}
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl">
                        <thead>
                            <tr className="bg-zinc-700 text-sm text-zinc-300 uppercase tracking-wide">
                                <th className="p-3">Method</th>
                                <th className="p-3">URL</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">IP</th>
                                <th className="p-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="border-t border-zinc-700 hover:bg-zinc-700/50 transition"
                                >
                                    <td className="p-2">{log.method}</td>
                                    <td className="p-2">{log.url}</td>
                                    <td className={log.status >= 400 ? "text-red-500 p-2" : "text-emerald-400 p-2"}>
                                        {log.status}
                                    </td>
                                    <td className="p-2">{log.duration}ms</td>
                                    <td className="p-2">{log.ip}</td>
                                    <td className="p-2 text-sm">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

// 👇 Add prop here
function Sidebar({ projectId }: { projectId: string | undefined }) {
    const navigate = useNavigate();

    return (
        <div className="bg-zinc-950/80 backdrop-blur-lg text-white h-full w-64 p-6 fixed left-0 top-0 border-r border-zinc-800">
            <h2 className="text-xl font-bold mb-8 tracking-wide">LOGSENTIAL</h2>

            <nav className="space-y-3">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="block hover:text-emerald-400 transition"
                >
                    Dashboard
                </button>

                <button
                    onClick={() => projectId && navigate(`/alerts/${projectId}`)}
                    className="block hover:text-emerald-400 transition"
                    disabled={!projectId}
                >
                    Alerts
                </button>

                <button
                    onClick={() => navigate("/settings")}
                    className="block hover:text-emerald-400 transition"
                >
                    Settings
                </button>
            </nav>
        </div>
    );
}

