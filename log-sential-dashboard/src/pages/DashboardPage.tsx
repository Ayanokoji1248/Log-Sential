import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CreateProjectModal from "../components/CreateProjectModal";
import { Shield } from "lucide-react";

interface Project {
    id: string;
    project_name: string;
    api_key: string;
    created_at?: string;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false)

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const refreshProject = () => {
        fetchProjects(user.id)
    }


    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return navigate("/");
            setUser(data.user);
            fetchProjects(data.user.id);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchProjects(userId: string) {
        setIsLoading(true)
        const { data, error } = await supabase.from("projects").select("*").eq("user_id", userId);
        if (error) return console.error(error);
        setProjects(data || []);
        setIsLoading(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (<>
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div
                        className="flex items-center gap-2 cursor-pointer">
                        <div className="p-1.5 bg-primary/20 rounded-lg">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Instant<span className="text-primary">SIEM</span>
                        </span>
                    </div>



                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to={'/'} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Docs</a>

                        </div>
                    </div>



                    <div className="flex items-center gap-4">

                        <button
                            onClick={handleLogout}
                            className="w-full sm:w-auto px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg font-medium text-rose-400 hover:bg-rose-500/20 transition-colors text-sm cursor-pointer duration-300"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </div>
        </nav>
        <div className="min-h-screen bg-[#111113] text-white px-4 sm:px-6 md:px-8 py-8 font-sans pt-24">

            {/* Navbar */}

            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">{user?.email}</h2>
                    <p className="text-sm text-gray-500 mt-1 font-mono">Dashboard Overview</p>
                </div>


            </div>

            {/* Content Container */}
            <div className="max-w-6xl mx-auto w-full">

                {/* Create Project */}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/80 transition-colors"
                >
                    + Create New Project
                </button>

                {
                    showModal && (
                        <CreateProjectModal
                            onClose={() => setShowModal(false)}
                            onProjectCreated={refreshProject}
                        />
                    )
                }

                {isLoading ? (

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-surface border border-white/10 rounded-xl">
                                <div className="h-4 w-1/2 bg-white/10 rounded mb-4"></div>
                                <div className="h-3 w-3/4 bg-white/10 rounded mb-2"></div>
                                <div className="h-3 w-2/3 bg-white/10 rounded mb-6"></div>
                                <div className="h-8 bg-white/10 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="group p-6 bg-surface border border-white/10 rounded-xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                        {project.project_name}
                                    </h3>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>

                                {/* ID */}
                                <div className="text-sm font-mono text-gray-500 mb-4">
                                    ID: <span className="text-gray-300">{project.id}</span>
                                </div>

                                {/* API Key */}
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <p className="text-xs text-gray-500">API Key:</p>
                                    <code className="text-xs font-mono bg-[#111113] px-2 py-1 rounded-lg border border-white/10">
                                        {project.api_key.substring(0, 16)}...
                                    </code>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(project.api_key, project.id);
                                        }}
                                        className={`text-xs px-2 py-1 rounded-md border transition-all ${copiedId === project.id
                                            ? "border-primary bg-primary/10 text-primary scale-105 animate-pulse"
                                            : "border-white/10 bg-[#111113] hover:bg-white/5"
                                            }`}
                                    >
                                        {copiedId === project.id ? "Copied ✓" : "Copy"}
                                    </button>

                                </div>

                                {/* Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/logs/${project.id}`);
                                    }}
                                    className="w-full mt-6 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/80 transition-all"
                                >
                                    View Logs →
                                </button>
                            </div>
                        ))}

                        {projects.length === 0 && (
                            <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                                <p className="text-lg text-gray-400">No projects yet</p>
                                <p className="text-sm text-gray-500 font-mono mt-1">Start by creating one above</p>
                            </div>
                        )}
                    </div>

                )}



            </div>
        </div>
    </>
    );
}
