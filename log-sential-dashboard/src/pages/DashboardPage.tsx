import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) navigate("/"); // redirect to login
            else setUser(data.user);
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col">
            {/* Top Navbar */}
            <header className="w-full flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">LogSentinel Dashboard</h2>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700"
                >
                    Logout
                </button>
            </header>

            {/* Welcome Section */}
            <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl shadow-lg max-w-lg">
                <h3 className="text-lg font-medium mb-2">
                    Welcome, <span className="text-emerald-400">{user?.email}</span>
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                    You can now create projects and connect your MERN apps using the agent.
                </p>

                <button
                    onClick={() => navigate("/create-project")}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg font-medium"
                >
                    ➕ Create New Project
                </button>
            </div>
        </div>
    );
}
