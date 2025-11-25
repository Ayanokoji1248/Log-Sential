// rules/detectSQLInjection.ts
export function detectSQLInjection(log: any) {
    const sqlPatterns = /(UNION|SELECT|INSERT|UPDATE|DELETE|DROP TABLE|--|#|\/\*)/i;

    if (sqlPatterns.test(log.url) || sqlPatterns.test(JSON.stringify(log.body || {}))) {
        return {
            project_id: log.project_id,
            log_id: log.id,
            rule_id: "R2",
            message: "SQL Injection attempt detected",
            severity: "high",
        };
    }
    return null;
}
