# 🕵️ Flag 6 — OSINT Username Challenge: Setup Guide

## Overview
Participants are given a **username** and must search across online platforms
to find where the user has publicly posted the hidden flag.

**Flag:** `ARTIMAS{osint_profile_traced}`  
**Difficulty:** Beginner  
**Category:** OSINT  

---

## CTFd Challenge Description

> **Title:** Trace the User
>
> **Category:** OSINT | **Points:** 75
>
> **Description:**
>
> ---
> Our intel says someone goes by the username **`artimas_ctf_player`** online.
>
> They seem to have posted something publicly — but where?
> Real investigators don't wait for leads. They go looking.
>
> Find the flag they left behind.
>
> **Flag format:** `ARTIMAS{...}`
> ---

---

## How to Hide the Flag (Two Options)

### Option A — GitHub Gist (Recommended ✅)

1. Create a GitHub account (or use an existing one) with username `artimas_ctf_player`
   *(or any variant — update the challenge description to match)*
2. Go to [gist.github.com](https://gist.github.com)
3. Create a **Public** gist with filename `about_me.txt`
4. Paste the following content:

```
Name    : Artimas CTF Player
Handle  : artimas_ctf_player
About   : I play CTFs and leave breadcrumbs for people who look closely.
Contact : artimas[at]ctfmail.net

--- Notes ---
If you found this, you're on the right track. Keep digging.

Flag: ARTIMAS{osint_profile_traced}

Good job tracing my profile. Now go find the next one 🚩
```

5. Save the Gist. Share only the **Gist URL** (NOT the challenge answer) with admins for verification.

---

### Option B — Pastebin

1. Go to [pastebin.com](https://pastebin.com)
2. Create an account named `artimas_ctf_player`
3. Paste the same content above as a **Public** paste titled `about_me`
4. Direct participants to search `artimas_ctf_player pastebin` on Google as a hint

---

## Local Simulation (No Account Needed)

Use `mock_profile.html` in this folder — it simulates a GitHub Gist page
with the flag embedded. Serve it locally alongside `index.html`
for offline/local CTF events:

```bash
# Serve both files locally (Python)
python -m http.server 8080
# Visit: http://localhost:8080/index.html     ← challenge page
# Visit: http://localhost:8080/mock_profile.html  ← "found" page
```

---

## Hints for CTFd

| Cost | Hint |
|------|------|
| 10 pts | "OSINT starts with a simple search engine query." |
| 20 pts | "Try searching the username on GitHub or Pastebin." |
| 30 pts | "Check their public Gist — they posted some notes about themselves." |

---

## How Participants Solve It

```
Step 1 → Get username: artimas_ctf_player
Step 2 → Google: "artimas_ctf_player" OR search GitHub/Pastebin
Step 3 → Find the public Gist / paste
Step 4 → Read about_me.txt → Flag: ARTIMAS{osint_profile_traced} 🏁
```

---

## Folder Structure

```
flag6/
├── index.html         ← challenge page (username + hints)
├── mock_profile.html  ← simulated Gist profile (local use)
└── SETUP.md           ← this file
```
