# 🚩 CTF Challenge Master Index — ARTIMAS Series

## 🚀 Running the Platform

This CTF platform is powered by a Node.js backend. You **must** access it through the server URL, not by opening HTML files directly.

### 1. Start the Server
In your terminal, run:
```bash
node server.js
```

### 2. Access the Hub
Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

> [!IMPORTANT]
> **Do not double-click .html files.** 
> Opening files via `file://` will cause login and flag submissions to fail due to browser security restrictions (CORS).

### 3. Stop the Server
To stop the server, go to the terminal where it's running and press:
`Ctrl + C`

---

## Flag 1 — View Source Reveals Secret

| | |
|---|---|
| **Folder** | `flag1/` |
| **File** | `Flag 1.html` |
| **Flag** | `ARTIMAS{view_source_reveals_secret}` |
| **Technique** | Fragmented Base64 packets in source |

**How to solve:**
1. Open `Flag 1.html` in a browser
2. Right-click → **View Page Source** (or press `Ctrl+U`)
3. Search for "PACKET" in the script block.
4. Decode the three Base64 fragments and join them.

---

## Flag 2 — Found Admin Panel

| | |
|---|---|
| **Folder** | `flag2/` |
| **Files** | `index.html`, `robots.txt`, `admin.html` |
| **Flag** | `ARTIMAS{found_admin_panel}` |
| **Technique** | `robots.txt` recon → hidden admin page |

**How to solve:**
1. Open `index.html` — normal welcome page, no links
2. Navigate to `robots.txt` — spot `Disallow: /admin.html`
3. Open `admin.html` directly → flag displayed on page

---

## Flag 3 — Base64 Decoded Successfully

| | |
|---|---|
| **Folder** | `flag3/` |
| **File** | `flag3.html` |
| **Flag** | `ARTIMAS{base64_decoded_successfully}` |
| **Encoded** | `QVJUSU1BU3tiYXNlNjRfZGVjb2RlZF9zdWNjZXNzZnVsbHl9` |
| **Technique** | Base64 decoding |

