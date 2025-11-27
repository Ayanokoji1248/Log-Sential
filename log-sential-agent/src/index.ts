import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express";
import axios from "axios";
dotenv.config({})


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

export function logsential(config: { apiKey: string, projectId: string, collectorUrl: string }) {
    return (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();

        res.on("finish", async () => {
            console.log("Log Entry")
            const log: LogEntry = {
                ip: req.ip,
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: Date.now() - start,
                user_agent: req.headers["user-agent"],
                user_id: (req as any).user?.id || undefined,  // optional JWT tracking later
                project_id: config.projectId,
                timestamp: new Date().toISOString(),
            };

            // // const safeParse = { ...req.body };
            // // console.log(safeParse)
            // console.log("RequestBody:", req.body)

            try {
                await axios.post(`${config.collectorUrl}/collect`, log, {
                    headers: { "x-api-key": config.apiKey }
                })

            } catch (error) {
                console.error("Collector API error: ", error)
            }

            // const { error } = await supabase.from("logs").insert([log]);
            // if (error) console.error("Supabase error: ", error)
            console.log('[LOG]:- ', log)
        })

        next()
    }
}

module.exports = { logsential }