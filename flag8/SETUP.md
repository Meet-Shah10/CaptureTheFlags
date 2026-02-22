# 🔒 Flag 8 — ZIP Password Challenge: Setup Guide

## Overview
Participants receive a password-protected ZIP file and must crack or guess
the password to extract `flag.txt` and read the flag.

**Flag:** `ARTIMAS{zip_password_cracked}`  
**ZIP Password:** `artimas2026`  
**Difficulty:** Beginner  
**Category:** Cryptography / Forensics

---

## Step-by-Step Setup

### 1. Files in this folder
```
flag8/
├── flag.txt         ← contains the flag (source, keep private)
├── challenge.zip    ← password-protected ZIP (distribute this)
├── index.html       ← web challenge page
└── SETUP.md         ← this file
```

### 2. How the ZIP was created
Using Python + `pyzipper` with AES-256 encryption:
```python
import pyzipper
with pyzipper.AESZipFile('challenge.zip', 'w',
        compression=pyzipper.ZIP_DEFLATED,
        encryption=pyzipper.WZ_AES) as zf:
    zf.setpassword(b'artimas2026')
    zf.write('flag.txt')
```

To recreate it:
```bash
pip install pyzipper
python -c "
import pyzipper
with pyzipper.AESZipFile('challenge.zip','w',compression=pyzipper.ZIP_DEFLATED,encryption=pyzipper.WZ_AES) as zf:
    zf.setpassword(b'artimas2026')
    zf.write('flag.txt')
"
```

### 3. Verify the ZIP works
```bash
python -c "
import pyzipper
with pyzipper.AESZipFile('challenge.zip') as zf:
    zf.setpassword(b'artimas2026')
    print(zf.read('flag.txt').decode())
"
# → ARTIMAS{zip_password_cracked}
```

---

## CTFd Challenge Description

> **Title:** Break the Lock
>
> **Category:** Forensics | **Points:** 100
>
> **Description:**
>
> ---
> We intercepted an encrypted archive from a suspicious source.
> The file inside could be the key to everything.
>
> But it's locked. Can you get in?
>
> 📦 **Download:** `challenge.zip`
>
> **Flag format:** `ARTIMAS{...}`
> ---

---

## CTFd Hint Text

> "Passwords in CTFs are often related to the event name or year. Think simple. If you want to automate it, try `fcrackzip -u -D -p wordlist.txt challenge.zip`."

---

## How Participants Solve It

| Method | Command / Steps |
|---|---|
| **Guess it** | Try `artimas`, `artimas2024`, `artimas2026`, `ctf2026` etc. |
| **fcrackzip** | `fcrackzip -u -D -p /usr/share/wordlists/rockyou.txt challenge.zip` |
| **john** | `zip2john challenge.zip > hash.txt` then `john hash.txt` |
| **7-Zip (GUI)** | Open ZIP → enter password when prompted |
| **Python** | `pyzipper.AESZipFile` with password |

```
Step 1 → Download challenge.zip
Step 2 → Try cracking the password (or guess: artimas2026)
Step 3 → Extract flag.txt
Step 4 → Read → ARTIMAS{zip_password_cracked} 🏁
```
