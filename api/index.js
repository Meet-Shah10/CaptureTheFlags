const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: 'Vercel' });
});

app.get('*', (req, res) => {
    res.send('<h1>ARTIMAS CTF - Minimal Boot Test</h1><p>If you see this, the Vercel infrastructure is working.</p>');
});

module.exports = app;
