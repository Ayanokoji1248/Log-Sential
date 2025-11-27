import { useEffect, useState } from "react"
import Features from "../components/Features"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Navbar from "../components/NavBar"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

const HomePage = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return navigate("/");
            setIsLoggedIn(true)
        });
    }, [])
    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary-foreground">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="pt-16">

                <>
                    <Hero />
                    <Features />

                    {/* Comparison Section */}
                    <section className="py-24 bg-[#0c0c0e] border-y border-white/5">
                        <div className="max-w-4xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-16">Why we built this</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-2xl bg-red-900/5 border border-red-500/10">
                                    <h3 className="text-xl font-bold text-red-400 mb-4">Traditional SIEM (Wazuh, ELK)</h3>
                                    <ul className="space-y-3 text-gray-400">
                                        <li className="flex items-start gap-2">❌ Requires dedicated DevOps team</li>
                                        <li className="flex items-start gap-2">❌ Heavy Java/Elasticsearch resource usage</li>
                                        <li className="flex items-start gap-2">❌ Weeks to configure regex rules</li>
                                        <li className="flex items-start gap-2">❌ Overkill for a simple SaaS</li>
                                    </ul>
                                </div>
                                <div className="p-8 rounded-2xl bg-emerald-900/5 border border-emerald-500/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-xl border-l border-b border-emerald-500/20 text-xs text-emerald-400 font-bold">
                                        RECOMMENDED
                                    </div>
                                    <h3 className="text-xl font-bold text-emerald-400 mb-4">Instant MERN SIEM</h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start gap-2">✅ 1 npm install @axel12/log-sential-agent</li>
                                        <li className="flex items-start gap-2">✅ Runs inside your Node process</li>
                                        <li className="flex items-start gap-2">✅ Auto-detects Mongo & Express events</li>
                                        <li className="flex items-start gap-2">✅ Live in 60 seconds</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-32 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-b from-background to-primary/5 pointer-events-none" />
                        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                            <h2 className="text-4xl font-bold mb-6">Ready to secure your app?</h2>
                            <p className="text-xl text-gray-400 mb-10">
                                Open source. Free forever for indie devs. The way security should be.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button className="px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/20">
                                    npm install @axel12/log-sential-agent
                                </button>
                                <button className="px-8 py-4 bg-[#1e1e1e] text-white font-bold rounded-xl hover:bg-[#252525] border border-white/10 transition-colors">
                                    Read Documentation
                                </button>
                            </div>
                        </div>
                    </section>

                    <Footer />
                </>
            </main>
        </div>
    )
}

export default HomePage