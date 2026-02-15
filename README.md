# 🛡️ Aegis: AI-Powered Web Application Firewall (WAF)

## 📌 Overview
Aegis is a full-stack security dashboard that uses **Machine Learning (Random Forest)** to detect and block SQL Injection attacks in real-time. Unlike traditional firewalls that rely on static regex rules, Aegis analyzes the *mathematical entropy* and structure of requests to identify malicious intent.

## 🚀 Features
- **AI Threat Detection:** Uses a Python-based Random Forest model to classify payloads as Safe or Malicious.
- **Real-Time Dashboard:** React frontend displaying live traffic logs and threat status.
- **Active Defense:** Automated blocking of malicious requests.
- **Manual Override:** Admin capability to permanently ban IP addresses.
- **False Positive Correction:** Feedback loop to retrain the model on safe data.

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Recharts (Data Visualization)
- **Backend:** Node.js, Express (API Gateway)
- **AI Engine:** Python, Flask, Scikit-Learn, Pandas

## 🔧 How to Run
1. **Start the AI Engine:**
   ```bash
   cd ai-engine
   python app.py