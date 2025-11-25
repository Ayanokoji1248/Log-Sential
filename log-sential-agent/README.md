# 🛡️ LogSentinel Agent (`log-sential-agent`)

A lightweight **security & logging agent** for MERN applications — designed to capture security events and send them to your **SIEM dashboard in real time**.

It helps you detect:

* 🚨 Failed logins (Brute force attempts)
* 💉 SQL Injection attempts
* 🧪 Cross-Site Scripting (XSS)
* 🌍 Suspicious GeoIP login activity

> **Everything is visible LIVE on your dashboard — no extra setup needed.**

---

## ⚙️ How It Works

Once installed and configured, this agent automatically monitors incoming requests and sends security logs to your LogSentinel **collector server**.

You can view all the logs in your **web dashboard** — no database setup required.

---

## 🪪 Create Your Account (Important)

1. Visit the **LogSentinel Dashboard (website)**
2. Create a **Project**
3. You’ll get:

   * `projectId`
   * `apiKey`

Copy them. You'll use them in your MERN app.

---

## 📦 Installation

```bash
npm install log-sential-agent
```

---

## 🚀 Quick Setup (MERN / Express)

```ts
import express from "express";
import { logsential } from "log-sential-agent";

const app = express();

app.use(
  logsential({
    projectId: "YOUR_PROJECT_ID",
    apiKey: "YOUR_API_KEY",
  })
);
```

That’s it. Your logs will now start appearing in the **dashboard**.

---

## 🧠 Built-in Detection Rules

These rules automatically track **suspicious activity**:

| Rule                 | What It Detects                        |
| -------------------- | -------------------------------------- |
| `detectFailedLogins` | Brute-force login attempts             |
| `detectSQLInjection` | SQL injection patterns (`' OR 1=1 --`) |
| `detectXSS`          | Cross-site scripting                   |
| `detectGeoIP`        | Login from unusual/country-IP          |


---

## 🛠 Recommended Folder Structure

```
my-project/
│
├── src/
│   ├── middlewares/
│   │   └── logsential.ts
│   ├── controllers/
│   │   └── auth.ts
│
├── .env           <-- LOG_SENTINEL_API_KEY, PROJECT_ID
├── README.md
├── package.json
```

---

## 🚧 Roadmap (Upcoming Features)

* 🧪 `detectBruteForce` (Rate-limit login)
* 🚨 Slack / Discord / Email alerts
* 📊 Analytics dashboard with charts
* 🔍 AI-based threat detection
* ⏱ Rule-based response (block user automatically)
* More Rules will coming on the way

---

## 🤝 Contributing

Contributions & suggestions are welcome!
Submit issues & PRs at: **GitHub Repo (coming soon)**

---

## 📄 License

MIT License © 2025 LogSentinel

---

