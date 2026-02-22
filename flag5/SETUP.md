# 🌍 Flag 5 — OSINT EXIF Challenge: Setup Guide

## Overview
This challenge teaches participants to inspect **EXIF metadata** hidden inside a JPEG image —
a real-world OSINT skill used by investigators, journalists, and security researchers.

**Flag:** `ARTIMAS{location_identified_correctly}`
**Difficulty:** Beginner
**Category:** OSINT / Forensics

---

## Step-by-Step Setup

### 1. Get a Landmark Image
Use any freely licensed JPEG photo of a famous landmark, e.g.:
- Eiffel Tower (Paris)
- Big Ben (London)
- Burj Khalifa (Dubai)

Save it as `landmark.jpg` in this folder.

### 2. Install Dependencies
```bash
pip install piexif Pillow
```

### 3. Embed the Flag
Run the provided script:
```bash
python embed_exif.py
```
This writes `challenge.jpg` — the file you distribute to participants.

The flag is embedded in:
- **EXIF field:** `ImageDescription` (tag `0x010E`)
- **Value:** `ARTIMAS{location_identified_correctly}`

### 4. Verify It Worked
Using ExifTool (recommended):
```bash
exiftool challenge.jpg
```
Look for:
```
Image Description : ARTIMAS{location_identified_correctly}
```

Or using Python:
```python
import piexif
d = piexif.load("challenge.jpg")
print(d["0th"][piexif.ImageIFD.ImageDescription])
```

### 5. Deploy
- Serve `challenge.jpg` via `index.html` (already configured)
- Upload `challenge.jpg` as the downloadable file on CTFd
- Paste the CTFd description below

---

## CTFd Challenge Description

> **Title:** Hidden in Plain Sight
>
> **Category:** OSINT
>
> **Points:** 50
>
> **Description:**
>
> ---
> One of our agents photographed a famous landmark and sent us this image.
> But something is hidden in the file itself — not in the picture.
>
> Every digital photo carries invisible information attached to it.
> Can you figure out what's lurking beneath the surface?
>
> 📥 **Download:** `challenge.jpg`
>
> **Flag format:** `ARTIMAS{...}`
> ---

---

## Hints (add to CTFd if needed)

| Cost | Hint |
|------|------|
| 10 pts | "Cameras store more than just pixels — look at the file's metadata." |
| 20 pts | "Try `exiftool challenge.jpg` or visit exif.regex.info" |
| 30 pts | "Check the `ImageDescription` EXIF field specifically." |

---

## How Participants Solve It

| Tool | Command / Method |
|------|-----------------|
| ExifTool (CLI) | `exiftool challenge.jpg` |
| Python | `piexif.load("challenge.jpg")["0th"][270]` |
| Online | [exif.regex.info](https://exif.regex.info/exif.cgi) — upload file |
| Browser DevTools | Not applicable (metadata stripped by browsers) |

---

## Folder Structure

```
ctf-challenge-5/
├── landmark.jpg        ← your source image (not distributed)
├── challenge.jpg       ← output image given to participants
├── embed_exif.py       ← flag embedding script
├── index.html          ← web challenge page
└── SETUP.md            ← this file
```
