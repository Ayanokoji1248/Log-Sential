import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface Project {
    id: string;
    project_name: string;
    api_key: string;
    created_at?: string;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return navigate("/");
            setUser(data.user);
            fetchProjects(data.user.id);
        });
    }, []);

    async function fetchProjects(userId: string) {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", userId);

        if (error) return console.error(error);
        setProjects(data || []);
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6">

            {/* 🔹 Navbar */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold">
                    Welcome, {user?.email}
                </h2>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 text-sm"
                >
                    Logout
                </button>
            </div>

            {/* ➕ Create project */}
            <button
                onClick={() => navigate("/create-project")}
                className="bg-emerald-600 px-4 py-2 rounded-lg mb-6 hover:bg-emerald-500"
            >
                ➕ Create New Project
            </button>

            {/* 🔽 Project List */}
            <div className="space-y-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
                    >
                        <h3 className="text-lg font-semibold mb-1">{project.project_name}</h3>
                        <p className="text-sm text-zinc-400 mb-2">
                            Project ID: <span className="text-emerald-400">{project.id}</span>
                        </p>

                        {/* API KEY */}
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm text-zinc-400">API Key:</p>
                            <code className="text-sm bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-700">
                                {project.api_key}
                            </code>
                            <button
                                onClick={() => copyToClipboard(project.api_key)}
                                className="text-xs bg-zinc-700 px-2 py-1 rounded-lg hover:bg-zinc-600"
                            >
                                Copy
                            </button>
                        </div>

                        <button
                            onClick={() => navigate(`/logs/${project.id}`)}
                            className="bg-emerald-600 mt-4 px-3 py-2 rounded-lg text-sm hover:bg-emerald-500"
                        >
                            View Logs →
                        </button>
                    </div>
                ))}

                {projects.length === 0 && (
                    <p className="text-zinc-400">No projects found. Create one above.</p>
                )}
            </div>
        </div>
    );
}
