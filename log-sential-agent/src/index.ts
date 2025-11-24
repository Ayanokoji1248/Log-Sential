import dotenv from "dotenv"
dotenv.config({})
import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseKey!)

interface LogEntry {
    ip: string | undefined,
    method: string,
    url: string,
    status: number,
    duration: number,
    user_agent: string | undefined,
    user_id: string | undefined,
    project_id: string,
    alert?: string,
    severity?: "low" | "medium" | "high",
    timestamp: string,
}

export function logsential(project_id = "default-project") {
    return (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();

        res.on("finish", async () => {
            const log: LogEntry = {
                ip: req.ip,
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: Date.now() - start,
                user_agent: req.headers["user-agent"],
                user_id: (req as any).user?.id || undefined,  // optional JWT tracking later
                project_id,
                timestamp: new Date().toISOString(),
            };


            const { error } = await supabase.from("logs").insert([log]);
            if (error) console.error("Supabase error: ", error)
            console.log('[LOG]', log)
        })

        next()
    }
}

module.exports = { logsential }