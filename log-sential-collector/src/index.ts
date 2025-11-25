import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabaseConfig";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("LogSentinel Collector API Running"));

app.post("/collect", async (req, res) => {
    const apiKey = req.headers["x-api-key"];  // Client must send this

    // 1️⃣ Validate API KEY → find project
    const { data: project, error: keyError } = await supabase
        .from("projects")
        .select("id, user_id")
        .eq("api_key", apiKey)
        .single();

    if (!project) {
        console.log("❌ Invalid API Key:", apiKey);
        return res.status(403).json({ message: "Invalid API Key" });
    }

    // 2️⃣ Insert log into logs table
    const logData = {
        ...req.body,
        project_id: project.id,
        user_id: project.user_id
    };

    const { error: logError } = await supabase.from("logs").insert([logData]);

    if (logError) return res.status(500).json({ message: logError.message });

    console.log("Log inserted:", logData);
    res.json({ success: true });
});

app.listen(process.env.PORT || 4000, () =>
    console.log(`Collector running on http://localhost:${process.env.PORT}`)
);
