import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import crypto from "crypto-js";

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const navigate = useNavigate();

  // Protect route: redirect if not logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/");
    });
  }, []);

  const generateApiKey = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Please login first");


    // 🔍 Check if project already exists
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("project_name", projectName)
      .single();

    if (existing) {
      return alert("A project with this name already exists!");
    }

    // Generate API key (locally)
    const generatedKey = crypto.lib.WordArray.random(16).toString();

    // Save to Supabase DB & RETURN project_id
    const { data, error } = await supabase
      .from("projects")
      .insert([{ user_id: user.id, project_name: projectName, api_key: generatedKey }])
      .select("id")   // 👈 fetch project_id
      .single();      // 👈 return single row

    if (error) return alert(error.message);

    setApiKey(generatedKey);
    setProjectId(data.id);   // 👈 SAVE project_id
  };


  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 text-zinc-400 hover:text-white"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-lg bg-zinc-800 p-6 rounded-xl border border-zinc-700">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

        <input
          className="w-full p-3 bg-zinc-700 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter project name"
          onChange={(e) => setProjectName(e.target.value)}
        />

        <button
          onClick={generateApiKey}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 transition-colors 
                     text-white py-3 rounded-lg font-medium"
        >
          Generate API Key
        </button>

        {apiKey && projectId && (
          <div className="mt-8 p-4 bg-zinc-700 rounded-xl border border-zinc-600">
            <p className="text-sm text-zinc-300 mb-2">Install agent:</p>
            <pre className="text-sm bg-zinc-800 p-3 rounded-lg overflow-auto border border-zinc-700">
              npm install log-sential-agent
            </pre>

            <p className="text-sm text-zinc-300 mt-4 mb-2">Usage example:</p>
            <pre className="text-sm bg-zinc-800 p-3 rounded-lg overflow-auto border border-zinc-700">
              {`import logsential from "log-sential-agent";

app.use(logsential({
  api_key: "${apiKey}",
  project_id: "${projectId}"
}));`}
            </pre>

            <p className="text-sm text-zinc-400 mt-4">API Key: <span className="text-emerald-400">{apiKey}</span></p>
            <p className="text-sm text-zinc-400">Project ID: <span className="text-emerald-400">{projectId}</span></p>
          </div>
        )}

      </div>
    </div>
  );
}
