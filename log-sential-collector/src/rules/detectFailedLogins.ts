import { supabase } from "../config/supabaseConfig";

export async function detectFailedLogins(log: any, logId: number) {
    console.log(log)
    // 🔍 Only check failed login requests
    if (!(log.url.includes("/login") && log.status === 401)) {
        return null;
    }else if(!(log.url.includes("/login") && log.status === 400)){
        return null
    }

    // 🕒 Check last 2 minutes
    const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();

    const { data: recentFails, error } = await supabase
        .from("logs")
        .select("id")
        .eq("ip", log.ip)
        .eq("status", 401)
        .gte("timestamp", since);

    if (error) {
        console.error("Error fetching logs:", error);
        return null;
    }

    console.log(recentFails)
    // 🚨 Rule triggered here
    if (recentFails && recentFails.length >= 5) {
        return {
            project_id: log.project_id,     // 👈 REQUIRED
            log_id: logId,                 // 👈 REQUIRED
            rule_id: "R1",
            message: "Multiple failed login attempts",
            severity: "high",
        };
    }

    return null;
}
