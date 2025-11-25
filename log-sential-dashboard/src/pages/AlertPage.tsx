import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Alert {
    id: number;
    project_id: string;
    log_id: number;
    rule_id: string;
    message: string;
    severity: string;
    created_at: string;
}

export default function AlertPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!projectId) navigate("/dashboard");
        fetchAlerts();

        // 🔥 Real-time updates (optional)
        const channel = supabase
            .channel("alerts-channel")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "alerts", filter: `project_id=eq.${projectId}` },
                () => fetchAlerts()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchAlerts() {
        const { data, error } = await supabase
            .from("alerts")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

        if (error) return console.error(error);
        setAlerts(data || []);
    }

    const filteredAlerts = alerts.filter((alert) =>
        alert.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-500/20 text-red-400 border-red-600/40";
            case "medium":
                return "bg-yellow-500/20 text-yellow-300 border-yellow-600/40";
            case "low":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-600/40";
            default:
                return "bg-zinc-500/20 text-zinc-300";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-6 md:p-10">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-wide">🔔 Security Alerts</h2>
                    <p className="text-zinc-400 text-sm">Project ID: {projectId}</p>
                </div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* SEARCH BAR */}
            <input
                className="w-full mb-6 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:ring-emerald-500 outline-none transition"
                placeholder="🔍 Search alerts..."
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* ALERT LIST */}
            {filteredAlerts.length === 0 ? (
                <div className="text-center mt-20 text-zinc-400">
                    <h3 className="text-xl mb-2">🚀 All Safe — No Alerts Yet!</h3>
                    <p className="text-sm">Try failed login simulation or SQLi test to trigger alerts.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {filteredAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-700 shadow-lg 
                        hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition duration-200"
                        >
                            {/* TOP SECTION */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">
                                    Rule: {alert.rule_id}
                                </span>

                                <span className={`px-3 py-1 rounded-lg text-sm border ${getSeverityColor(alert.severity)}`}>
                                    {alert.severity.toUpperCase()}
                                </span>
                            </div>

                            {/* MESSAGE */}
                            <h3 className="text-lg font-semibold mt-3">{alert.message}</h3>
                            <p className="text-xs text-zinc-500 mt-1">
                                {new Date(alert.created_at).toLocaleString()}
                            </p>

                            {/* BUTTON */}
                            <button
                                onClick={() => navigate(`/logs/${projectId}?log=${alert.log_id}`)}
                                className="mt-5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-sm"
                            >
                                View Log →
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
