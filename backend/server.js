const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. In-Memory Database
const requestLogs = [];
const blockedIPs = new Set(); // Stores banned IPs

// 2. The Gatekeeper Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip || '127.0.0.1'; // Detect User IP

    // CHECK 1: Is IP Banned?
    if (blockedIPs.has(ip)) {
        return res.status(403).json({ 
            message: "⛔ YOUR IP IS BANNED", 
            ip_banned: true 
        });
    }

    const payload = `${username} ${password}`;
    const timestamp = new Date().toLocaleTimeString();

    try {
        // CHECK 2: Ask Python AI
        const aiResponse = await axios.post('http://127.0.0.1:5001/predict', {
            payload: payload
        });

        const isThreat = aiResponse.data.is_threat;
        
        const logEntry = {
            id: Date.now(),
            timestamp,
            payload,
            is_threat: isThreat,
            ip: ip
        };
        requestLogs.unshift(logEntry);

        if (isThreat) {
            return res.status(403).json({ message: "Blocked by Aegis AI", log: logEntry });
        }

        res.json({ message: "Login Successful", user: username });

    } catch (error) {
        console.error("AI Engine Offline");
        res.status(500).json({ message: "Security System Offline" });
    }
});

// 3. New Route: Block an IP
app.post('/api/block-ip', (req, res) => {
    const { ip } = req.body;
    if (ip) {
        blockedIPs.add(ip);
        console.log(`⛔ Banned IP: ${ip}`);
        res.json({ message: `IP ${ip} blocked successfully` });
    }
});

// 4. Get Logs
app.get('/api/logs', (req, res) => res.json(requestLogs));

const PORT = 5000;
app.listen(PORT, () => console.log(`Gatekeeper Running on Port ${PORT}`));