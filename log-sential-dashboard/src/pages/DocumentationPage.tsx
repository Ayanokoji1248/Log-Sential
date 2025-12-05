import React, { useState } from 'react';
import { Copy, Check, Server, Shield, Globe, Info, MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CodeBlock: React.FC<{ code: string; label?: string }> = ({ code, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e] my-4">
            {label && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                    <span className="text-xs text-gray-400 font-mono">{label}</span>
                </div>
            )}
            <div className="p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                <pre>{code}</pre>
            </div>
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                aria-label="Copy code"
            >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    );
};

const DocumentationPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={'/'} className='text-sm w-fit flex gap-3 p-3 bg-surface rounded-md items-center cursor-pointer text-zinc-300'><MoveLeft /> Back To Home</Link>

                {/* Header */}
                <div className="mb-16 mt-5">
                    <h1 className="text-4xl font-bold text-white mb-6">Documentation</h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Get your MERN application secured and monitored in under 2 minutes.
                        Follow this guide to integrate the LogSentinel agent.
                    </p>
                </div>

                {/* How It Works */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Globe className="w-6 h-6 text-primary" />
                        How It Works
                    </h2>
                    <div className="bg-surface border border-white/10 rounded-xl p-8">
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Once installed and configured, the <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary">log-sential-agent</code> automatically wraps your Express middleware and database drivers. It monitors incoming requests, database queries, and errors in real-time, sending security logs to your specific LogSentinel collector endpoint.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5 text-center">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Server className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">1. Auto-Instrument</h3>
                                <p className="text-xs text-gray-500">Hooks into Node.js runtime</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5 text-center">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">2. Analyze</h3>
                                <p className="text-xs text-gray-500">Detects threats locally</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5 text-center">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">3. Report</h3>
                                <p className="text-xs text-gray-500">Streams to Dashboard</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Setup */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">1</span>
                        Create Your Account
                    </h2>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p>
                            Before installing the package, you need to generate your project credentials.
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 mt-4 marker:text-gray-500">
                            <li>Visit the <strong>Dashboard</strong> tab in this application.</li>
                            <li>Click on <strong>New Project</strong> to create a container for your logs.</li>
                            <li>Once created, you will receive three critical pieces of information:
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                                    <li><code className="text-primary">projectId</code> - Identifies your application.</li>
                                    <li><code className="text-primary">apiKey</code> - Authenticates the agent.</li>
                                    <li><code className="text-primary">collectorUrl</code> - The endpoint where logs are sent.</li>
                                </ul>
                            </li>
                        </ol>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6 flex gap-3">
                            <Info className="w-5 h-5 text-yellow-500 shrink-0" />
                            <p className="text-sm text-yellow-200 m-0">
                                <strong>Important:</strong> Keep your API Key secret. Do not commit it to public repositories. Use environment variables (e.g., <code>.env</code>) in production.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Installation */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">2</span>
                        Installation
                    </h2>
                    <p className="text-gray-300 mb-4">Install the agent via npm in your backend project root:</p>
                    <CodeBlock
                        code="npm install log-sential-agent"
                        label="Terminal"
                    />
                </section>

                {/* Configuration */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs">3</span>
                        Quick Setup (Express)
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Initialize the agent at the very top of your main server file (e.g., <code>index.js</code> or <code>app.js</code>), before defining any routes.
                    </p>

                    <CodeBlock
                        label="index.js / app.js"
                        code={`import express from "express";
import { logsential } from "log-sential-agent";

const app = express();

// Initialize the agent before routes
app.use(
  logsential({
    projectId: "YOUR_PROJECT_ID",
    apiKey: "YOUR_API_KEY",
    collectorUrl: "https://api.logsential.com/v1/collect" // or your specific URL
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`}
                    />

                    <p className="text-gray-400 text-sm mt-4">
                        That’s it! Your application will now automatically stream logs to the dashboard. You can verify the connection by checking the "Live Monitor" tab in your project view.
                    </p>
                </section>

            </div>
        </div>
    );
};

export default DocumentationPage;