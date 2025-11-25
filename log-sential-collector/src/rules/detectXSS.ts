// rules/detectXSS.ts
export function detectXSS(log: any) {
  if (JSON.stringify(log).includes("<script")) {
    return {
      project_id: log.project_id,
      log_id: log.id,
      rule_id: "R3",
      message: "XSS Payload Detected",
      severity: "high",
    };
  }
  return null;
}
