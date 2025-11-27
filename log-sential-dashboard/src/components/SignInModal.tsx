import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";

interface SignInModalProps {
    onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        setErrorMessage("");
        const redirectTo =
            import.meta.env.MODE === "development"
                ? "http://localhost:3000/"
                : "https://log-sential.vercel.app/";

        const { error } = await supabase.auth.signInWithOtp({
            email, options: {
                emailRedirectTo: redirectTo
            }
        });

        setIsSending(false);

        if (error) {
            setErrorMessage(error.message);
        } else {
            setEmailSent(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#111113] border border-white/10 rounded-xl p-6 w-full max-w-md relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold text-white mb-4">
                    Sign In to <span className="text-primary">InstantSIEM</span>
                </h2>

                {!emailSent ? (
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm">Email Address</label>
                            <div className="flex items-center border border-white/10 rounded-lg mt-1 bg-[#111113] px-3">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-transparent w-full p-2 focus:outline-none text-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSending}
                            className="w-full py-2 bg-primary text-black rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors"
                        >
                            {isSending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Send Magic Link"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                        <p className="text-gray-300 text-sm">
                            A login link has been sent to <span className="text-primary">{email}</span>.
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            Check your inbox (and spam folder).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignInModal;
