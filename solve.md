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

### 🚩 Flag 3: Multi-Layer Crypto (XOR → Hex → Base64)
- **Flag**: `ARTIMAS{xor_hex_layers_peeled}`
- **Challenge**: The payload has been transformed through three layers before transmission.
- **How to crack**:
  1. Take the payload from the challenge page: `MDIwNjEyMGExOTA3MTAyZjNlMmMyNjE5MmIzMTNlMWMzODI3M2EzMTM0MzAwYjM2MjYzMTJhMjYzMDNi`
  2. **Layer 1 — Base64 decode**: `base64.b64decode(payload)` → gives a hex string.
  3. **Layer 2 — Hex decode**: `bytes.fromhex(hex_string)` → gives raw XOR bytes.
  4. **Layer 3 — XOR with key `CTF`** (repeating): `chr(byte ^ ord('CTF'[i%3]))` for each byte.
  5. Python one-liner:
     ```python
     import base64
     payload = 'MDIwNjEyMGExOTA3MTAyZjNlMmMyNjE5MmIzMTNlMWMzODI3M2EzMTM0MzAwYjM2MjYzMTJhMjYzMDNi'
     key = b'CTF'
     hex_s = base64.b64decode(payload).decode()
     xb = bytes.fromhex(hex_s)
     print(''.join(chr(b ^ key[i%3]) for i, b in enumerate(xb)))
     ```

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
- **Challenge**: Metadata hidden inside an image — but not in the obvious field.
- **How to crack**:
  1. Download `challenge.jpg`.
  2. Run `exiftool challenge.jpg` and read **every** field carefully.
  3. Notice `Image Description: 2026 IEEE Conference -- Dubai` — this is a **red herring**.
  4. Look at the `User Comment` field: `QVJUSU1BU3tkZWVwZXJfdGhhbl95b3VfdGhpbmt9`.
  5. That value is Base64-encoded. Decode it:
     - Terminal: `echo "QVJUSU1BU3tkZWVwZXJfdGhhbl95b3VfdGhpbmt9" | base64 -d`
     - Python: `import base64; base64.b64decode("QVJUSU1BU3tkZWVwZXJfdGhhbl95b3VfdGhpbmt9").decode()`
  6. Result: `ARTIMAS{deeper_than_you_think}`

---

### 🚩 Flag 6: Profile Trace (Harder — Assemble the Handle)
- **Flag**: `ARTIMAS{0s1nt_pr0f1l3_tr4c3d}`
- **Challenge**: Reconstructing a full username from a partially redacted intel report.
- **How to crack**:
  1. Read the intercepted intel report on the challenge page.
  2. Notice the visible fields:
     - `FIELD_01  Forum alias   : artimas`
     - `FIELD_02  Activity tag  : ctf_player`
     - `FIELD_03  Full handle   : ████████████████████` (redacted)
  3. Assemble the full handle: `artimas` + `_ctf_` + `player` = **`artimas_ctf_player`**
     - The separator `_ctf_` connects the forum alias to the activity tag.
  4. Type `artimas_ctf_player` into the simulated search terminal on the page.
  5. Click the resulting **Public Profile** link → the flag is displayed on the profile page.

---

### 🚩 Flag 7: Log Analysis
- **Flag**: `ARTIMAS{hidden_message_extracted}`
- **Challenge**: A flag buried in a large text-based log file.
- **How to crack**:
  1. Download `syslog_export.txt`.
  2. Use a search tool: `grep "ARTIMAS" syslog_export.txt`.
  3. The flag is hidden inside a `[DEBUG]` line in the middle of the noise.

---

### 🚩 Flag 8: Password Cracking
- **Flag**: `ARTIMAS{zip_password_cracked}`
- **Challenge**: A ZIP file protected by a password.
- **How to crack**:
  1. Download `challenge.zip`.
  2. Use `john` with `zip2john` or `fcrackzip`.
  3. The password is `artimas2026`. Extract the `flag.txt` inside.

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
