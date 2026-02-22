# 🚩 CTF Challenge Master Index — ARTIMAS Series

All challenges are inside numbered folders under `ctf-challenges/`.
This file lists every flag, how it's hidden, and exactly how to find it.

---

## Flag 1 — View Source Reveals Secret

| | |
|---|---|
| **Folder** | `flag1/` |
| **File** | `Flag 1.html` |
| **Flag** | `ARTIMAS{view_source_reveals_secret}` |
| **Technique** | HTML comment hidden in page source |

**How to solve:**
1. Open `Flag 1.html` in a browser
2. Right-click → **View Page Source** (or press `Ctrl+U`)
3. Search for `<!--` — the flag is inside the HTML comment

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
| **Encoded** | `QVJUSUlBU3tiYXNlNjRfZGVjb2RlZF9zdWNjZXNzZnVsbHl9` |
| **Technique** | Base64 decoding |

**How to solve:**
1. Open `flag3.html` — displays the encoded string
2. Decode using any tool:
   - Online: [base64decode.org](https://www.base64decode.org)
   - Terminal: `echo "QVJUSUlBU3tiYXNlNjRfZGVjb2RlZF9zdWNjZXNzZnVsbHl9" | base64 -d`
3. Result → flag

---

## Flag 4 — Caesar Cipher Cracked

| | |
|---|---|
| **Folder** | `flag4/` |
| **File** | `flag4.html` |
| **Flag** | `ARTIMAS{caesar_cipher_cracked}` |
| **Encrypted** | `DUWLPDV{fdhvdu_flskhu_fudfnhg}` |
| **Technique** | Caesar cipher — shift of **3** (shift back by 3 to decode) |

**How to solve:**
1. Open `flag4.html` — displays the ciphertext
2. Apply ROT-3 in reverse (shift each letter back by 3):
   - Online: [cryptii.com](https://cryptii.com/pipes/caesar-cipher) → shift 23 (or -3)
   - Or manually: D→A, U→R, W→T …
3. Result → flag

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
| **Flag** | `ARTIMAS{osint_profile_traced}` |
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

## Flag 10 — Password in Plain Sight

| | |
|---|---|
| **Folder** | `flag10/` |
| **Files** | `notes.txt`, `index.html`, `SETUP.md` |
| **Flag** | `ARTIMAS{password_found_in_file}` |
| **Technique** | General Investigation — searching for the flag in a text file |

**How to solve:**
1. Download `notes.txt` from `index.html`.
2. Open the file and search for the flag pattern:
   - **Manual:** Read the list of reminders.
   - **CLI:** `grep "ARTIMAS" notes.txt`.
   - **Editor:** Use `Ctrl + F` and search for "ARTIMAS".
3. Result → flag

---

## Quick Reference

| # | Flag | Technique |
|---|---|---|
| 1 | `ARTIMAS{view_source_reveals_secret}` | HTML comment |
| 2 | `ARTIMAS{found_admin_panel}` | robots.txt recon |
| 3 | `ARTIMAS{base64_decoded_successfully}` | Base64 decode |
| 4 | `ARTIMAS{caesar_cipher_cracked}` | Caesar cipher (shift 3) |
| 5 | `ARTIMAS{location_identified_correctly}` | EXIF ImageDescription |
| 6 | `ARTIMAS{osint_profile_traced}` | OSINT username search |
| 7 | `ARTIMAS{hidden_message_extracted}` | Forensics — hidden in log |
| 8 | `ARTIMAS{zip_password_cracked}` | Password-protected ZIP (pw: `artimas2026`) |
| 9 | `ARTIMAS{metadata_tells_all}` | PDF Forensics — Author metadata field |
| 10 | `ARTIMAS{password_found_in_file}` | General Investigation — flag hidden in notes.txt |
