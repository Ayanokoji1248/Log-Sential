import { useState, useEffect } from "react";
import { PlusCircle, X, Check, Copy } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import crypto from "crypto-js";

interface CreateProjectModalProps {
    onClose: () => void;
    onProjectCreated: () => void
}

export default function CreateProjectModal({ onClose, onProjectCreated }: CreateProjectModalProps) {
    const [projectName, setProjectName] = useState("");
    const [projectId, setProjectId] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [isCreated, setIsCreated] = useState(false);
    const [copiedField, setCopiedField] = useState(""); // which field was copied?

    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) navigate("/");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Copy handler
    const handleCopy = (value: string, field: "id" | "key") => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    };

    // Create project
    const generateApiKey = async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return alert("Please login first");

        // Check if project already exists
        const { data: existing } = await supabase
            .from("projects")
            .select("id")
            .eq("user_id", user.id)
            .eq("project_name", projectName)
            .single();

        if (existing) return alert("This project already exists!");

        // Generate key
        const generatedKey = crypto.lib.WordArray.random(16).toString();

        // Save in Supabase
        const { data, error } = await supabase
            .from("projects")
            .insert([{ user_id: user.id, project_name: projectName, api_key: generatedKey }])
            .select("id")
            .single();

        if (error) return alert(error.message);

        setProjectId(data.id);
        setApiKey(generatedKey);
        setIsCreated(true);
        onProjectCreated()
    };

    // ESC key closes
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">

            {/* MODAL BOX */}
            <div className="w-full max-w-md bg-surface border border-white/10 rounded-xl shadow-lg p-6 animate-in zoom-in-90 duration-200">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-primary" />
                        {isCreated ? "Project Created!" : "Create New Project"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BEFORE CREATION */}
                {!isCreated && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">
                            Create a new project to start monitoring API activity with LogSential.
                        </p>

                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. Production API Server"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 
              focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            autoFocus
                        />

                        <div className="flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
                                Cancel
                            </button>

                            <button
                                onClick={generateApiKey}
                                disabled={!projectName.trim()}
                                className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/80 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Project →
                            </button>
                        </div>
                    </div>
                )}

                {/* AFTER CREATION */}
                {isCreated && (
                    <div className="space-y-4 mt-4 animate-in fade-in duration-500">
                        {/* PROJECT ID */}
                        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Project ID</p>
                            <div className="flex justify-between items-center">
                                <code className="text-sm font-mono text-primary">{projectId}</code>
                                <button
                                    onClick={() => handleCopy(projectId, "id")}
                                    className="text-xs flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                                >
                                    {copiedField === "id" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    {copiedField === "id" ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* API KEY */}
                        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">API Key</p>
                            <div className="flex justify-between items-center">
                                <code className="text-sm font-mono text-primary">{apiKey}</code>
                                <button
                                    onClick={() => handleCopy(apiKey, "key")}
                                    className="text-xs flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                                >
                                    {copiedField === "key" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    {copiedField === "key" ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => navigate(`/logs/${projectId}`)}
                                className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/80 transition"
                            >
                                View Logs →
                            </button>

                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
