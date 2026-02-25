# 🏁 CTF Writeup: Solutions & Cracking Guide

This guide contains the flags and solving techniques for all 10 challenges in the ARTIMAS CTF series.

---

### 🚩 Flag 1: Fragmented Source
- **Flag**: `ARTIMAS{view_source_reveals_secret}`
- **Challenge**: The system secret has been fragmented into three separate Base64 packets.
- **How to crack**: 
  1. Open `flag1/index.html`.
  2. Right-click and select **View Page Source**.
  3. Look for the comment inside the `<script>` block at the bottom.
  4. Notice three packets: `PACKET_1`, `PACKET_2`, and `PACKET_3`.
  5. Decode each packet individually (e.g., using `atob()` or an online decoder).
  6. Join the three decoded fragments to form the complete flag.

---

### 🚩 Flag 2: Admin Discovery
- **Flag**: `ARTIMAS{found_admin_panel}`
- **Challenge**: Hidden files protected by `robots.txt`.
- **How to crack**:
  1. Navigate to `http://localhost:3000/flag2/robots.txt`.
  2. You will see `Disallow: /admin.html`.
  3. Navigate to `http://localhost:3000/flag2/admin.html` to find the flag.

---

### 🚩 Flag 3: Multi-Layer Crypto (Hex → Base64)
- **Flag**: `ARTIMAS{layered_crypto_revealed}`
- **Challenge**: The payload has been transformed through two layers before transmission.
- **How to crack**:
  1. Take the payload from the challenge page: `NDE1MjU0NDk0ZDQxNTM3YjZjNjE3OTY1NzI2NTY0NWY2MzcyNzk3MDc0NmY1ZjcyNjU3NjY1NjE2YzY1NjQ3ZA==`
  2. **Layer 1 — Base64 decode**: gives a hex string: `415254494d41537b6c6179...647d`
  3. **Layer 2 — Hex decode**: `bytes.fromhex(hex_string)` → plaintext flag
  4. Quick solve:
     - Python: `bytes.fromhex(base64.b64decode(payload).decode()).decode()`
     - CyberChef: From Base64 → From Hex

---

### 🚩 Flag 4: Caesar + Base64 (Multi-Layer)
- **Flag**: `ARTIMAS{caesar_cipher_cracked}`
- **Challenge**: A double-layer challenge combining Base64 encoding and a Caesar shift.
- **How to crack**:
  1. Take the text: `RFVXTFBEVntmZGh2ZHVfZmxza2h1X2Z1ZGZuaGd9`.
  2. **Layer 1**: Decode from Base64. You will get `DUWLPDV{fdhvdu_flskhu_fudfnhg}`.
  3. **Layer 2**: Shift the resulting text **backward by 3** positions (A=X, B=Y... D=A).
  4. Use an online "Caesar Decryptor" with a shift of -3.

---

### 🚩 Flag 5: Deep EXIF Forensics
- **Flag**: `ARTIMAS{deeper_than_you_think}`
- **Challenge**: Metadata hidden inside an image — but not in the obvious field, and not in the usual encoding.
- **How to crack**:
  1. Download `challenge.jpg`.
  2. Run `exiftool challenge.jpg` and read **every** field carefully.
  3. Notice `Image Description: 2026 IEEE Conference -- Dubai` — **red herring**.
  4. Notice `Artist: ctf_admin@artimas.org` — **another red herring**.
  5. Look at the `User Comment` field: `415254494d41537b6465657065725f7468616e5f796f755f7468696e6b7d`
  6. That value is **hex-encoded** (only 0–9, a–f chars). Decode it:
     - Python: `bytes.fromhex("415254494d41537b6465657065725f7468616e5f796f755f7468696e6b7d").decode()`
     - CyberChef: From Hex
  7. Result: `ARTIMAS{deeper_than_you_think}`

---

### 🚩 Flag 6: Profile Trace (Harder — Decode, Assemble, Inspect Source)
- **Flag**: `ARTIMAS{0s1nt_pr0f1l3_tr4c3d}`
- **Challenge**: Reconstruct a username from encoded/obfuscated fragments, find the profile, then inspect the page source.
- **How to crack**:
  1. Read the intercepted intel report. The fragments are **obfuscated**:
     - `FIELD_01  Forum alias   : YXJ0aW1hcw==` → **Base64 decode** → `artimas`
     - `FIELD_02  Activity tag  : reyalp_ftc` → **Reverse the string** → `ctf_player`
  2. Combine with separator: `artimas` + `_` + `ctf_player` = **`artimas_ctf_player`**
  3. Enter `artimas_ctf_player` into the simulated search terminal → click the profile link.
  4. The profile page has 2 gists but **no visible flag**. The gist text says "Real investigators check the source."
  5. **View page source** (Ctrl+U or right-click → View Source) → find the HTML comment at the bottom:
     ```html
     <!-- Flag: ARTIMAS{0s1nt_pr0f1l3_tr4c3d} -->
     ```

---

### 🚩 Flag 7: Log Analysis
- **Flag**: `ARTIMAS{hidden_message_extracted}`
- **Challenge**: A flag buried in a large text-based log file.
- **How to crack**:
  1. Download `syslog_export.txt`.
  2. Use a search tool: `grep "ARTIMAS" syslog_export.txt`.
  3. The flag is hidden inside a `[DEBUG]` line in the middle of the noise.

---

### 🚩 Flag 8: Password Cracking (Leetspeak Password)
- **Flag**: `ARTIMAS{zip_password_cracked}`
- **Challenge**: A ZIP file protected by a leetspeak password.
- **How to crack**:
  1. Download `challenge.zip`.
  2. Read the hint: it says "secure vault" in leetspeak.
  3. Convert: `secure` → `s3cur3`, `vault` → `v4ult`, joined with underscore.
  4. Password: **`s3cur3_v4ult`**
  5. Extract `flag.txt` using `7z x challenge.zip -ps3cur3_v4ult` or enter in a GUI.
  6. Alternative: use `fcrackzip` or `john` with a wordlist.

---

### 🚩 Flag 9: PDF Metadata
- **Flag**: `ARTIMAS{metadata_tells_all}`
- **Challenge**: Flag hidden in a document's internal properties.
- **How to crack**:
  1. Download `challenge.pdf`.
  2. Open the file properties in your PDF viewer (File -> Properties).
  3. Check the **Author** field.

---

### 🚩 Flag 10: HTTP Header Recon
- **Flag**: `ARTIMAS{http_header_mastered}`
- **Challenge**: The flag is hidden in the server's response metadata.
- **How to crack**:
  1. Open Flag 10 in your browser.
  2. Open **Developer Tools** (F12 or Right-click -> Inspect).
  3. Go to the **Network** tab and refresh the page.
  4. Click on the request named `flag10/` (or the document request).
  5. Look at the **Response Headers** section on the right.
  6. Find the custom header: `X-Flag-Header`.
