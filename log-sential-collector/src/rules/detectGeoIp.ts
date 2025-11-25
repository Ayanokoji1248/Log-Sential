// rules/detectGeoIP.ts
import axios from "axios";

export async function detectGeoIP(log: any) {
  if (!log.url.includes("/login") || log.status !== 200) return null;

  const res = await axios.get(`https://ipapi.co/${log.ip}/country_name/`);
  const country = res.data;

  if (country !== "India") { // CHANGE to user's default
    return {
      project_id: log.project_id,
      log_id: log.id,
      rule_id: "R4",
      message: `Login from new country: ${country}`,
      severity: "medium",
    };
  }
  return null;
}
