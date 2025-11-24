import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // Redirect to /projects if user is already logged in
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) navigate("/dashboard");
        });
    }, []);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) alert(error.message);
        else alert("Check your email to log in!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-4">
            <div className="max-w-md w-full bg-zinc-800 p-8 rounded-xl shadow-lg border border-zinc-700">
                <h1 className="text-3xl font-bold text-center mb-6">LogSentinel</h1>
                <p className="text-sm text-zinc-400 text-center mb-8">
                    Security Monitoring Dashboard
                </p>

                <input
                    type="email"
                    className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500
          transition-colors text-white py-3 rounded-lg font-medium"
                >
                    Login with Magic Link
                </button>
            </div>
        </div>
    );
}