**How to solve:**
1. Open `flag3.html` — displays the encoded string
2. Decode using any tool:
   - Online: [base64decode.org](https://www.base64decode.org)
   - Terminal: `echo "QVJUSU1BU3tiYXNlNjRfZGVjb2RlZF9zdWNjZXNzZnVsbHl9" | base64 -d`
3. Result → flag

---

## Flag 4 — Multi-Layer Decryption Master

| | |
|---|---|
| **Folder** | `flag4/` |
| **File** | `flag4.html` |
| **Flag** | `ARTIMAS{caesar_cipher_cracked}` |
| **Encrypted** | `RFVXTFBEVntmZGh2ZHVfZmxza2h1X2Z1ZGZuaGd9` |
| **Technique** | Base64 → Caesar Cipher (shift 3) |

**How to solve:**
1. Open `flag4.html` — displays the encoded payload.
2. Peel back **Layer 1**: Decode from Base64 (using `atob` or terminal).
3. Peel back **Layer 2**: Shift the result back by 3 (D→A).
4. Result → flag

---

## Flag 5 — Location Identified Correctly

| | |
|---|---|
| **Folder** | `flag5/` |
| **Files** | `challenge.jpg`, `index.html`, `embed_exif.py`, `SETUP.md` |
| **Flag** | `ARTIMAS{location_identified_correctly}` |
| **Technique** | EXIF metadata — `ImageDescription` field |

**How to solve:**
1. Download `challenge.jpg` from `index.html`
2. Read its EXIF metadata using any of:
   - **ExifTool CLI:** `exiftool challenge.jpg` → look for `Image Description`
   - **Online:** [exif.regex.info](https://exif.regex.info/exif.cgi) → upload file
   - **Python:** `piexif.load("challenge.jpg")["0th"][270].decode()`
3. Result → flag in `ImageDescription` field

---

## Flag 6 — OSINT Profile Traced

| | |
|---|---|
| **Folder** | `flag6/` |
| **Files** | `index.html`, `mock_profile.html`, `SETUP.md` |
| **Flag** | `ARTIMAS{0s1nt_pr0f1l3_tr4c3d}` |
| **Technique** | OSINT — username search across platforms |

**How to solve:**
1. Open `index.html` — note the username: `artimas_ctf_player`
2. Search the username on GitHub, Pastebin, or Google
3. Find their public Gist / paste (`about_me.txt`)
4. Read the notes — flag is embedded in plain text
5. *(For local use: open `mock_profile.html` directly)*

---

## Flag 7 — Hidden Message Extracted

| | |
|---|---|
| **Folder** | `flag7/` |
| **Files** | `syslog_export.txt`, `index.html` |
| **Flag** | `ARTIMAS{hidden_message_extracted}` |
| **Technique** | Forensics — flag hidden inside a fake system log file |

**How to solve:**
1. Download `syslog_export.txt` from `index.html`
2. Open and read carefully — it looks like a normal server log
3. The flag is inside a `[DEBUG]` block in the middle of the file:
   ```
   > line 003: ARTIMAS{hidden_message_extracted}
   ```
4. Use `Ctrl+F` / `grep "ARTIMAS"` to find it quickly

---

## Flag 8 — ZIP Password Cracked

| | |
|---|---|
| **Folder** | `flag8/` |
| **Files** | `challenge.zip`, `index.html`, `SETUP.md` |
| **Flag** | `ARTIMAS{zip_password_cracked}` |
| **ZIP Password** | `artimas2026` |
| **Technique** | Password-protected ZIP cracking |

**How to solve:**
1. Download `challenge.zip` from `index.html`
2. Crack or guess the password (`artimas2026`):
   - **fcrackzip:** `fcrackzip -u -D -p rockyou.txt challenge.zip`
   - **john:** `zip2john challenge.zip > hash.txt` → `john hash.txt`
   - **7-Zip GUI:** open ZIP → enter password when prompted
3. Extract `flag.txt` → read the flag

---

## Flag 9 — PDF Metadata Tells All

| | |
|---|---|
| **Folder** | `flag9/` |
| **Files** | `challenge.pdf`, `index.html`, `SETUP.md` |
| **Flag** | `ARTIMAS{metadata_tells_all}` |
| **Technique** | PDF Forensics — flag hidden in Author metadata field |

**How to solve:**
1. Download `challenge.pdf` from `index.html`
2. Inspect the file metadata/properties:
   - **PDF Viewer:** Open in Acrobat/Chrome → **File** → **Properties** → Check **Author**.
   - **ExifTool CLI:** `exiftool challenge.pdf` → look for `Author` field.
   - **Strings:** `strings challenge.pdf | grep ARTIMAS`.
3. Result → flag

---

## Flag 10 — Signal in the Headers

| | |
|---|---|
| **Folder** | `flag10/` |
| **Files** | `index.html`, `SETUP.md` |
| **Flag** | `ARTIMAS{http_header_mastered}` |
| **Technique** | HTTP Recon — flag hidden in Response Headers |

**How to solve:**
1. Open Flag 10.
2. Open Browser DevTools (F12) → **Network** tab.
3. Refresh and click the page request.
4. Check **Response Headers** for `X-Flag-Header`.

---

## Quick Reference

| # | Flag | Technique |
|---|---|---|
| 1 | `ARTIMAS{view_source_reveals_secret}` | HTML comment |
| 2 | `ARTIMAS{found_admin_panel}` | robots.txt recon |
| 3 | `ARTIMAS{base64_decoded_successfully}` | Base64 decode |
| 4 | `ARTIMAS{caesar_cipher_cracked}` | Caesar cipher (shift 3) |
| 5 | `ARTIMAS{location_identified_correctly}` | EXIF ImageDescription |
| 6 | `ARTIMAS{0s1nt_pr0f1l3_tr4c3d}` | OSINT username search |
| 7 | `ARTIMAS{hidden_message_extracted}` | Forensics — hidden in log |
| 8 | `ARTIMAS{zip_password_cracked}` | Password-protected ZIP (pw: `artimas2026`) |
| 9 | `ARTIMAS{metadata_tells_all}` | PDF Forensics — Author metadata field |
| 10 | `ARTIMAS{http_header_mastered}` | Response Headers |
