const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ──────────────────────────────────────────────────────────────────────────
// FLAG ANSWERS  (server-side only — never exposed to client)
// ──────────────────────────────────────────────────────────────────────────
const FLAG_ANSWERS = {
    flag1: 'ARTIMAS{view_source_reveals_secret}',
    flag2: 'ARTIMAS{found_admin_panel}',
    flag3: 'ARTIMAS{xor_hex_layers_peeled}',
    flag4: 'ARTIMAS{caesar_cipher_cracked}',
    flag5: 'ARTIMAS{deeper_than_you_think}',
    flag6: 'ARTIMAS{0s1nt_pr0f1l3_tr4c3d}',
    flag7: 'ARTIMAS{hidden_message_extracted}',
    flag8: 'ARTIMAS{zip_password_cracked}',
    flag9: 'ARTIMAS{metadata_tells_all}',
    flag10: 'ARTIMAS{http_header_mastered}'
};

const FLAG_ORDER = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5', 'flag6', 'flag7', 'flag8', 'flag9', 'flag10'];

// ──────────────────────────────────────────────────────────────────────────
// DATABASE
// ──────────────────────────────────────────────────────────────────────────
const dbDir = process.env.DB_DIR || './db';
const dbPath = path.join(dbDir, 'ctf.db');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

// Promisify helpers
const dbRun = (sql, params = []) => new Promise((res, rej) =>
    db.run(sql, params, function (err) { err ? rej(err) : res(this); }));
const dbGet = (sql, params = []) => new Promise((res, rej) =>
    db.get(sql, params, (err, row) => { err ? rej(err) : res(row); }));
const dbAll = (sql, params = []) => new Promise((res, rej) =>
    db.all(sql, params, (err, rows) => { err ? rej(err) : res(rows); }));

async function initDB() {
    try {
        console.log('[INIT] Initializing schema...');
        await dbRun(`
            CREATE TABLE IF NOT EXISTS users (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                username   TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role       TEXT NOT NULL DEFAULT 'participant',
                created_at INTEGER NOT NULL
            )
        `);
        await dbRun(`
            CREATE TABLE IF NOT EXISTS user_progress (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                username   TEXT NOT NULL,
                flag_id    TEXT NOT NULL,
                solved_at  INTEGER NOT NULL,
                UNIQUE(username, flag_id)
            )
        `);

        // Create default admin if none exists
        const admin = await dbGet("SELECT id FROM users WHERE role = 'admin'");
        if (!admin) {
            await dbRun(
                'INSERT INTO users (username, password_hash, role, created_at) VALUES (?,?,?,?)',
                ['admin', hashPw('ctf_admin'), 'admin', Date.now()]
            );
            console.log('✓ Default admin created  →  username: admin  |  password: ctf_admin');
        }
    } catch (err) {
        console.error(`[ERROR] Database initialization failed: ${err.message}`);
    }
}

// ──────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ──────────────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(session({
    secret: 'artimas_ctf_session_secret_2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
// Flag 10: HTTP Header Recon Middleware
app.use('/flag10/', (req, res, next) => {
    res.setHeader('X-Flag-Header', 'ARTIMAS{http_header_mastered}');
    next();
});

app.use(express.static(path.join(__dirname)));

// Root redirect
app.get('/', (req, res) => {
    if (req.session.user) {
        return req.session.user.role === 'admin'
            ? res.redirect('/admin/leaderboard.html')
            : res.redirect('/index.html');
    }
    res.redirect('/login.html');
});

function hashPw(pw) {
    return crypto.createHash('sha256').update(pw).digest('hex');
}

function requireAuth(req, res, next) {
    if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin')
        return res.status(403).json({ error: 'Admin access required' });
    next();
}

