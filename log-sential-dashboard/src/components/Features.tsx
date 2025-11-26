import React from 'react';
import { Zap, Eye, Lock, Code2, Bell, Cpu } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Instant Instrumentation",
    description: "Zero config required. We auto-hook into Express middleware, Mongo drivers, and React Error Boundaries upon installation."
  },
  {
    icon: <Eye className="w-6 h-6 text-blue-400" />,
    title: "Full Stack Visibility",
    description: "Trace a request from the React frontend button click, through the Express API, down to the MongoDB query execution."
  },
  {
    icon: <Lock className="w-6 h-6 text-emerald-400" />,
    title: "Threat Detection",
    description: "Pre-configured rulesets for common attacks: SQL/NoSQL Injection, XSS, Brute Force, and Rate Limiting abuse."
  },
  {
    icon: <Code2 className="w-6 h-6 text-purple-400" />,
    title: "Developer First",
    description: "Built for VS Code, not complex enterprise dashboards. View logs and alerts where you work."
  },
  {
    icon: <Bell className="w-6 h-6 text-rose-400" />,
    title: "Real-time Alerting",
    description: "Get notified via Slack, Discord, or Email the second a critical anomaly is detected in production."
  },
  {
    icon: <Cpu className="w-6 h-6 text-cyan-400" />,
    title: "Minimal Overhead",
    description: "Written in Rust-powered Node modules for < 1ms latency impact on your application throughput."
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-background to-background pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Enterprise Security. <span className="text-primary">Indie Simplicity.</span>
          </h2>
          <p className="text-lg text-gray-400">
            Stop building your own logging infrastructure. Get enterprise-grade SIEM capabilities specifically tuned for JavaScript applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-[#121214] border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;