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

### 🚩 Flag 3: Base64 Decoding
- **Flag**: `ARTIMAS{base64_decoded_successfully}`
- **Challenge**: The flag is encoded using the Base64 algorithm.
- **How to crack**:
  1. Take the string: `QVJUSU1BU3tiYXNlNjRfZGVjb2RlZF9zdWNjZXNzZnVsbHl9`.
  2. Decode it via terminal: `echo "..." | base64 -d`
  3. Or via browser console: `atob("...")`.

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

### 🚩 Flag 5: EXIF Forensics
- **Flag**: `ARTIMAS{location_identified_correctly}`
- **Challenge**: Metadata hidden inside an image file.
- **How to crack**:
  1. Download `challenge.jpg`.
  2. **Option A (Terminal - No Tool Needed)**: Run `strings challenge.jpg | grep ARTIMAS`. It might find the flag if it's stored in plain text.
  3. **Option B (Online)**: Upload the file to [exif.regex.info](https://exif.regex.info/exif.cgi).
  4. **Option C (Install Tool)**: If you're on Mac, install it via Homebrew: `brew install exiftool`. Then run `exiftool challenge.jpg`.
  5. Look for the **Image Description** or **Comment** metadata field.

---

### 🚩 Flag 6: Profile Trace
- **Flag**: `ARTIMAS{0s1nt_pr0f1l3_tr4c3d}`
- **Challenge**: Tracking a digital footprint across platforms.
- **How to crack**:
  1. Note the username: `artimas_ctf_player`.
  2. **Option A (Simulated Search)**: Use the "Simulated Terminal Search" at the bottom of the challenge page. Type the username and hit Search.
  3. **Option B (Real OSINT)**: In a real scenario, you'd search this on GitHub or Gists.
  4. Follow the resulting link to the "Public Profile" to find the lekaed flag.

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