// ──────────────────────────────────────────────────────────────────────────
// AUTH ROUTES
// ──────────────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.json({ ok: false, error: 'Username and password are required.' });
    if (username.trim().length < 2)
        return res.json({ ok: false, error: 'Username must be at least 2 characters.' });
    if (password.length < 4)
        return res.json({ ok: false, error: 'Password must be at least 4 characters.' });
    if (username.toLowerCase() === 'admin')
        return res.json({ ok: false, error: 'That username is reserved.' });

    try {
        await dbRun(
            'INSERT INTO users (username, password_hash, role, created_at) VALUES (?,?,?,?)',
            [username.trim(), hashPw(password), 'participant', Date.now()]
        );
        const user = await dbGet('SELECT * FROM users WHERE username = ?', [username.trim()]);
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.json({ ok: true, role: 'participant', username: user.username });
    } catch (e) {
        res.json({ ok: false, error: 'That username is already taken.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.json({ ok: false, error: 'Enter your credentials.' });

    const user = await dbGet(
        'SELECT * FROM users WHERE username = ? AND password_hash = ?',
        [username.trim(), hashPw(password)]
    );

    if (!user) return res.json({ ok: false, error: 'Invalid username or password.' });

    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.json({ ok: true, role: user.role, username: user.username });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', (req, res) => {
    if (!req.session.user) return res.json({ authenticated: false });
    res.json({ authenticated: true, ...req.session.user });
});

// ──────────────────────────────────────────────────────────────────────────
// PARTICIPANT SCORE ROUTES
// ──────────────────────────────────────────────────────────────────────────
app.get('/api/scores/me', requireAuth, async (req, res) => {
    const rows = await dbAll(
        'SELECT flag_id, solved_at FROM user_progress WHERE username = ?',
        [req.session.user.username]
    );
    const progress = {};
    rows.forEach(r => { progress[r.flag_id] = { solved: true, time: r.solved_at }; });
    res.json(progress);
});

app.post('/api/scores/flag', requireAuth, async (req, res) => {
    const { answer } = req.body;
    if (!answer) return res.json({ ok: false, error: 'No answer provided.' });

    const username = req.session.user.username;
    const solved = await dbAll(
        'SELECT flag_id FROM user_progress WHERE username = ?', [username]
    );
    const solvedSet = new Set(solved.map(r => r.flag_id));

    const match = Object.entries(FLAG_ANSWERS).find(
        ([id, ans]) => !solvedSet.has(id) && ans === answer.trim()
    );

    if (match) {
        const [flagId] = match;
        await dbRun(
            'INSERT OR IGNORE INTO user_progress (username, flag_id, solved_at) VALUES (?,?,?)',
            [username, flagId, Date.now()]
        );
        return res.json({ ok: true, flagId });
    }

    const alreadySolved = Object.entries(FLAG_ANSWERS).find(
        ([id, ans]) => solvedSet.has(id) && ans === answer.trim()
    );
    res.json({ ok: false, alreadySolved: !!alreadySolved });
});

app.post('/api/scores/reset', requireAuth, async (req, res) => {
    await dbRun('DELETE FROM user_progress WHERE username = ?', [req.session.user.username]);
    res.json({ ok: true });
});

// ──────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ──────────────────────────────────────────────────────────────────────────
async function buildParticipantRow(u) {
    const progress = await dbAll(
        'SELECT flag_id, solved_at FROM user_progress WHERE username = ? ORDER BY solved_at ASC',
        [u.username]
    );
    const solvedCount = progress.length;
    const startTime = u.created_at;
    const flagTimes = FLAG_ORDER.map(fid => {
        const p = progress.find(r => r.flag_id === fid);
        return p ? Math.floor((p.solved_at - startTime) / 1000) : 0;
    });
    const lastSolve = progress.length ? progress[progress.length - 1].solved_at : null;
    const totalElapsed = lastSolve ? Math.floor((lastSolve - startTime) / 1000) : 0;
    return { ...u, solvedCount, flagTimes, totalElapsed };
}

app.get('/api/admin/participants', requireAdmin, async (req, res) => {
    const users = await dbAll(
        "SELECT id, username, created_at FROM users WHERE role = 'participant' ORDER BY created_at ASC"
    );
    const result = await Promise.all(users.map(buildParticipantRow));
    res.json(result);
});

app.delete('/api/admin/participants/:id', requireAdmin, async (req, res) => {
    const user = await dbGet(
        "SELECT username FROM users WHERE id = ? AND role = 'participant'", [req.params.id]
    );
    if (!user) return res.json({ ok: false, error: 'Not found' });
    await dbRun('DELETE FROM user_progress WHERE username = ?', [user.username]);
    await dbRun('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
});

app.post('/api/admin/participants', requireAdmin, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.json({ ok: false, error: 'Username and password required.' });
    try {
        await dbRun(
            'INSERT INTO users (username, password_hash, role, created_at) VALUES (?,?,?,?)',
            [username.trim(), hashPw(password), 'participant', Date.now()]
        );
        res.json({ ok: true });
    } catch (e) {
        res.json({ ok: false, error: 'Username already taken.' });
    }
});

app.post('/api/admin/participants/:id/reset', requireAdmin, async (req, res) => {
    const user = await dbGet('SELECT username FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.json({ ok: false, error: 'Not found' });
    await dbRun('DELETE FROM user_progress WHERE username = ?', [user.username]);
    res.json({ ok: true });
});

app.get('/api/admin/leaderboard', requireAdmin, async (req, res) => {
    const users = await dbAll(
        "SELECT id, username, created_at FROM users WHERE role = 'participant'"
    );
    const rows = await Promise.all(users.map(buildParticipantRow));
    rows.sort((a, b) => b.solvedCount - a.solvedCount || a.totalElapsed - b.totalElapsed);
    res.json(rows);
});

app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4)
        return res.json({ ok: false, error: 'Password too short (min 4 chars).' });
    await dbRun("UPDATE users SET password_hash = ? WHERE role = 'admin'", [hashPw(newPassword)]);
    res.json({ ok: true });
});

app.post('/api/admin/wipe', requireAdmin, async (req, res) => {
    await dbRun('DELETE FROM user_progress');
    await dbRun("DELETE FROM users WHERE role = 'participant'");
    res.json({ ok: true });
});

// ──────────────────────────────────────────────────────────────────────────
// START
// ──────────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────
// START
// ──────────────────────────────────────────────────────────────────────────
initDB().then(() => {
    app.listen(PORT, () => {
        console.log('\n╔══════════════════════════════════════════════════╗');
        console.log('║         ARTIMAS CTF Server — Running              ║');
        console.log('╠══════════════════════════════════════════════════╣');
        console.log(`║  URL    →  http://localhost:${PORT}                 ║`);
        console.log('║  Admin  →  username: admin  |  pw: ctf_admin      ║');
        console.log('╚══════════════════════════════════════════════════╝\n');
        console.log("Share your machine's local IP for LAN access.\n");
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
