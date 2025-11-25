import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabaseConfig";

import { detectFailedLogins } from "./rules/detectFailedLogins";
import { detectSQLInjection } from "./rules/detechSQLInjection";
import { detectXSS } from "./rules/detectXSS";
import { detectGeoIP } from "./rules/detectGeoIp";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("LogSentinel Collector API Running"));

// ALL RULES HERE 🔥
const rules = [
    detectFailedLogins,
    detectSQLInjection,
    detectXSS,
    detectGeoIP,          // async 🌍
];

app.post("/collect", async (req, res) => {
    const apiKey = req.headers["x-api-key"];

    // 1️⃣ Validate API Key
    const { data: project } = await supabase
        .from("projects")
        .select("id, user_id")
        .eq("api_key", apiKey)
        .single();

    if (!project) {
        console.log("❌ Invalid API Key:", apiKey);
        return res.status(403).json({ message: "Invalid API Key" });
    }

    // 2️⃣ Insert log into DB
    const logData = {
        ...req.body,
        project_id: project.id,
        user_id: project.user_id,
    };

    const { data: insertedLog, error: logError } = await supabase
        .from("logs")
        .insert([logData])
        .select("id")
        .single();

    if (logError) return res.status(500).json({ message: logError.message });

    console.log("Log inserted:", insertedLog);

    // 3️⃣ Run ALL RULES HERE 👇
    for (const rule of rules) {
        try {
            const alert = await rule(logData, insertedLog.id); // pass log & log_id

            if (alert) {
                await supabase.from("alerts").insert([alert]);
                console.log("🚨 Alert Generated:", alert);
            }
        } catch (err) {
            console.error("Rule Error:", rule.name, err);
        }
    }

    res.json({ success: true });
});

app.listen(process.env.PORT || 4000, () =>
    console.log(`Collector running on http://localhost:${process.env.PORT}`)
);
