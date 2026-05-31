const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const SAVES_DIR = path.join(__dirname, 'saves');
const LOG_FILE = path.join(__dirname, 'game_logs.txt');

if (!fs.existsSync(SAVES_DIR)) fs.mkdirSync(SAVES_DIR);

app.post('/api/log-action', (req, res) => {
    const { sessionId, action, shift, trust } = req.body;
    const logLine = `${new Date().toISOString()} | ${sessionId || 'anon'} | смена ${shift} | ${action} | доверие: ${trust}\n`;
    fs.appendFileSync(LOG_FILE, logLine);
    res.json({ success: true });
});

app.post('/api/save', (req, res) => {
    const { sessionId, gameState } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    const filePath = path.join(SAVES_DIR, `${sessionId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(gameState, null, 2));
    res.json({ success: true });
});

app.get('/api/load/:sessionId', (req, res) => {
    const filePath = path.join(SAVES_DIR, `${req.params.sessionId}.json`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'not found' });
    res.json(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.get('/api/game-state', (req, res) => {
    res.json({ status: 'active', version: '1.0.0', pwa: true, restApi: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});